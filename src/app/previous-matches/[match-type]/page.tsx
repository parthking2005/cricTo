'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MatchTypePage() {
  const { 'match-type': matchType } = useParams();
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/cricket')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const matchData = data?.typeMatches?.[matchType as any]; // matchType will be '0', '1', etc.
  const seriesMatches: Array<any> = matchData?.seriesMatches;

  const handleMatchClick = (matchId: string) => {
    router.push(`/previous-matches/match-score/${matchId}`);
  };

  return (
    <main className="min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        {matchData?.matchType} Cricket Matches
      </h1>

      <div className="space-y-10">
        {seriesMatches?.map((series: any, i: number) => {
          const matches = series?.seriesAdWrapper?.matches;
          const seriesName = series?.seriesAdWrapper?.seriesName;

          return (
            <div key={i}>
              <h2 className="text-xl font-semibold text-emerald-700 mb-4">{seriesName}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches?.map((match: any, idx: number) => {
                  const { matchInfo, matchScore } = match;
                  const team1 = matchInfo.team1;
                  const team2 = matchInfo.team2;
                  const score1 = matchScore?.team1Score?.inngs1;
                  const score2 = matchScore?.team2Score?.inngs1;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleMatchClick(matchInfo.matchId)}
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30"
                    >
                      <p className="text-xs text-emerald-600 mb-1">{matchInfo.seriesName}</p>
                      <h4 className="text-lg font-semibold text-gray-800">{matchInfo.matchDesc}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {matchInfo.venueInfo.ground}, {matchInfo.venueInfo.city}
                      </p>

                      <div className="flex justify-between text-sm mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{team1.teamSName}</p>
                          {score1 && (
                            <p className="text-gray-600">
                              {score1.runs}/{score1.wickets} ({(String(score1.overs).endsWith(".6")) ? Math.floor(parseFloat(score1.overs)) + 1 : parseFloat(score1.overs)})ov
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{team2.teamSName}</p>
                          {score2 && (
                            <p className="text-gray-600">
                              {score2.runs}/{score2.wickets} ({(String(score2.overs).endsWith(".6")) ? Math.floor(parseFloat(score2.overs)) + 1 : parseFloat(score2.overs)})ov
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-medium text-emerald-600">{matchInfo.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}


// {((score2.overs) % 1 === 0.6) ? (score2.overs) + 1 : score2.over}