'use client';

import { useEffect, useState, Component, ReactNode } from 'react';
import { logError } from '@/lib/error-logger';

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  componentName?: string;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Class-based error boundary that catches React rendering errors
 * This is needed because React's error boundaries must be class components
 */
class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps, 
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    logError(error, `ErrorBoundary:${this.props.componentName || 'Unknown'}`, {
      componentStack: errorInfo.componentStack,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use the provided fallback or the default error UI
      return this.props.fallback || (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="text-red-800 font-medium mb-2">Component Error</h3>
          <p className="text-red-700 text-sm mb-2">
            Something went wrong loading this component.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Modern error boundary that catches non-rendering errors (event handlers, etc.)
 * This works alongside the class-based error boundary above
 */
export default function ErrorBoundary({ 
  children, 
  fallback,
  onError,
  componentName = 'UnknownComponent',
}: ComponentErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Handler for unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      logError(event.error, `RuntimeError:${componentName}`, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      setHasError(true);
      
      if (onError && event.error) {
        onError(event.error, { componentStack: '' });
      }
    };

    // Handler for unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      logError(event.reason, `PromiseRejection:${componentName}`, {
        reason: event.reason?.toString?.() || 'Unknown reason',
      });
      setHasError(true);
      
      if (onError && event.reason instanceof Error) {
        onError(event.reason, { componentStack: '' });
      }
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [componentName, onError]);

  // Reset the error state
  const resetError = () => {
    setHasError(false);
  };

  // Determine what to render
  if (hasError) {
    return fallback || (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-red-800 font-medium mb-2">Something went wrong</h3>
        <p className="text-red-700 text-sm">We encountered an error while displaying this content.</p>
        <button 
          onClick={resetError}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  // Wrap children in the class-based error boundary
  return (
    <ComponentErrorBoundary 
      fallback={fallback} 
      onError={onError}
      componentName={componentName}
    >
      {children}
    </ComponentErrorBoundary>
  );
} 