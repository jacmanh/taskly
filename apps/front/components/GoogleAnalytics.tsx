/**
 * Google Analytics script component for Next.js
 */
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';
import { trackView } from '../core/analytics';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Track page views when the route changes
  useEffect(() => {
    if (!measurementId) return;
    
    // Combine pathname and search params for full URL tracking
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Track the page view
    trackView(url);
  }, [pathname, searchParams, measurementId]);

  // Only render the GA script if we have a measurement ID
  if (!measurementId) return null;

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
    </>
  );
}

export default GoogleAnalytics;
