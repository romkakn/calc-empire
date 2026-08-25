// Node ESM loader hooks used only by `npm test`.
//
// This repo's tsconfig uses moduleResolution "bundler", so source files
// (correctly, for Next.js/webpack/turbopack) import relative modules without
// an extension (e.g. `from "./site"`) and import JSON without an import
// attribute (e.g. `from "../../data/calculators.json"`). Native Node ESM
// requires both. Rather than rewrite production source to satisfy the test
// runner, this loader replicates bundler-style resolution:
//   - extensionless relative specifiers are resolved by probing .ts/.tsx/.js
//     and index.ts/index.tsx/index.js.
//   - .json specifiers are loaded as JSON without requiring an import
//     attribute in the importing file.
//
// Registered via `node --import ./scripts/test-loader-register.mjs`.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CANDIDATE_EXTS = [".ts", ".tsx", ".js", ".mjs"];

function probe(basePath) {
  for (const ext of CANDIDATE_EXTS) {
    if (existsSync(basePath + ext)) return basePath + ext;
  }
  for (const ext of CANDIDATE_EXTS) {
    const indexPath = path.join(basePath, "index" + ext);
    if (existsSync(indexPath)) return indexPath;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");

  if (isRelative && !path.extname(specifier)) {
    const importerPath = fileURLToPath(context.parentURL);
    const basePath = path.resolve(path.dirname(importerPath), specifier);
    const resolved = probe(basePath);
    if (resolved) {
      return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }
  }

  if (specifier.endsWith(".json") && (isRelative || path.isAbsolute(specifier))) {
    const importerPath = fileURLToPath(context.parentURL);
    const jsonPath = path.resolve(path.dirname(importerPath), specifier);
    if (existsSync(jsonPath)) {
      return { url: pathToFileURL(jsonPath).href, format: "json", shortCircuit: true };
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (context.format === "json" || (url.endsWith(".json") && !context.importAttributes?.type)) {
    const filePath = fileURLToPath(url);
    return {
      format: "json",
      source: readFileSync(filePath, "utf8"),
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
