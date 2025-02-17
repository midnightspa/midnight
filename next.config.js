/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib', 'types']
  },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json'
  },
  serverExternalPackages: ['punycode']
};

module.exports = nextConfig;