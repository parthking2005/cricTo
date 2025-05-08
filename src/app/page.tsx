'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/cricket')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
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

      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shuffledMatches.slice(0, 6).map((match, idx) => {
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
      </section>
    </main>
  );
}
