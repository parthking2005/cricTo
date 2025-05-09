'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { NewsStory } from '@/types/news';
import { formatDate } from '@/lib/utils';
import { getImageUrl } from '@/lib/api';
import ErrorBoundary from './ErrorBoundary';

interface NewsCardSimpleProps {
  newsItem: NewsStory;
  onClick: () => void;
}

export default function NewsCardSimple({ newsItem, onClick }: NewsCardSimpleProps) {
  const { story } = newsItem;
  const [imgError, setImgError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('/placeholder-image.jpg');
  
  // Check if we have a valid image ID
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
      <div 
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
        onClick={onClick}
      >
        <div className="relative h-40 bg-gray-200">
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
                width={150}
                height={100}
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <div className="absolute bottom-0 left-0 bg-emerald-600 text-white px-2 py-1 text-xs">
            {story.storyType}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">
            {formatDate(story.pubTime)}
          </div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{story.hline}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{story.intro}</p>
        </div>
      </div>
    </ErrorBoundary>
  );
} 