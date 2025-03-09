/**
 * Google Analytics script component for Next.js
 */
'use client'

import Script from 'next/script'

export function GoogleAnalytics() {
  // Use the hardcoded ID instead of environment variable
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Only render the GA script if we have a measurement ID
  if (!measurementId) return null

  return (
    <>
      {/* Google Analytics Script - with proper 'as' attribute */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        async
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
    </>
  )
}

export default GoogleAnalytics
