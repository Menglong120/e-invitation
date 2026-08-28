import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chungdoi.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.chungdoi.com',
      },
    ],
  },
};

export default nextConfig;
