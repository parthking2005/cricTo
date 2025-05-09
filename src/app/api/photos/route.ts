import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error';

/**
 * Photos API endpoint
 * This fetches photos from Cricbuzz API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lastId = searchParams.get('lastId') || '';

    // Check if API key exists
    if (!process.env.RAPID_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'API key not configured',
            status: 500
          }
        },
        { status: 500 }
      );
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'cricbuzz-cricket2.p.rapidapi.com',
      },
    };

    // Create an AbortController for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // Construct the URL with lastId parameter if provided
      const path = lastId 
        ? `/photos/v1/index?lastId=${lastId}`
        : '/photos/v1/index';
      
      const response = await fetch(
        `https://cricbuzz-cricket2.p.rapidapi.com${path}`,
        {
          ...options,
          signal: controller.signal
        }
      );
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return handleApiError(new Error('Photos fetch timed out'), 408);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
    return handleApiError(error, 500);
  }
} 