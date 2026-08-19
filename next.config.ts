import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.71.50.109', 'localhost'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
} as any;

export default nextConfig;
