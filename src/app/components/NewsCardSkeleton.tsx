export default function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg shadow-md bg-white h-full flex flex-col animate-pulse">
      <div className="relative h-48 w-full bg-gray-300"></div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between mb-2">
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
        
        <div className="h-5 bg-gray-300 rounded mb-3 w-3/4"></div>
        
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
        
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-auto"></div>
      </div>
    </div>
  );
} 