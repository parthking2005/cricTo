import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error';
import { API_ROUTES } from '@/lib/api';

/**
 * Photo detail API endpoint
 * This fetches a specific photo's details from Cricbuzz API and returns direct image URLs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const photoId = searchParams.get('id');

    if (!photoId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'Photo ID is required',
            status: 400
          }
        },
        { status: 400 }
      );
    }

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
      const response = await fetch(
        `https://cricbuzz-cricket2.p.rapidapi.com/photos/v1/detail/${photoId}`,
        {
          ...options,
          signal: controller.signal
        }
      );
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch photo details: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract image hash from response
      let imageHash = '';
      if (data.id && data.imageId) {
        // Extract hash from the API response
        imageHash = data.imageId;
      }
      
      // Return simplified response with direct image URLs
      return NextResponse.json({
        ...data,
        // Add direct URLs for all image sizes
        directUrls: imageHash ? {
          large: API_ROUTES.PHOTOS.IMAGE.LARGE(imageHash),
          medium: API_ROUTES.PHOTOS.IMAGE.MEDIUM(imageHash),
          small: API_ROUTES.PHOTOS.IMAGE.SMALL(imageHash),
          thumb: API_ROUTES.PHOTOS.IMAGE.THUMB(imageHash),
        } : null
      });
    } catch (error) {
      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return handleApiError(new Error('Photo detail fetch timed out'), 408);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching photo details:', error);
    return handleApiError(error, 500);
  }
} 