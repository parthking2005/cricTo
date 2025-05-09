import Link from 'next/link';
import { Newspaper, RefreshCw, Home } from 'lucide-react';

export default function NewsNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Newspaper size={36} className="text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Article Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          The news article you're looking for doesn't exist or may have been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/news" 
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className="mr-2" />
            Browse News
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-lg transition-colors"
          >
            <Home size={18} className="mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 