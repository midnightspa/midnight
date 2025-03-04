/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com'
      },
      {
        protocol: 'https',
        hostname: 'themidnightspa.com'
      },
      {
        protocol: 'http',
        hostname: 'themidnightspa.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'http',
        hostname: '5.78.70.244'
      }
    ],
    domains: ['5.78.70.244', 'themidnightspa.com', 'localhost'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
    forceSwcTransforms: true
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  staticPageGenerationTimeout: 300,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

module.exports = nextConfig;
