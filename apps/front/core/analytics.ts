/**
 * Google Analytics service for tracking page views
 */
export class Analytics {
  private static instance: Analytics;
  private measurementId: string | null = null;

  private constructor() {
    // Initialize with the measurement ID from environment variables
    this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
  }

  /**
   * Get the singleton instance of Analytics
   */
  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * Track a page view in Google Analytics
   * @param path - The path of the page being viewed
   */
  public trackView(path: string): void {
    if (!this.measurementId) {
      console.error('Google Analytics Measurement ID is not configured');
      return;
    }

    // Only execute in browser environment
    if (typeof window !== 'undefined') {
      // Push to dataLayer if gtag is available
      if (window.gtag) {
        window.gtag('config', this.measurementId, {
          page_path: path,
        });
      }
    }
  }
}

// Declare global gtag function
declare global {
  interface Window {
    gtag: (command: string, measurementId?: string, config?: Record<string, unknown>) => void;
  }
}

/**
 * Get the Analytics instance
 */
export const getAnalytics = (): Analytics => {
  return Analytics.getInstance();
};

/**
 * Track a page view
 * @param path - The path of the page being viewed
 */
export const trackView = (path: string): void => {
  getAnalytics().trackView(path);
};
