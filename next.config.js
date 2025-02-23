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
    serverActions: {
      allowedOrigins: ['localhost:3000', '5.78.70.244', 'themidnightspa.com'],
      bodySizeLimit: '2mb'
    },
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
            value: 'public, max-age=120, must-revalidate, s-maxage=120'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=120'
          },
          {
            key: 'Cloudflare-CDN-Cache-Control',
            value: 'max-age=120'
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, x-user-agent'
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
