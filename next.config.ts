import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    cacheComponents: true,
  },
  bundlePagesRouterDependencies: true,
};

export default nextConfig;
