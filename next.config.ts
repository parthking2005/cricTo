import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/api/image/**',
      },
      {
        protocol: 'https',
        hostname: 'cricbuzz-cricket.p.rapidapi.com',
        pathname: '/img/**',
      }
    ],
  },
};

export default nextConfig;
