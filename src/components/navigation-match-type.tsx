'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
// import { cn } from '@/lib/utils'; // Optional utility for merging classNames

interface Series {
  id: number;
  name: string;
  startDt: string;
  endDt: string;
}

interface SeriesGroup {
  date: string;
  series: Series[];
}

interface SeriesResponse {
  seriesMapProto: SeriesGroup[];
}

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
  const [showSeriesDropdown, setShowSeriesDropdown] = useState(false);
  const [seriesData, setSeriesData] = useState<SeriesGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/series');
      const data: SeriesResponse = await response.json();
      if (data.seriesMapProto) {
        setSeriesData(data.seriesMapProto);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSeriesDropdown) {
      fetchSeries();
    }
  }, [showSeriesDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSeriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSeriesClick = (seriesId: number) => {
    router.push(`/series/${seriesId}`);
    setShowSeriesDropdown(false);
  };

  const toggleDropdown = () => {
    setShowSeriesDropdown(!showSeriesDropdown);
  };

  return (
    <div className="p-4 bg-transparent mt-16">
      <div className="flex justify-start space-x-8">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors ${
                isActive ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.name}</span>
            </button>
          );
        })}

        {/* Series Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors ${
              pathname.startsWith('/series') ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Series</span>
            <svg
              className={`w-4 h-4 transition-transform ${showSeriesDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSeriesDropdown && (
            <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-[80vh] overflow-y-auto">
              {loading ? (
                <div className="px-4 py-2 text-sm text-gray-500">Loading series...</div>
              ) : seriesData.length > 0 ? (
                seriesData.map((group) => (
                  <div key={group.date} className="mb-2">
                    <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-700 sticky top-0">
                      {group.date}
                    </div>
                    {group.series.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSeriesClick(s.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(parseInt(s.startDt)).toLocaleDateString()} - {new Date(parseInt(s.endDt)).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No series available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
