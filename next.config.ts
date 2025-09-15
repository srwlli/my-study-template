import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Fix cross-origin warning for development
  allowedDevOrigins: ['192.168.1.200'],
};

export default nextConfig;
