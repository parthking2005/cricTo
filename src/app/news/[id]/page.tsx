import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { NewsDetailResponse } from '@/types/news';
import { formatDate } from '@/lib/utils';
import CoverImage from '@/app/components/CoverImage';
import AuthorImage from '@/app/components/AuthorImage';
import { fetchApi, API_ROUTES, ApiError } from '@/lib/api';
import { Suspense } from 'react';

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  try {
    const newsData = await getNewsDetail(params.id);
    
    return {
      title: `${newsData.headline} | CricTo News`,
      description: newsData.intro,
    };
  } catch (error) {
    return {
      title: 'News Article | CricTo',
      description: 'Read the latest cricket news and updates.',
    };
  }
}

export const revalidate = 600; // Revalidate this page every 10 minutes

async function getNewsDetail(id: string): Promise<NewsDetailResponse> {
  try {
    return await fetchApi<NewsDetailResponse>(API_ROUTES.NEWS.DETAIL(id));
  } catch (error) {
    console.error(`Error fetching news detail for ID ${id}:`, error);
    if (error instanceof ApiError && error.status === 408) {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Failed to fetch news detail');
  }
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto">
      <div className="h-6 w-24 bg-gray-300 rounded mb-6"></div>
      
      <div className="space-y-4">
        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          <div className="h-5 w-20 bg-emerald-200 rounded"></div>
        </div>
        
        <div className="h-96 bg-gray-300 rounded-lg w-full mb-8"></div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsDetail({ newsData }: { newsData: NewsDetailResponse }) {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{newsData.headline}</h1>
        
        <p className="text-lg text-gray-600 mb-4">{newsData.intro}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <span>Source: {newsData.source}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(newsData.publishTime)}</span>
          </div>
          
          <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
            {newsData.storyType}
          </div>
        </div>
        
        {newsData.coverImage && (
          <CoverImage 
            imageId={newsData.coverImage.id} 
            alt={newsData.headline}
            caption={newsData.coverImage.caption}
            source={newsData.coverImage.source}
          />
        )}
      </header>
      
      <div className="prose prose-lg max-w-none">
        {newsData.content.map((item, index) => {
          if (item.content) {
            return (
              <p key={index} className="mb-4">
                {item.content.contentValue}
              </p>
            );
          }
          return null;
        })}
      </div>
      
      {newsData.authors.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Author{newsData.authors.length > 1 ? 's' : ''}</h3>
          <div className="flex flex-wrap gap-4">
            {newsData.authors.map(author => (
              <div key={author.id} className="flex items-center">
                <AuthorImage imageId={author.imageId} name={author.name} />
                <div>
                  <p className="font-medium">{author.name}</p>
                  {author.twitterHandle && (
                    <a 
                      href={author.twitterHandle} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {newsData.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Related Tags</h3>
          <div className="flex flex-wrap gap-2">
            {newsData.tags.map(tag => (
              <span 
                key={tag.itemId} 
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag.itemName}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

async function NewsDetailContent({ id }: { id: string }) {
  try {
    const newsData = await getNewsDetail(id);
    return <NewsDetail newsData={newsData} />;
  } catch (error) {
    console.error('Error loading news detail:', error);
    notFound();
  }
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Link 
        href="/news" 
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to News
      </Link>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <NewsDetailContent id={params.id} />
      </Suspense>
    </main>
  );
} 