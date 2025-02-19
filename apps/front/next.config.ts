//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { NextConfig } from 'next'

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

const nextConfig: NextConfig = {
  output: 'standalone',
  cleanDistDir: true,
  transpilePackages: ['@taskly/shared', '@taskly/ui'],
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
