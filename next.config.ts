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
  // No source maps in the public bundle — `dorks` that look for `*.js.map`
  // can't reconstruct our source tree.
  productionBrowserSourceMaps: false,
  // Header policy. Three jobs:
  //   1. /sitemap.xml and /robots.txt cache aggressively at the edge so
  //      Googlebot never hits a cold start.
  //   2. Every HTML page emits an `index, follow` X-Robots-Tag so Vercel's
  //      edge can't silently noindex *.vercel.app URLs.
  //   3. Site-wide security headers — frame-deny, nosniff, restrictive
  //      Permissions-Policy, strict-origin Referrer-Policy. These limit
  //      what an attacker can do if they ever inject content or trick a
  //      user into loading our pages inside an iframe.
  async headers() {
    const securityHeaders = [
      // Block being framed (clickjacking).
      { key: "X-Frame-Options", value: "DENY" },
      // No MIME-sniffing — browsers must trust the Content-Type we send.
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Don't leak the full referrer URL to cross-origin destinations.
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Disable every browser API we don't use. (camera, mic, geolocation,
      // payment, USB, midi, accelerometer, gyroscope, fullscreen popups…)
      {
        key: "Permissions-Policy",
        value:
          "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), interest-cohort=()",
      },
      // Force every embedded resource to upgrade http → https.
      // (HSTS already covers our origin; this catches third-party assets.)
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ];

    return [
      {
        source: "/sitemap.xml",
        headers: [
          ...securityHeaders,
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
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        // Everything that isn't an infrastructure file — index normally,
        // plus the full security-header set.
        source: "/:path((?!sitemap\\.xml$|robots\\.txt$).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: "index, follow, max-image-preview:large" },
        ],
      },
    ];
  },
};

export default nextConfig;
