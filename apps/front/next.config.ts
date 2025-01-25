//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { NextConfig } from 'next'

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const API_URL =
  process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_API_URL : ''

const nextConfig: NextConfig = {
  output: 'standalone',
  cleanDistDir: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
