'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/api';
import ErrorBoundary from './ErrorBoundary';

interface AuthorImageProps {
  imageId: number;
  name: string;
}

export default function AuthorImage({ imageId, name }: AuthorImageProps) {
  const [imgError, setImgError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('/placeholder-image.jpg');
  
  // Extract initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  // Check if we have a valid image ID
  const hasValidImage = imageId && imageId !== 0;
  
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
          console.error('Failed to load author image:', err);
          if (mounted) {
            setImgError(true);
          }
        });
        
      return () => { mounted = false; };
    }
  }, [imageId, hasValidImage]);
  
  // For author images, we'll use initials in a colored background if no image is available
  // This is a better UX than showing a placeholder image for avatars
  return (
    <ErrorBoundary>
      <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
        {!imgError && hasValidImage ? (
          <>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={() => setImgError(true)}
              onLoad={() => setIsImageLoading(false)}
              sizes="40px"
            />
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-100">
                <span className="text-xs font-medium text-emerald-800">{initials}</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-xs font-medium text-emerald-800">
            {initials}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
} 