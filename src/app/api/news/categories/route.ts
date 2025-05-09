import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY || '',
        'X-RapidAPI-Host': 'cricbuzz-cricket2.p.rapidapi.com',
      },
    };

    // Create an AbortController for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        'https://cricbuzz-cricket2.p.rapidapi.com/news/v1/cat',
        {
          ...options,
          signal: controller.signal
        }
      );
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return handleApiError(new Error('News categories fetch timed out'), 408);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching news categories:', error);
    return handleApiError(error, 500);
  }
} 