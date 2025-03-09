'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

/**
 * Google Analytics component that uses the official Next.js integration
 * The @next/third-parties/google package handles page view tracking automatically
 */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Only render if we have a measurement ID
  if (!measurementId) return null

  return <NextGoogleAnalytics gaId={measurementId} />
}

export default GoogleAnalytics
