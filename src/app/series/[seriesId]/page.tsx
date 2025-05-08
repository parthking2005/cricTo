'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Team {
  teamId: number;
  teamName: string;
  teamSName: string;
  imageId: number;
}

interface VenueInfo {
  id: number;
  ground: string;
  city: string;
  timezone: string;
}

interface MatchInfo {
  matchId: number;
  seriesId: number;
  seriesName: string;
  matchDesc: string;
  matchFormat: string;
  startDate: string;
  endDate: string;
  state: string;
  status: string;
  team1: Team;
  team2: Team;
  venueInfo: VenueInfo;
  seriesStartDt: string;
  seriesEndDt: string;
  isTimeAnnounced: boolean;
}

interface MatchDetailsMap {
  key: string;
  match: { matchInfo: MatchInfo }[];
  seriesId: number;
}

interface SeriesResponse {
  matchDetails: {
    matchDetailsMap?: MatchDetailsMap;
    adDetail?: {
      name: string;
      layout: string;
      position: number;
    };
  }[];
  appIndex: {
    seoTitle: string;
    webURL: string;
  };
}

export default function SeriesPage() {
  const { seriesId } = useParams();
  const [seriesData, setSeriesData] = useState<SeriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/series/getmatches?seriesId=${seriesId}`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setSeriesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [seriesId]);

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">Loading matches...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const matches = seriesData?.matchDetails
    .filter(item => item.matchDetailsMap)
    .map(item => item.matchDetailsMap?.match[0].matchInfo)
    .filter((match): match is MatchInfo => match !== undefined) || [];

  if (matches.length === 0) {
    return (
      <div className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">No matches found for this series</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          {matches[0].seriesName}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {new Date(parseInt(matches[0].seriesStartDt)).toLocaleDateString()} - {new Date(parseInt(matches[0].seriesEndDt)).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.matchId}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  {match.matchFormat}
                </span>
                <span className="text-sm text-gray-500">
                  {match.matchDesc}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{match.team1.teamSName}</span>
                    </div>
                    <span className="font-medium text-gray-800">{match.team1.teamName}</span>
                  </div>
                  <span className="text-sm text-gray-500">vs</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{match.team2.teamName}</span>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{match.team2.teamSName}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{match.venueInfo.ground}, {match.venueInfo.city}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-emerald-600">{match.status}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(parseInt(match.startDate)).toLocaleDateString()} - {new Date(parseInt(match.endDate)).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 