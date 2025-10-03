import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { ppr: true },
  async rewrites() {
    return [
      { source: "/api/_diag/dashboard", destination: "/api/diag/dashboard" },
    ];
  },
};
export default nextConfig;
