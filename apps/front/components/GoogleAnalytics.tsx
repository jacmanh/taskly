/**
 * Google Analytics script component for Next.js
 */
'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { Suspense, useEffect } from 'react'
import { trackView } from '../core/analytics'
import { SearchParamsTracker } from './SearchParamsTracker'

/**
 * Main Google Analytics component that loads scripts and initializes tracking
 */
export function GoogleAnalytics() {
  const pathname = usePathname()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Track page views when the path changes
  useEffect(() => {
    if (!measurementId || !pathname) return

    // Track the page view with just the pathname
    // Search params will be handled by the SearchParamsTracker component
    trackView(pathname)
  }, [pathname, measurementId])

  // Only render the GA script if we have a measurement ID
  if (!measurementId) return null

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* Wrap useSearchParams in a Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsTracker />
      </Suspense>
    </>
  )
}

export default GoogleAnalytics
