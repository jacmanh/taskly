/**
 * Analytics utility functions for tracking page views and events
 */

/**
 * Track a page view in Google Analytics
 * @param url The URL to track
 */
export const trackPageView = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] as string, {
      page_path: url,
    });
  }
};

/**
 * Track a custom event in Google Analytics
 * @param action The action name
 * @param params Additional event parameters
 */
export const trackEvent = (action: string, params: Record<string, unknown> = {}): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};
