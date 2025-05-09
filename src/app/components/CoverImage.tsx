'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/api';
import ErrorBoundary from './ErrorBoundary';

interface CoverImageProps {
  imageId: string;
  alt: string;
  caption: string;
  source: string;
}

export default function CoverImage({ imageId, alt, caption, source }: CoverImageProps) {
  const [imgError, setImgError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('/placeholder-image.jpg');
  
  // Check if we have a valid image ID
  const hasValidImage = imageId && imageId.toString() !== "0";
  
  // Load image URL asynchronously
  useEffect(() => {
    if (hasValidImage) {
      let mounted = true;
      setIsImageLoading(true);
      
      getImageUrl(imageId)
        .then(url => {
          if (mounted) {
            setImageUrl(url);
          }
        })
        .catch(err => {
          console.error('Failed to load cover image:', err);
          if (mounted) {
            setImgError(true);
          }
        });
        
      return () => { mounted = false; };
    }
  }, [imageId, hasValidImage]);
  
  return (
    <ErrorBoundary>
      <div className="relative h-96 w-full mb-6">
        {!imgError ? (
          <>
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className={`object-cover rounded-lg transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={() => setImgError(true)}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
              priority={true}
              quality={85}
              unoptimized={!hasValidImage} // Skip optimization for placeholder
            />
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-100 rounded-lg">
            <Image
              src="/placeholder-image.jpg"
              alt="Image not available"
              width={300}
              height={200}
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
          <p className="text-sm">{caption}</p>
          <p className="text-xs text-gray-300">Source: {source}</p>
        </div>
      </div>
    </ErrorBoundary>
  );
} 