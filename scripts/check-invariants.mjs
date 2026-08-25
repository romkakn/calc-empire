#!/usr/bin/env node
// SEO invariant checker — plain Node ESM, no dependencies.
//
// Cannot import TS modules directly, so:
//   - data/calculators.json is read/parsed as JSON.
//   - src/lib/blog.ts is parsed textually with regex.
//
// Checks:
//   1. Calculator catalog <-> src/app/<slug>/page.tsx parity (both directions)
//   2. Blog catalog (BLOG_POSTS) <-> src/app/blog/<slug>/page.tsx parity (both directions)
//   3. relatedCalcs integrity (every related slug resolves to a live calculator)
//   4. Internal link integrity (every literal href="/..." resolves to a real route)
//   5. Sitemap child-id sync (the two hand-written route files must agree)
//
// Exit 0 if everything passes, exit 1 if anything fails.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const results = []; // { name, ok, violations: string[] }

function check(name, fn) {
  const violations = [];
  try {
    fn(violations);
  } catch (err) {
    violations.push(`checker crashed: ${err.stack || err}`);
  }
  results.push({ name, ok: violations.length === 0, violations });
}

function rel(p) {
  return path.relative(ROOT, p);
}

// ---------------------------------------------------------------------------
// Load data/calculators.json
// ---------------------------------------------------------------------------
const catalogPath = path.join(ROOT, "data/calculators.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const calculators = catalog.calculators ?? [];
const categories = catalog.categories ?? {};
const articles = catalog.articles ?? [];
const liveCalculators = calculators.filter((c) => c.status === "live");
const liveCalcSlugs = new Set(liveCalculators.map((c) => c.slug));

// ---------------------------------------------------------------------------
// Parse src/lib/blog.ts textually
// ---------------------------------------------------------------------------
const blogTsPath = path.join(ROOT, "src/lib/blog.ts");
const blogTsSrc = readFileSync(blogTsPath, "utf8");

// Extract the BLOG_POSTS array body so we don't pick up the `slug: string;`
// line from the BlogPost type declaration above it.
const blogArrayMatch = blogTsSrc.match(
  /export const BLOG_POSTS: BlogPost\[\] = \[([\s\S]*?)\n\];/,
);
if (!blogArrayMatch) {
  throw new Error("Could not locate BLOG_POSTS array in src/lib/blog.ts");
}
const blogArrayBody = blogArrayMatch[1];

// Split into individual post object literals by top-level `{ ... }` blocks
// (braces are not nested inside a single post entry beyond string content,
// so a simple depth counter over the array body is sufficient).
function splitTopLevelObjects(body) {
  const objects = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return objects;
}

const postBlocks = splitTopLevelObjects(blogArrayBody);

const blogPosts = postBlocks.map((block) => {
  const slugMatch = block.match(/slug:\s*"([^"]+)"/);
  const relatedMatch = block.match(/relatedCalcs:\s*\[([^\]]*)\]/);
  const relatedCalcs = relatedMatch
    ? [...relatedMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : [];
  return {
    slug: slugMatch ? slugMatch[1] : null,
    relatedCalcs,
  };
});

const blogSlugs = new Set(blogPosts.map((p) => p.slug).filter(Boolean));

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------
function dirHasPage(dir) {
  return existsSync(path.join(dir, "page.tsx"));
}

function listSubdirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) =>
    statSync(path.join(dir, name)).isDirectory(),
  );
}

const appDir = path.join(ROOT, "src/app");
const blogDir = path.join(appDir, "blog");

// ---------------------------------------------------------------------------
// Check 1: Calculator catalog parity
// ---------------------------------------------------------------------------
check("Calculator catalog parity", (violations) => {
  // Direction A: every live catalog entry has src/app/<slug>/page.tsx
  for (const c of liveCalculators) {
    const dir = path.join(appDir, c.slug);
    if (!dirHasPage(dir)) {
      violations.push(
        `catalog entry "${c.slug}" (status: live) has no src/app/${c.slug}/page.tsx`,
      );
    }
  }

  // Direction B: every src/app/*-calculator/ directory has a matching live entry
  const calcDirs = listSubdirs(appDir).filter((name) =>
    name.endsWith("-calculator"),
  );
  for (const name of calcDirs) {
    if (!liveCalcSlugs.has(name)) {
      violations.push(
        `src/app/${name}/ exists but has no "live" entry in data/calculators.json`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Check 2: Blog catalog parity
// ---------------------------------------------------------------------------
check("Blog catalog parity", (violations) => {
  // Direction A: every BLOG_POSTS slug has src/app/blog/<slug>/page.tsx
  for (const post of blogPosts) {
    if (!post.slug) {
      violations.push(`a BLOG_POSTS entry is missing a "slug" field`);
      continue;
    }
    const dir = path.join(blogDir, post.slug);
    if (!dirHasPage(dir)) {
      violations.push(
        `BLOG_POSTS entry "${post.slug}" has no src/app/blog/${post.slug}/page.tsx`,
      );
    }
  }

  // Direction B: every src/app/blog/*/ directory has a BLOG_POSTS entry
  const postDirs = listSubdirs(blogDir);
  for (const name of postDirs) {
    if (!blogSlugs.has(name)) {
      violations.push(
        `src/app/blog/${name}/ exists but has no matching entry in BLOG_POSTS`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Check 3: relatedCalcs integrity
// ---------------------------------------------------------------------------
check("relatedCalcs integrity", (violations) => {
  for (const post of blogPosts) {
    for (const relSlug of post.relatedCalcs) {
      if (!liveCalcSlugs.has(relSlug)) {
        violations.push(
          `post "${post.slug ?? "(unknown slug)"}" has relatedCalcs entry "${relSlug}" which is not a live calculator`,
        );
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Check 4: Internal link integrity
// ---------------------------------------------------------------------------
check("Internal link integrity", (violations) => {
  const categoryIds = new Set(Object.keys(categories));
  const stateSlugs = new Set();
  for (const c of liveCalculators) {
    if (c.programmatic?.type === "us-state") {
      for (const st of c.programmatic.states) {
        stateSlugs.add(`${c.slug}/${st}`);
      }
    }
  }

  const staticExtIgnore = /\.(xml|txt|ico|svg|png|webmanifest)$/i;

  function isValidRoute(route) {
    // strip query string / hash
    const clean = route.split("#")[0].split("?")[0];
    if (clean === "/" || clean === "") return true;
    if (clean === "/about" || clean === "/blog") return true;
    if (clean.startsWith("/.well-known/")) return true;
    if (staticExtIgnore.test(clean)) return true;

    const segments = clean.replace(/^\//, "").split("/");

    if (segments.length === 1) {
      const [seg] = segments;
      if (categoryIds.has(seg)) return true;
      if (liveCalcSlugs.has(seg)) return true;
      return false;
    }
    if (segments.length === 2) {
      const [first, second] = segments;
      if (first === "blog" && blogSlugs.has(second)) return true;
      if (stateSlugs.has(`${first}/${second}`)) return true;
      return false;
    }
    return false;
  }

  function walk(dir, files) {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const full = path.join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full, files);
      } else if (/\.(ts|tsx)$/.test(name)) {
        files.push(full);
      }
    }
  }

  const srcDir = path.join(ROOT, "src");
  const files = [];
  walk(srcDir, files);

  const hrefRe = /href="(\/[^"]*)"/g;
  const seen = new Set();

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    let m;
    hrefRe.lastIndex = 0;
    while ((m = hrefRe.exec(src))) {
      const route = m[1];
      if (!isValidRoute(route)) {
        const key = `${rel(file)}::${route}`;
        if (!seen.has(key)) {
          seen.add(key);
          violations.push(`${rel(file)}: href="${route}" does not resolve to a real route`);
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Check 5: Sitemap child-id sync
// ---------------------------------------------------------------------------
check("Sitemap child-id sync", (violations) => {
  const expected = `Object.keys(CATEGORIES).filter((id) => id !== "articles")`;
  const files = [
    path.join(ROOT, "src/app/sitemap.xml/route.ts"),
    path.join(ROOT, "src/app/sitemap/[file]/route.ts"),
  ];
  const missing = [];
  for (const f of files) {
    if (!existsSync(f)) {
      violations.push(`${rel(f)} does not exist`);
      continue;
    }
    const src = readFileSync(f, "utf8");
    if (!src.includes(expected)) {
      missing.push(rel(f));
    }
  }
  if (missing.length > 0) {
    violations.push(
      `the two hand-written sitemap files have diverged: expected filter expression ${JSON.stringify(
        expected,
      )} not found in: ${missing.join(", ")}`,
    );
  }
});

// ---------------------------------------------------------------------------
// Check 6: Article catalog parity
// ---------------------------------------------------------------------------
check("Article catalog parity", (violations) => {
  for (const a of articles) {
    if (a.status !== "live") continue;
    const rootDir = path.join(appDir, a.slug);
    const blogPostDir = path.join(blogDir, a.slug);
    if (!dirHasPage(rootDir) && !dirHasPage(blogPostDir)) {
      violations.push(
        `article "${a.slug}" is marked live but has no page at src/app/${a.slug}/ or src/app/blog/${a.slug}/ — the sitemap would publish a 404`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
let anyFail = false;
for (const r of results) {
  const status = r.ok ? "PASS" : "FAIL";
  if (!r.ok) anyFail = true;
  console.log(`[${status}] ${r.name} (${r.violations.length} violation${r.violations.length === 1 ? "" : "s"})`);
  if (!r.ok) {
    for (const v of r.violations) {
      console.log(`    - ${v}`);
    }
  }
}

process.exit(anyFail ? 1 : 0);
