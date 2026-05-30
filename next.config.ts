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
  // Force-set X-Robots-Tag so search engines crawl + index every page.
  // Vercel's edge has been observed adding `noindex` to *.vercel.app URLs;
  // this override is applied per-route at origin so we always emit `index, follow`.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-image-preview:large" },
        ],
      },
    ];
  },
};

export default nextConfig;
