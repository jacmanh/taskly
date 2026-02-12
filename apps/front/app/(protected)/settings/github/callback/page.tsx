'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@taskly/design-system';

function GitHubCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      // Send message to parent window with the OAuth data
      if (window.opener) {
        // Exchange code for token via API
        fetch('/api/github/auth/callback?code=' + code + '&state=' + state)
          .then((res) => res.json())
          .then((data) => {
            window.opener.postMessage(
              {
                type: 'github-auth-success',
                accessToken: data.accessToken,
              },
              window.location.origin
            );
            window.close();
          })
          .catch((error) => {
            console.error('Failed to exchange code for token', error);
            window.opener.postMessage(
              {
                type: 'github-auth-error',
                error: error.message,
              },
              window.location.origin
            );
            window.close();
          });
      }
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
