import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Image proxy API endpoint
 * This proxies image requests to Cricbuzz API to avoid exposing API keys to the client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = params.id;
    
    // Validate image ID
    if (!imageId || imageId === '0') {
      return serveLocalPlaceholder(request);
    }

    // Check if API key exists
    if (!process.env.RAPID_API_KEY) {
      console.error('RAPID_API_KEY environment variable is not configured');
      return serveLocalPlaceholder(request);
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
      // Fetch the image from Cricbuzz API
      const imageUrl = `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg`;
      const response = await fetch(imageUrl, {
        ...options,
        signal: controller.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Failed to fetch image ${imageId}: ${response.status} ${response.statusText}`);
        return serveLocalPlaceholder(request);
      }

      // Get the image buffer
      const buffer = await response.arrayBuffer();
      
      // Verify we got actual image data, not an error response
      if (buffer.byteLength < 100) { // Very small responses are likely errors
        console.error(`Suspiciously small image received for ID ${imageId}: ${buffer.byteLength} bytes`);
        return serveLocalPlaceholder(request);
      }

      // Return the image with proper content type
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      });
    } catch (error) {
      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error(`Image fetch timed out for ID ${imageId}`);
        return serveLocalPlaceholder(request);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    return serveLocalPlaceholder(request);
  }
}

/**
 * Serve the local placeholder image
 */
async function serveLocalPlaceholder(request: NextRequest): Promise<NextResponse> {
  try {
    // Use the Next.js public directory path
    const publicDir = join(process.cwd(), 'public');
    const placeholderPath = join(publicDir, 'placeholder-image.jpg');
    
    // Read the placeholder image file
    const data = await fs.readFile(placeholderPath);
    
    // Return the placeholder image with appropriate headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=604800', // Cache for 7 days
      },
    });
  } catch (fileError) {
    console.error('Failed to read placeholder image:', fileError);
    
    // Fallback to redirect if file reading fails
    return NextResponse.redirect(new URL('/placeholder-image.jpg', request.url));
  }
} 