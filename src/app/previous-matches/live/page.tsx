'use client';

import React, { useEffect, useState } from 'react';

interface Team {
  teamId: number;
  teamName: string;
  teamSName: string;
  imageId?: number;
}

interface VenueInfo {
  id: number;
  ground: string;
  city: string;
  timezone: string;
  latitude?: string;
  longitude?: string;
}

interface InningsScore {
  inningsId: number;
  runs: number;
  wickets: number;
  overs: number;
}

interface TeamScore {
  inngs1?: InningsScore;
  inngs2?: InningsScore;
}

interface MatchScore {
  team1Score?: TeamScore;
  team2Score?: TeamScore;
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
  currBatTeamId?: number;
  seriesStartDt: string;
  seriesEndDt: string;
  isTimeAnnounced: boolean;
  stateTitle: string;
  isFantasyEnabled?: boolean;
}

interface SeriesMatch {
  matchInfo: MatchInfo;
  matchScore?: MatchScore;
}

interface SeriesWrapper {
  seriesId: number;
  seriesName: string;
  matches: SeriesMatch[];
}

interface SeriesAdWrapper {
  seriesAdWrapper?: SeriesWrapper;
  adDetail?: {
    name: string;
    layout: string;
    position: number;
  };
}

interface TypeMatch {
  matchType: string;
  seriesMatches: SeriesAdWrapper[];
}

interface LiveScoreResponse {
  typeMatches: TypeMatch[];
  filters?: {
    matchType: string[];
  };
  appIndex?: {
    seoTitle: string;
    webURL: string;
  };
  responseLastUpdated?: string;
  error?: string;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 font-medium">Loading live matches...</p>
  </div>
);

// Format overs (convert 11.6 to 12.0)
const formatOvers = (overs: number): string => {
  if (!overs && overs !== 0) return '-';
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  
  if (balls === 6) {
    return `${fullOvers + 1}.0`;
  }
  return `${fullOvers}.${balls}`;
};

export default function LiveMatchesPage() {
  const [liveMatches, setLiveMatches] = useState<TypeMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/live-score');
        const data: LiveScoreResponse = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setLiveMatches(data.typeMatches || []);
        setLastUpdated(data.responseLastUpdated || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch live matches');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveScores();
    
    // Refresh data every 60 seconds
    const intervalId = setInterval(fetchLiveScores, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-red-100">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Matches</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasLiveMatches = liveMatches.some(type => 
    type.seriesMatches.some(series => 
      series.seriesAdWrapper && series.seriesAdWrapper.matches && series.seriesAdWrapper.matches.length > 0
    )
  );

  if (!hasLiveMatches) {
    return (
      <div className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Live Matches</h2>
            <p className="text-gray-600">There are no live cricket matches at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Live Cricket Matches</h1>
        {lastUpdated && (
          <p className="text-center text-gray-500 text-sm mb-8">
            Last updated: {new Date(parseInt(lastUpdated) * 1000).toLocaleTimeString()}
          </p>
        )}

        {liveMatches.map((typeMatch, typeIndex) => (
          <div key={typeIndex} className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b border-gray-200 pb-2">
              {typeMatch.matchType}
            </h2>
            
            {typeMatch.seriesMatches.map((seriesMatch, seriesIndex) => {
              if (!seriesMatch.seriesAdWrapper) return null;
              
              const { seriesId, seriesName, matches } = seriesMatch.seriesAdWrapper;
              
              if (!matches || matches.length === 0) return null;
              
              return (
                <div key={seriesIndex} className="mb-10">
                  <h3 className="text-lg font-medium mb-4 text-emerald-700">{seriesName}</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {matches.map((match) => {
                      const { matchInfo, matchScore } = match;
                      const isLive = matchInfo.state === 'In Progress';
                      const isComplete = matchInfo.state === 'Complete';
                      
                      const team1Score = matchScore?.team1Score?.inngs1;
                      const team2Score = matchScore?.team2Score?.inngs1;
                      const team1BattingSecond = matchScore?.team1Score?.inngs2;
                      const team2BattingSecond = matchScore?.team2Score?.inngs2;
                      
                      const team1Batting = matchInfo.currBatTeamId === matchInfo.team1.teamId;
                      const team2Batting = matchInfo.currBatTeamId === matchInfo.team2.teamId;
                      
                      return (
                        <div
                          key={matchInfo.matchId}
                          className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30"
                        >
                          {/* Match Header */}
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                                {matchInfo.matchFormat}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {matchInfo.matchDesc}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-red-500 animate-pulse' : isComplete ? 'bg-gray-500' : 'bg-emerald-500'}`}></span>
                              <span className="text-sm font-medium text-gray-700">{matchInfo.stateTitle}</span>
                            </div>
                          </div>
                          
                          {/* Teams and Scores */}
                          <div className="p-6">
                            {/* Team 1 */}
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-gray-700">{matchInfo.team1.teamSName}</span>
                                </div>
                                <span className={`font-medium text-lg ${team1Batting ? 'text-emerald-700' : 'text-gray-800'}`}>
                                  {matchInfo.team1.teamName}
                                  {team1Batting && 
                                    <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Batting</span>
                                  }
                                </span>
                              </div>
                              <div className="text-right">
                                {team1Score && (
                                  <div className="font-bold text-lg text-gray-800">
                                    {team1Score.runs}/{team1Score.wickets} 
                                    <span className="text-sm font-normal text-gray-600 ml-1">
                                      ({formatOvers(team1Score.overs)})
                                    </span>
                                  </div>
                                )}
                                {team1BattingSecond && (
                                  <div className="text-sm text-gray-600">
                                    & {team1BattingSecond.runs}/{team1BattingSecond.wickets} 
                                    <span className="text-xs ml-1">
                                      ({formatOvers(team1BattingSecond.overs)})
                                    </span>
                                  </div>
                                )}
                                {!team1Score && !team1BattingSecond && <div className="text-gray-500">Yet to bat</div>}
                              </div>
                            </div>
                            
                            {/* Team 2 */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-gray-700">{matchInfo.team2.teamSName}</span>
                                </div>
                                <span className={`font-medium text-lg ${team2Batting ? 'text-emerald-700' : 'text-gray-800'}`}>
                                  {matchInfo.team2.teamName}
                                  {team2Batting && 
                                    <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Batting</span>
                                  }
                                </span>
                              </div>
                              <div className="text-right">
                                {team2Score && (
                                  <div className="font-bold text-lg text-gray-800">
                                    {team2Score.runs}/{team2Score.wickets}
                                    <span className="text-sm font-normal text-gray-600 ml-1">
                                      ({formatOvers(team2Score.overs)})
                                    </span>
                                  </div>
                                )}
                                {team2BattingSecond && (
                                  <div className="text-sm text-gray-600">
                                    & {team2BattingSecond.runs}/{team2BattingSecond.wickets} 
                                    <span className="text-xs ml-1">
                                      ({formatOvers(team2BattingSecond.overs)})
                                    </span>
                                  </div>
                                )}
                                {!team2Score && !team2BattingSecond && <div className="text-gray-500">Yet to bat</div>}
                              </div>
                            </div>
                            
                            {/* Match Status */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <div className="flex items-start">
                                <div className="w-4 h-4 text-emerald-600 mt-0.5">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="ml-2 text-gray-700">{matchInfo.status}</div>
                              </div>
                            </div>
                            
                            {/* Venue Info */}
                            <div className="mt-4 flex justify-between items-center text-sm">
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {matchInfo.venueInfo.ground}, {matchInfo.venueInfo.city}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(parseInt(matchInfo.startDate)).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
