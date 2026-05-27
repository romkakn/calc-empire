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
};

export default nextConfig;
