/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'themidnightspa.com',
      },
      {
        protocol: 'http',
        hostname: 'themidnightspa.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '5.161.86.130',
      }
    ],
    domains: ['5.161.86.130', 'themidnightspa.com', 'localhost'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib', 'types']
  },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json'
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '5.161.86.130', 'themidnightspa.com'],
      bodySizeLimit: '2mb'
    },
    optimizePackageImports: ['@heroicons/react'],
    optimizeCss: true,
    forceSwcTransforms: true
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    // Add CSS optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };
    return config;
  },
};

module.exports = nextConfig;