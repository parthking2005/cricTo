/**
 * API utilities for CricTo application
 */

/**
 * Get the base URL for API requests
 * This works both on client and server side
 */
export function getBaseUrl(): string {
  // For client-side
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // For server-side with environment variable
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Fallback for server-side 
  return "http://localhost:3003";
}

/**
 * API routes for the application
 */
export const API_ROUTES = {
  NEWS: {
    LIST: "/api/news",
    DETAIL: (id: string) => `/api/news/detail?id=${id}`,
    CATEGORIES: "/api/news/categories",
  },
  CRICKET: {
    MATCHES: "/api/cricket",
    MATCH_DETAIL: (id: string) => `/api/match/${id}`,
  },
  IMAGES: {
    CRICBUZZ: (imageId: string | number) => `/api/image/${imageId}`,
  },
  PHOTOS: {
    LIST: "/api/photos",
    LIST_WITH_LAST_ID: (lastId: string | number) => `/api/photos?lastId=${lastId}`,
    DETAIL: (id: string | number) => `/api/photos/detail?id=${id}`,
    // Direct URLs for photo images
    IMAGE: {
      LARGE: (hash: string) => `https://static.cricbuzz.com/a/img/v1/980x570/i1/c${hash}/jpg`,
      MEDIUM: (hash: string) => `https://static.cricbuzz.com/a/img/v1/630x400/i1/c${hash}/jpg`,
      SMALL: (hash: string) => `https://static.cricbuzz.com/a/img/v1/300x170/i1/c${hash}/jpg`,
      THUMB: (hash: string) => `https://static.cricbuzz.com/a/img/v1/192x104/i1/c${hash}/jpg`,
    }
  }
};

/**
 * Error type for API errors
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generic fetch function with error handling and timeout
 * @param url The URL to fetch from
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds (default: 10000ms)
 * @returns The JSON response
 */
export async function fetchApi<T = any>(
  url: string, 
  options?: RequestInit,
  timeoutMs: number = 10000
): Promise<T> {
  try {
    // Add base URL if the URL doesn't already have it
    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
    
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(fullUrl, {
      ...options,
      cache: options?.cache || 'no-store', // Default to no-store
      signal: controller.signal,
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ApiError(`API error: ${response.status} ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    // Handle timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    // Re-throw ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle other errors
    console.error('API fetch error:', error);
    throw new ApiError(error instanceof Error ? error.message : 'Unknown API error', 500);
  }
}

/**
 * Get the image URL for Cricbuzz images with fallback
 * @param imageId The ID of the image
 * @returns The full image URL
 */
export async function getImageUrl(imageId?: string | number): Promise<string> {
  if (!imageId) {
    return '/placeholder-image.jpg'; // Path to a placeholder image in public folder
  }
  
  const imageIdStr = String(imageId);
  
  // If it's a photo ID format (numeric ID like 509274), use the photo detail endpoint
  if (/^\d+$/.test(imageIdStr) && imageIdStr.length > 5) {
    try {
      const photoData = await fetchApi(API_ROUTES.PHOTOS.DETAIL(imageIdStr));
      if (photoData?.directUrls?.medium) {
        return photoData.directUrls.medium;
      }
    } catch (error) {
      console.error(`Failed to get photo detail for ID ${imageIdStr}:`, error);
      // Fall through to alternative methods if the API call fails
    }
  }
  
  // If it looks like a hash (longer format with letters), use the direct URL
  if (imageIdStr.length > 5 && /[a-zA-Z]/.test(imageIdStr)) {
    return API_ROUTES.PHOTOS.IMAGE.MEDIUM(imageIdStr);
  }
  
  // For legacy IDs, use our proxy API
  return `${getBaseUrl()}${API_ROUTES.IMAGES.CRICBUZZ(imageId)}`;
} 