'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/error-logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the global error
    logError(error, 'GlobalFatalError', {
      digest: error.digest,
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-600 mb-8">
              The application encountered a critical error. We've been notified and are working to fix the issue.
            </p>
            <button
              onClick={() => reset()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 