/**
 * Client-side error logger utility
 * Provides consistent error logging with optional reporting to a service
 */

// Configure this to send errors to your error tracking service
const REPORT_ERRORS = process.env.NODE_ENV === 'production';

/**
 * Log an error with consistent formatting
 * @param error The error object
 * @param source The source of the error (component name, function, etc.)
 * @param extraInfo Additional context about the error
 */
export function logError(
  error: unknown,
  source: string,
  extraInfo?: Record<string, any>
): void {
  // Convert unknown error to a standardized format
  const errorObject = normalizeError(error);
  
  // Add source and context
  const errorWithContext = {
    ...errorObject,
    source,
    ...(extraInfo ? { context: extraInfo } : {}),
    timestamp: new Date().toISOString(),
  };
  
  // Log the error to console
  console.error(`[ERROR][${source}]:`, errorWithContext);
  
  // Send to error tracking service if in production
  if (REPORT_ERRORS) {
    // Replace with your error reporting service
    // Example: Sentry.captureException(error, { extra: { source, ...extraInfo } });
  }
}

/**
 * Normalize different error types into a standard format
 */
function normalizeError(error: unknown): {
  message: string;
  stack?: string;
  code?: string;
  [key: string]: any;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      ...(error as any),
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }
  
  return {
    message: 'Unknown error',
    originalError: error,
  };
} 