'use client';

import { usePathname, useRouter } from 'next/navigation';
// import { cn } from '@/lib/utils'; // Optional utility for merging classNames

const tabs = [
  { name: 'International', path: '/previous-matches/0' },
  { name: 'League', path: '/previous-matches/1' },
  { name: 'Domestic', path: '/previous-matches/2' },
  { name: 'Women', path: '/previous-matches/3' },
  { name: 'Live', path: '/previous-matches/live' },
];

export default function TabNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="p-4 bg-transparent mt-16">
      <div className="flex justify-start space-x-8 ">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-300'}`
              }
            >
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
