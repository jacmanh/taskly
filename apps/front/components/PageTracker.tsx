"use client";

import { usePageTracking } from '../hooks/usePageTracking';

/**
 * Component that tracks page views using Google Analytics
 * This is a client component that should be included in the layout
 */
export function PageTracker() {
  // Use the page tracking hook
  usePageTracking();
  
  // This component doesn't render anything
  return null;
}
