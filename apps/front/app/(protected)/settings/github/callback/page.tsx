'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@taskly/design-system';

function GitHubCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state && window.opener) {
      // Relay OAuth params to parent window, which has the auth context to call the API
      window.opener.postMessage(
        { type: 'github-oauth-callback', code, state },
        window.location.origin
      );
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="mt-4 text-neutral-600">Connexion à GitHub en cours...</p>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <GitHubCallbackContent />
    </Suspense>
  );
}
