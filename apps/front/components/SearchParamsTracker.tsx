/**
 * Component to track search parameters changes in Google Analytics
 * This component is separated to handle useSearchParams with proper Suspense boundaries
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackView } from '../core/analytics';

export function SearchParamsTracker() {
  const searchParams = useSearchParams();
  const pathname = useRef<string | null>(null);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Set the initial pathname
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pathname.current = window.location.pathname;
    }
  }, []);

  // Track page views when search params change
  useEffect(() => {
    if (!measurementId || !pathname.current) return;
    
    // Only track if we have search params
    if (searchParams?.toString()) {
      const url = `${pathname.current}?${searchParams.toString()}`;
      trackView(url);
    }
  }, [searchParams, measurementId]);

  // This component doesn't render anything
  return null;
}
