import { NextResponse } from 'next/server'
import { MiddlewareHandler } from './registerMiddleware'

export const proxyMiddleware: MiddlewareHandler = (request, next) => {
  const url = new URL(request.url)

  if (url.pathname.startsWith('/api')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error('API_URL environment variable is not defined.')
    }

    const newUrl = `${apiUrl}${url.pathname}`
    return NextResponse.rewrite(newUrl)
  }

  return next()
}
