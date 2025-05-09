'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsStory } from '@/types/news';
import NewsCardSimple from './components/NewsCardSimple';
import { fetchApi, API_ROUTES, ApiError } from '@/lib/api';
import NewsCardSkeleton from './components/NewsCardSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  const [newsData, setNewsData] = useState<NewsStory[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Fetch cricket data
    setIsDataLoading(true);
    fetchApi(API_ROUTES.CRICKET.MATCHES)
      .then(data => {
        setData(data);
        setDataError(null);
      })
      .catch((error) => {
        console.error('Error fetching cricket data:', error);
        setDataError(error instanceof ApiError ? error.message : 'Failed to load match data');
      })
      .finally(() => setIsDataLoading(false));

    // Fetch news for homepage
    setIsNewsLoading(true);
    fetchApi(API_ROUTES.NEWS.LIST)
      .then((data) => {
        // Filter out ad entries and only show stories
        const newsStories = data?.storyList?.filter(
          (item: any): item is NewsStory => 'story' in item
        );
        setNewsData(newsStories?.slice(0, 3) || []); // Get only 3 latest news
        setNewsError(null);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setNewsError(error instanceof ApiError ? error.message : 'Failed to load news');
        setNewsData([]);
      })
      .finally(() => setIsNewsLoading(false));
  }, []);

  const allMatches: any[] = [];

  data?.typeMatches?.forEach((type: any) => {
    type.seriesMatches?.forEach((series: any) => {
      const matches = series?.seriesAdWrapper?.matches || [];
      matches.forEach((match: any) => {
        allMatches.push({
          ...match,
          matchType: type.matchType,
          seriesName: series?.seriesAdWrapper?.seriesName,
        });
      });
    });
  });

  // Shuffle matches randomly
  const shuffledMatches = [...allMatches].sort(() => 0.5 - Math.random());

  const handleMatchClick = (matchId: string) => {
    router.push(`/previous-matches/match-score/${matchId}`);
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp));
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <main className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cricket Match Archive</h1>
        <p className="text-gray-600 text-lg">
          A snapshot of recent international, domestic, league, and women's matches from around the world.
        </p>
        <button
          onClick={() => router.push('/previous-matches/0')}
          className="mt-6 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
        >
          View Full Match History
        </button>
      </section>

      {/* Latest News Section */}
      <ErrorBoundary>
        <section className="max-w-5xl mx-auto mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Latest Cricket News</h2>
            <button
              onClick={() => router.push('/news')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All News →
            </button>
          </div>

          {isNewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : newsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 mb-2">{newsError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsData?.map((newsItem) => (
                <NewsCardSimple 
                  key={newsItem.story.id}
                  newsItem={newsItem}
                  onClick={() => router.push(`/news/${newsItem.story.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Matches</h2>
            <button
              onClick={() => router.push('/previous-matches/0')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All Matches →
            </button>
          </div>

          {isDataLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div 
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-6 h-48 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-6"></div>
                  <div className="flex justify-between">
                    <div className="space-y-2 w-1/3">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="space-y-2 w-1/3">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : dataError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 mb-3">{dataError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shuffledMatches?.slice(0, 6)?.map((match, idx) => {
                const { matchInfo, matchScore, matchType, seriesName } = match;
                const team1 = matchInfo.team1;
                const team2 = matchInfo.team2;
                const score1 = matchScore?.team1Score?.inngs1;
                const score2 = matchScore?.team2Score?.inngs1;

                return (
                  <div
                    key={idx}
                    onClick={() => handleMatchClick(matchInfo.matchId)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30"
                  >
                    <div className="text-xs text-emerald-600 font-medium uppercase mb-1">{matchType}</div>
                    <div className="text-sm text-gray-500 mb-1">{seriesName}</div>
                    <h3 className="text-lg font-bold text-gray-800">{matchInfo.matchDesc}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {matchInfo.venueInfo.ground}, {matchInfo.venueInfo.city}
                    </p>

                    <div className="flex justify-between text-sm mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{team1.teamSName}</p>
                        {score1 && (
                          <p className="text-gray-600">
                            {score1.runs}/{score1.wickets} ({score1.overs} ov)
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{team2.teamSName}</p>
                        {score2 && (
                          <p className="text-gray-600">
                            {score2.runs}/{score2.wickets} ({score2.overs} ov)
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-medium text-emerald-600">{matchInfo.status}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </ErrorBoundary>
    </main>
  );
}
