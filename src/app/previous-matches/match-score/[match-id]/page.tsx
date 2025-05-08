'use client';

import { useEffect, useState } from 'react';

interface BatsmanData {
  batId: number;
  batName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  outDesc: string;
}

interface BowlerData {
  bowlerId: number;
  bowlName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  no_balls?: number;
  wides?: number;
  dots?: number;
}

interface MatchData {
  matchId: number;
  inningsId: number;
  timeScore: number;
  venue?: string;
  matchType?: string;
  batTeamDetails: {
    batTeamId: number;
    batTeamName: string;
    batTeamShortName: string;
    batsmenData: Record<string, any>;
  };
  bowlTeamDetails: {
    bowlTeamId: number;
    bowlTeamName: string;
    bowlTeamShortName: string;
    bowlersData: Record<string, any>;
  };
  scoreDetails: {
    runs: number;
    wickets: number;
    overs: number;
    runRate: number;
  };
  extrasData?: {
    noBalls: number;
    total: number;
    byes: number;
    wides: number;
    legByes: number;
  };
  wicketsData?: Record<string, any>;
  partnershipsData?: Record<string, any>;
  scoreCard?: Array<{
    score: string;
    team?: string;
    status?: string;
    runRate?: number;
    requiredRunRate?: number;
  }>;
}

interface MatchHeader {
  matchId: number;
  matchDescription: string;
  matchFormat: string;
  matchType: string;
  status: string;
  state: string;
  tossResults?: {
    tossWinnerId: number;
    tossWinnerName: string;
    decision: string;
  };
  result?: {
    resultType: string;
    winningTeam: string;
    winningMargin: number;
    winByRuns: boolean;
  };
  team1: {
    id: number;
    name: string;
    shortName: string;
  };
  team2: {
    id: number;
    name: string;
    shortName: string;
  };
  seriesDesc: string;
  seriesName: string;
  venue?: string;
}

interface CompleteMatchData {
  scoreCard: MatchData[];
  matchHeader: MatchHeader;
  status: string;
  isMatchComplete: boolean;
}

const LiveMatch = () => {
  const [matchData, setMatchData] = useState<CompleteMatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInnings, setSelectedInnings] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        // Get match ID from URL
        const matchId = window.location.pathname.split('/').pop();
        if (!matchId) {
          throw new Error('Match ID not found');
        }

        const res = await fetch(`/api/prev-match-score?matchId=${matchId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch match data');
        }
        const data = await res.json();
        if (data?.scoreCard && data.scoreCard.length > 0) {
          setMatchData(data);
        } else {
          throw new Error('No match data available');
        }
      } catch (err) {
        console.error('Failed to fetch match score:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch match data');
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  if (loading) return <p className="text-center py-8 text-black">Loading match details...</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;
  if (!matchData) return <p className="text-center py-8 text-black">No match data found.</p>;

  const currentInnings = matchData.scoreCard[selectedInnings];
  const { batTeamDetails, bowlTeamDetails } = currentInnings;

  const batsmen = batTeamDetails ? Object.values(batTeamDetails.batsmenData || {}).sort((a, b) => {
    // Extract numeric part from 'bat_X' keys to sort correctly
    const aNum = parseInt(Object.keys(batTeamDetails.batsmenData).find(key => batTeamDetails.batsmenData[key].batId === a.batId)?.split('_')[1] || '0');
    const bNum = parseInt(Object.keys(batTeamDetails.batsmenData).find(key => batTeamDetails.batsmenData[key].batId === b.batId)?.split('_')[1] || '0');
    return aNum - bNum;
  }) : [];
  
  const bowlers = bowlTeamDetails ? Object.values(bowlTeamDetails.bowlersData || {}) : [];

  const getWicketFallData = () => {
    if (!currentInnings.wicketsData) return [];
    return Object.values(currentInnings.wicketsData).sort((a, b) => a.wktNbr - b.wktNbr);
  };

  const getFallOfWickets = () => {
    const wickets = getWicketFallData();
    return wickets.map(wkt => `${wkt.wktRuns}-${wkt.wktNbr} (${wkt.batName}, ${wkt.wktOver})`).join(' | ');
  };

  const header = matchData.matchHeader;
  const matchStatus = matchData.status;
  const isComplete = matchData.isMatchComplete;

  return (
    <section className="bg-white shadow-md rounded-lg p-4 max-w-5xl mx-auto mt-8 border border-gray-200">
      {/* Match Header */}
      <div className="mb-4 bg-gradient-to-r from-emerald-50 to-gray-50 p-3 rounded-lg border border-emerald-100">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">{header.matchDescription}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-b border-emerald-100 pb-3 mb-3">
          <div className="text-gray-800">
            <p className="font-semibold">{header.team1.name}</p>
            <p className="text-sm">{header.team1.shortName}</p>
          </div>
          <div className="text-gray-800">
            <p className="font-semibold">{header.seriesDesc}</p>
            <p className="text-sm font-bold text-emerald-600">{matchStatus}</p>
            <p className="text-xs text-gray-600">{header.matchType} | {header.matchFormat}</p>
          </div>
          <div className="text-gray-800">
            <p className="font-semibold">{header.team2.name}</p>
            <p className="text-sm">{header.team2.shortName}</p>
          </div>
        </div>
        
        {header.tossResults && (
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold text-emerald-700">{header.tossResults.tossWinnerName}</span> won the toss and chose to {header.tossResults.decision.toLowerCase()}
          </p>
        )}
      </div>

      {/* Innings Selector */}
      <div className="mb-4 flex justify-center">
        {matchData.scoreCard.map((innings, index) => (
          <button 
            key={index}
            onClick={() => setSelectedInnings(index)}
            className={`mx-2 py-2 px-4 rounded ${selectedInnings === index 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'}`}
          >
            {innings.batTeamDetails.batTeamShortName} Innings
          </button>
        ))}
      </div>

      {/* Current Score Summary */}
      <div className="mb-4 bg-gradient-to-r from-emerald-50 to-gray-50 p-3 rounded-lg border border-emerald-100">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {batTeamDetails.batTeamName} - {currentInnings.scoreDetails.runs}/{currentInnings.scoreDetails.wickets}
            </h3>
            <p className="text-sm text-gray-600">
              Overs: {currentInnings.scoreDetails.overs} | RR: {currentInnings.scoreDetails.runRate}
            </p>
          </div>
          <div className="text-gray-800 text-right">
            <p className="font-semibold">{bowlTeamDetails.bowlTeamName} bowling</p>
            {isComplete && header.result && (
              <p className="text-sm font-semibold text-emerald-700">
                {header.result.winningTeam} won by {header.result.winningMargin} {header.result.winByRuns ? 'runs' : 'wickets'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Batting and Bowling Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Batting Section */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-800 flex items-center border-b border-emerald-100 pb-1">
            <span className="mr-1">🏏</span> {batTeamDetails.batTeamShortName} - Batting
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="py-2 px-2 text-left text-gray-800">Batsman</th>
                  <th className="py-2 px-2 text-left text-gray-800">Dismissal</th>
                  <th className="py-2 px-2 text-right text-gray-800">R</th>
                  <th className="py-2 px-2 text-right text-gray-800">B</th>
                  <th className="py-2 px-2 text-right text-gray-800">SR</th>
                </tr>
              </thead>
              <tbody>
                {batsmen.map((bat: BatsmanData, index: number) => (
                  <tr key={bat.batId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-emerald-50`}>
                    <td className="py-2 px-2 text-gray-800 font-medium">  
                      {bat.batName} 
                    </td>
                    <td className="py-2 px-2 text-gray-600 text-xs">
                      {bat.outDesc || 'not out'}
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-gray-800">{bat.runs}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bat.balls}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bat.strikeRate}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-emerald-100 bg-emerald-50">
                <tr>
                  <td colSpan={2} className="py-2 px-2 text-left font-semibold text-gray-800">Total</td>
                  <td className="py-2 px-2 text-right font-semibold text-gray-800">{currentInnings.scoreDetails.runs}</td>
                  <td colSpan={2} className="py-2 px-2 text-right text-gray-600">
                    ({currentInnings.scoreDetails.wickets} wkts, {currentInnings.scoreDetails.overs} ov)
                  </td>
                </tr>
                {currentInnings.extrasData && (
                  <tr>
                    <td colSpan={2} className="py-2 px-2 text-left text-gray-800">Extras</td>
                    <td className="py-2 px-2 text-right text-gray-800">{currentInnings.extrasData.total}</td>
                    <td colSpan={2} className="py-2 px-2 text-right text-gray-600 text-xs">
                      (WD: {currentInnings.extrasData.wides}, NB: {currentInnings.extrasData.noBalls})
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
          
          {/* Boundary Count */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-800">
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
              <span className="font-semibold">4s:</span> {batsmen.reduce((sum, bat) => sum + (bat.fours || 0), 0)}
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
              <span className="font-semibold">6s:</span> {batsmen.reduce((sum, bat) => sum + (bat.sixes || 0), 0)}
            </div>
          </div>
        </div>

        {/* Bowling Section */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-800 flex items-center border-b border-emerald-100 pb-1">
            <span className="mr-1">🎯</span> {bowlTeamDetails.bowlTeamShortName} - Bowling
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="py-2 px-2 text-left text-gray-800">Bowler</th>
                  <th className="py-2 px-2 text-right text-gray-800">O</th>
                  <th className="py-2 px-2 text-right text-gray-800">M</th>
                  <th className="py-2 px-2 text-right text-gray-800">R</th>
                  <th className="py-2 px-2 text-right text-gray-800">W</th>
                  <th className="py-2 px-2 text-right text-gray-800">Econ</th>
                </tr>
              </thead>
              <tbody>
                {bowlers.map((bowl: BowlerData, index: number) => (
                  <tr key={bowl.bowlerId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-emerald-50`}>
                    <td className="py-2 px-2 text-gray-800 font-medium">
                      {bowl.bowlName}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-600">{bowl.overs}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bowl.maidens || 0}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bowl.runs}</td>
                    <td className="py-2 px-2 text-right font-medium text-gray-800">{bowl.wickets}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{bowl.economy}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-emerald-100 bg-emerald-50">
                <tr>
                  <td colSpan={3} className="py-2 px-2 text-left font-semibold text-gray-800">Extras</td>
                  <td colSpan={3} className="py-2 px-2 text-right text-gray-600 text-xs">
                    WD: {currentInnings.extrasData?.wides || 0}, NB: {currentInnings.extrasData?.noBalls || 0}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Extra Bowling Stats */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-800">
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
              <span className="font-semibold">Best Bowler:</span> {
                bowlers.length > 0 ? 
                bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).bowlName +
                ` (${bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).wickets}/${
                  bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).runs})` : 'N/A'
              }
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
              <span className="font-semibold">Best Econ:</span> {
                bowlers.length > 0 && bowlers.some(bowl => Number(bowl.overs) >= 2) ? 
                bowlers.filter(bowl => Number(bowl.overs) >= 2)
                  .reduce((best, bowl) => bowl.economy < best.economy ? bowl : best, 
                    bowlers.filter(bowl => Number(bowl.overs) >= 2)[0]).bowlName +
                ` (${bowlers.filter(bowl => Number(bowl.overs) >= 2)
                  .reduce((best, bowl) => bowl.economy < best.economy ? bowl : best, 
                    bowlers.filter(bowl => Number(bowl.overs) >= 2)[0]).economy})` : 'N/A'
              }
            </div>
          </div>
        </div>
      </div>
      
      {/* Fall of wickets */}
      {currentInnings.wicketsData && (
        <div className="mb-4 p-3 bg-emerald-50 rounded border border-emerald-100">
          <h5 className="text-sm font-semibold text-gray-800 mb-1">Fall of Wickets:</h5>
          <p className="text-xs text-gray-600 leading-relaxed">{getFallOfWickets()}</p>
        </div>
      )}

      {/* Batting Stats and Partnerships in side-by-side grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Batting Stats */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-800 flex items-center border-b border-emerald-100 pb-1">
            <span className="mr-1">📊</span> Batting Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
              <h5 className="text-xs font-semibold text-gray-800">Top Scorer</h5>
              {batsmen.length > 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-800">{batsmen.reduce((max, bat) => bat.runs > max.runs ? bat : max, batsmen[0]).batName}</p>
                  <p className="text-xs text-gray-600">{batsmen.reduce((max, bat) => bat.runs > max.runs ? bat : max, batsmen[0]).runs} runs ({batsmen.reduce((max, bat) => bat.runs > max.runs ? bat : max, batsmen[0]).balls} balls)</p>
                </div>
              ) : <p className="text-xs text-gray-600">No data</p>}
            </div>
            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
              <h5 className="text-xs font-semibold text-gray-800">Highest Strike Rate</h5>
              {batsmen.length > 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-800">{
                    batsmen.filter(bat => bat.balls >= 5)
                      .reduce((max, bat) => bat.strikeRate > max.strikeRate ? bat : max, 
                        batsmen.filter(bat => bat.balls >= 5)[0] || batsmen[0]).batName
                  }</p>
                  <p className="text-xs text-gray-600">{
                    batsmen.filter(bat => bat.balls >= 5)
                      .reduce((max, bat) => bat.strikeRate > max.strikeRate ? bat : max, 
                        batsmen.filter(bat => bat.balls >= 5)[0] || batsmen[0]).strikeRate
                  } SR</p>
                </div>
              ) : <p className="text-xs text-gray-600">No data</p>}
            </div>
          </div>
        </div>
        
        {/* Bowling Stats */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-800 flex items-center border-b border-emerald-100 pb-1">
            <span className="mr-1">🎯</span> Bowling Highlights
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
              <h5 className="text-xs font-semibold text-gray-800">Best Bowler</h5>
              {bowlers.length > 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-800">{
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).bowlName
                  }</p>
                  <p className="text-xs text-gray-600">{
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).wickets
                  }/{
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).runs
                  } ({
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).overs
                  } ov)</p>
                </div>
              ) : <p className="text-xs text-gray-600">No data</p>}
            </div>
            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
              <h5 className="text-xs font-semibold text-gray-800">Best Economy</h5>
              {bowlers.length > 0 && bowlers.some(bowl => Number(bowl.overs) >= 2) ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-800">{
                    bowlers.filter(bowl => Number(bowl.overs) >= 2)
                      .reduce((best, bowl) => bowl.economy < best.economy ? bowl : best, 
                        bowlers.filter(bowl => Number(bowl.overs) >= 2)[0]).bowlName
                  }</p>
                  <p className="text-xs text-gray-600">{
                    bowlers.filter(bowl => Number(bowl.overs) >= 2)
                      .reduce((best, bowl) => bowl.economy < best.economy ? bowl : best, 
                        bowlers.filter(bowl => Number(bowl.overs) >= 2)[0]).economy
                  } econ</p>
                </div>
              ) : <p className="text-xs text-gray-600">Not enough overs</p>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Last updated */}
      <div className="mt-4 text-right">
        <p className="text-xs text-gray-600">
          Last updated: {currentInnings?.timeScore ? new Date(currentInnings.timeScore).toLocaleTimeString() : 'N/A'}
        </p>
      </div>
    </section>
  );
};

export default LiveMatch;
    