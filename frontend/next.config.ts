import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/openlobby-media/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/openlobby-media/**',
      },
    ],
  },
};

export default nextConfig;
