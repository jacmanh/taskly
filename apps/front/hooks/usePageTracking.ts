import { trackPageView } from '@taskly/shared'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to track page views in Google Analytics
 * Automatically tracks page views when the route changes
 */
export const usePageTracking = (): void => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // Construct the full URL including search parameters
      const url = searchParams?.size ? `${pathname}?${searchParams.toString()}` : pathname

      // Track the page view
      trackPageView(url)
    }
  }, [pathname, searchParams])
}
