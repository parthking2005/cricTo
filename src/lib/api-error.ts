import { NextResponse } from 'next/server';

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    status: number;
    code?: string;
  };
}

/**
 * Standard error handler for API routes
 * @param error The error that occurred
 * @param status HTTP status code to return
 * @returns A standardized error response
 */
export function handleApiError(
  error: unknown, 
  status = 500
): NextResponse<ApiErrorResponse> {
  console.error('API error:', error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';
    
  const errorCode = error instanceof Error && 'code' in error 
    ? (error as any).code 
    : undefined;
    
  return NextResponse.json(
    {
      success: false,
      error: {
        message: errorMessage,
        status,
        ...(errorCode ? { code: errorCode } : {})
      }
    },
    { status }
  );
} 