import { Metadata } from 'next';
import { NewsListResponse, NewsStory } from '@/types/news';
import NewsCard from '../components/NewsCard';
import NewsCategoryFilter from '../components/NewsCategoryFilter';
import { fetchApi, API_ROUTES, ApiError } from '@/lib/api';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Cricket News | CricTo',
  description: 'Get the latest cricket news, updates, interviews, and features from around the world.',
};

export const revalidate = 600; // Revalidate this page every 10 minutes

// Make getNews accept an optional category parameter
async function getNews(categoryId?: string): Promise<NewsListResponse> {
  try {
    // Construct the URL with the category parameter if provided
    const url = categoryId 
      ? `${API_ROUTES.NEWS.LIST}?category=${categoryId}`
      : API_ROUTES.NEWS.LIST;
    
    return await fetchApi<NewsListResponse>(url);
  } catch (error) {
    console.error('Error fetching news:', error);
    if (error instanceof ApiError && error.status === 408) {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Failed to fetch news');
  }
}

function NewsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Add categoryId parameter to NewsContent
async function NewsContent({ categoryId }: { categoryId?: string }) {
  const newsData = await getNews(categoryId);
  
  // Filter out ad entries and only show stories
  const newsStories = newsData.storyList.filter(
    (item): item is NewsStory => 'story' in item
  );
  
  return (
    <>
      {newsStories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No news articles found</h3>
          <p className="text-gray-500 mt-2">Please check back later for updates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {newsStories.map((newsItem) => (
            <NewsCard key={newsItem.story.id} newsItem={newsItem} />
          ))}
        </div>
      )}
    </>
  );
}

// Update NewsPage to get the category from searchParams
export default function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryId = searchParams.category;
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Cricket News</h1>
      
      <NewsCategoryFilter />
      
      <Suspense fallback={<NewsLoading />}>
        <NewsContent categoryId={categoryId} />
      </Suspense>
    </main>
  );
} 