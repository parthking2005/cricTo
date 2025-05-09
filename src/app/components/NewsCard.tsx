'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { NewsStory } from '@/types/news';
import { formatDate } from '@/lib/utils';
import { getImageUrl } from '@/lib/api';
import ErrorBoundary from './ErrorBoundary';

interface NewsCardProps {
  newsItem: NewsStory;
}

export default function NewsCard({ newsItem }: NewsCardProps) {
  const { story } = newsItem;
//   console.log('Story:', story);
  const [imgError, setImgError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('/placeholder-image.jpg');
  
  // Make sure we have a valid image ID
  const hasValidImage = story.imageId && story.imageId.toString() !== "0";
  
  // Load image URL asynchronously
  useEffect(() => {
    if (hasValidImage) {
      let mounted = true;
      setIsImageLoading(true);
      
      getImageUrl(story.imageId)
        .then(url => {
          if (mounted) {
            setImageUrl(url);
          }
        })
        .catch(err => {
          console.error('Failed to load news image:', err);
          if (mounted) {
            setImgError(true);
          }
        });
        
      return () => { mounted = false; };
    }
  }, [story.imageId, hasValidImage]);
  
  return (
    <ErrorBoundary>
      <Link href={`/news/${story.id}`} className="block">
        <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col">
          <div className="relative h-48 w-full bg-gray-200">
            {!imgError ? (
              <>
                <Image
                  src={imageUrl}
                  alt={story.hline}
                  fill
                  className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onError={() => setImgError(true)}
                  onLoad={() => setIsImageLoading(false)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  quality={75}
                  unoptimized={!hasValidImage} // Skip optimization for placeholder
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                <Image
                  src="/placeholder-image.jpg"
                  alt="Image not available"
                  width={200}
                  height={150}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 bg-emerald-600 text-white px-2 py-1 text-xs">
              {story.storyType}
            </div>
            {story.isFeatured && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white px-2 py-1 text-xs">
                Featured
              </div>
            )}
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <div className="text-xs text-gray-500 mb-1 flex justify-between">
              <span>{story.source}</span>
              <span>{formatDate(story.pubTime)}</span>
            </div>
            
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">{story.hline}</h3>
            
            <p className="text-sm text-gray-600 line-clamp-3 mb-2 flex-grow">{story.intro}</p>
            
            <div className="text-xs bg-gray-100 rounded px-2 py-1 inline-block text-gray-700 mt-auto">
              {story.context}
            </div>
          </div>
        </div>
      </Link>
    </ErrorBoundary>
  );
} 