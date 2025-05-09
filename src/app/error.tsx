'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logError } from '@/lib/error-logger';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error using our centralized logger
    logError(error, 'GlobalErrorBoundary', {
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 mx-auto mb-4 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
        
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Our team has been notified of this issue.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
          <button
            onClick={() => {
              // Log the reset attempt
              logError({ message: 'User triggered error boundary reset' }, 'ErrorBoundaryReset');
              reset();
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition font-medium"
          >
            Try again
          </button>
          
          <Link href="/" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 