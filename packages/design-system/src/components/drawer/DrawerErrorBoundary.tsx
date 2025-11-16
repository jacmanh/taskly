'use client';

import * as React from 'react';

interface DrawerErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  drawerId: string;
}

interface DrawerErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Drawer Content
 * Prevents errors in drawer content from crashing the entire application
 * Displays a user-friendly error message when errors occur
 */
export class DrawerErrorBoundary extends React.Component<
  DrawerErrorBoundaryProps,
  DrawerErrorBoundaryState
> {
  constructor(props: DrawerErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): DrawerErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env['NODE_ENV'] === 'development') {
      console.error('Drawer Error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Une erreur s'est produite
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Le contenu du drawer n'a pas pu être chargé correctement.
          </p>
          {process.env['NODE_ENV'] === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-secondary-700 mb-2">
                Détails de l'erreur (dev)
              </summary>
              <pre className="text-xs bg-secondary-100 p-3 rounded overflow-auto max-h-48">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
