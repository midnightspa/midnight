import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [280, 320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: 'attachment',
    loader: 'default',
    path: '/_next/image',
    domains: ['localhost'],
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@radix-ui/react-icons', 'lucide-react'],
    webpackBuildWorker: true,
    turbotrace: {
      logLevel: 'error',
      logDetail: true,
    },
    scrollRestoration: true,
    workerThreads: true,
    optimizeServerReact: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 50000,
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            shared: {
              name: (module: any) => {
                const match = module.identifier().match(/node_modules\/(.*?)\//)
                return match ? `shared-${match[1]}` : 'shared'
              },
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: 10,
            },
          },
        },
      }
    }

    // Add image optimization
    if (!isServer) {
      config.module.rules.push({
        test: /\.(jpe?g|png|webp|avif)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              webp: {
                quality: 85,
              },
              avif: {
                quality: 85,
              },
            },
          },
        ],
      });
    }

    return config;
  },
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-CH',
            value: 'DPR, Width, Viewport-Width',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },
}

// Analyze bundle in production
const config = process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer({})(nextConfig)
  : nextConfig

export default config 