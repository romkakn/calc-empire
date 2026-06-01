import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack to this project root — there's a stray ~/package-lock.json
  // higher up that otherwise confuses workspace detection.
  turbopack: {
    root: path.join(__dirname),
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // Header policy:
  //   - Every HTML page emits `X-Robots-Tag: index, follow` so Vercel's edge
  //     can't quietly mark *.vercel.app URLs as noindex.
  //   - /sitemap.xml and /robots.txt are infrastructure files — they should
  //     be cached aggressively at the edge (so Googlebot never times out on
  //     a cold start) and NOT carry an `index, follow` directive of their
  //     own. We explicitly tell crawlers `noindex` on those files so they
  //     don't try to index the sitemap itself as a page.
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        // Everything that isn't an infrastructure file — index normally.
        source: "/:path((?!sitemap\\.xml$|robots\\.txt$).*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-image-preview:large" },
        ],
      },
    ];
  },
};

export default nextConfig;
