import Spinner from '@/app/components/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 animate-pulse">Loading content...</p>
    </div>
  );
} 