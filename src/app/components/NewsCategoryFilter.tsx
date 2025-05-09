'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NewsCategoriesResponse, NewsCategory } from '@/types/news';
import { fetchApi, API_ROUTES, ApiError } from '@/lib/api';

export default function NewsCategoryFilter() {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    
    async function fetchCategories() {
      try {
        const data = await fetchApi<NewsCategoriesResponse>(API_ROUTES.NEWS.CATEGORIES);
        
        if (data && data.storyType) {
          setCategories(data.storyType);
          setError(null);
        } else {
          console.error('Invalid category data format:', data);
          setCategories([]);
          setError('Could not load categories');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
        setError(error instanceof ApiError ? error.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, [searchParams]);
  
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === selectedCategory) {
      setSelectedCategory(null);
      router.push('/news');
    } else {
      setSelectedCategory(categoryId);
      router.push(`/news?category=${categoryId}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="h-8 w-24 bg-gray-200 rounded-full animate-pulse mr-2 flex-shrink-0"
          />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center mb-4">
        <p className="text-red-700 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded mt-2"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => handleCategoryChange('')}
        className={`px-4 py-1 rounded-full mr-2 text-sm font-medium transition-all duration-200 flex-shrink-0 ${
          !selectedCategory 
            ? 'bg-emerald-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id.toString())}
          className={`px-4 py-1 rounded-full mr-2 text-sm font-medium transition-all duration-200 flex-shrink-0 ${
            selectedCategory === category.id.toString()
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          title={category.description}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 