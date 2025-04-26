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

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch('/api/live-score');
        const data = await res.json();
        if (data?.scoreCard && data.scoreCard.length > 0) {
          setMatchData(data);
        }
      } catch (err) {
        console.error('Failed to fetch live score:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
    const interval = setInterval(fetchScore, 10000); 
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) return <p className="text-center py-8 text-black">Loading live match...</p>;
  if (!matchData) return <p className="text-center py-8 text-black">No live data found.</p>;

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
      <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-center text-black">{header.matchDescription}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-b border-gray-200 pb-3 mb-3">
          <div className="text-black">
            <p className="font-semibold">{header.team1.name}</p>
            <p className="text-sm">{header.team1.shortName}</p>
          </div>
          <div className="text-black">
            <p className="font-semibold">{header.seriesDesc}</p>
            <p className="text-sm font-bold">{matchStatus}</p>
            <p className="text-xs">{header.matchType} | {header.matchFormat}</p>
          </div>
          <div className="text-black">
            <p className="font-semibold">{header.team2.name}</p>
            <p className="text-sm">{header.team2.shortName}</p>
          </div>
        </div>
        
        {header.tossResults && (
          <p className="text-sm text-black text-center">
            <span className="font-semibold">{header.tossResults.tossWinnerName}</span> won the toss and chose to {header.tossResults.decision.toLowerCase()}
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
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-black'}`}
          >
            {innings.batTeamDetails.batTeamShortName} Innings
          </button>
        ))}
      </div>

      {/* Current Score Summary */}
      <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-black">
              {batTeamDetails.batTeamName} - {currentInnings.scoreDetails.runs}/{currentInnings.scoreDetails.wickets}
            </h3>
            <p className="text-sm text-black">
              Overs: {currentInnings.scoreDetails.overs} | RR: {currentInnings.scoreDetails.runRate}
            </p>
          </div>
          <div className="text-black text-right">
            <p className="font-semibold">{bowlTeamDetails.bowlTeamName} bowling</p>
            {isComplete && header.result && (
              <p className="text-sm font-semibold text-green-700">
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
          <h4 className="text-md font-semibold mb-2 text-black flex items-center border-b pb-1">
            <span className="mr-1">🏏</span> {batTeamDetails.batTeamShortName} - Batting
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 text-left text-black">Batsman</th>
                  <th className="py-2 px-2 text-left text-black">Dismissal</th>
                  <th className="py-2 px-2 text-right text-black">R</th>
                  <th className="py-2 px-2 text-right text-black">B</th>
                  <th className="py-2 px-2 text-right text-black">SR</th>
                </tr>
              </thead>
              <tbody>
                {batsmen.map((bat: BatsmanData, index: number) => (
                  <tr key={bat.batId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}>
                    <td className="py-2 px-2 text-black font-medium">  
                      {bat.batName} 
                    </td>
                    <td className="py-2 px-2 text-black text-xs">
                      {bat.outDesc || 'not out'}
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-black">{bat.runs}</td>
                    <td className="py-2 px-2 text-right text-black">{bat.balls}</td>
                    <td className="py-2 px-2 text-right text-black">{bat.strikeRate}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={2} className="py-2 px-2 text-left font-semibold text-black">Total</td>
                  <td className="py-2 px-2 text-right font-semibold text-black">{currentInnings.scoreDetails.runs}</td>
                  <td colSpan={2} className="py-2 px-2 text-right text-black">
                    ({currentInnings.scoreDetails.wickets} wkts, {currentInnings.scoreDetails.overs} ov)
                  </td>
                </tr>
                {currentInnings.extrasData && (
                  <tr>
                    <td colSpan={2} className="py-2 px-2 text-left text-black">Extras</td>
                    <td className="py-2 px-2 text-right text-black">{currentInnings.extrasData.total}</td>
                    <td colSpan={2} className="py-2 px-2 text-right text-black text-xs">
                      (WD: {currentInnings.extrasData.wides}, NB: {currentInnings.extrasData.noBalls})
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
          
          {/* Boundary Count */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-black">
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <span className="font-semibold">4s:</span> {batsmen.reduce((sum, bat) => sum + (bat.fours || 0), 0)}
            </div>
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <span className="font-semibold">6s:</span> {batsmen.reduce((sum, bat) => sum + (bat.sixes || 0), 0)}
            </div>
          </div>
        </div>

        {/* Bowling Section */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-black flex items-center border-b pb-1">
            <span className="mr-1">🎯</span> {bowlTeamDetails.bowlTeamShortName} - Bowling
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 text-left text-black">Bowler</th>
                  <th className="py-2 px-2 text-right text-black">O</th>
                  <th className="py-2 px-2 text-right text-black">M</th>
                  <th className="py-2 px-2 text-right text-black">R</th>
                  <th className="py-2 px-2 text-right text-black">W</th>
                  <th className="py-2 px-2 text-right text-black">Econ</th>
                </tr>
              </thead>
              <tbody>
                {bowlers.map((bowl: BowlerData, index: number) => (
                  <tr key={bowl.bowlerId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}>
                    <td className="py-2 px-2 text-black font-medium">
                      {bowl.bowlName}
                    </td>
                    <td className="py-2 px-2 text-right text-black">{bowl.overs}</td>
                    <td className="py-2 px-2 text-right text-black">{bowl.maidens || 0}</td>
                    <td className="py-2 px-2 text-right text-black">{bowl.runs}</td>
                    <td className="py-2 px-2 text-right font-medium text-black">{bowl.wickets}</td>
                    <td className="py-2 px-2 text-right text-black">{bowl.economy}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={3} className="py-2 px-2 text-left font-semibold text-black">Extras</td>
                  <td colSpan={3} className="py-2 px-2 text-right text-black text-xs">
                    WD: {currentInnings.extrasData?.wides || 0}, NB: {currentInnings.extrasData?.noBalls || 0}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Extra Bowling Stats */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-black">
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <span className="font-semibold">Best Bowler:</span> {
                bowlers.length > 0 ? 
                bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).bowlName +
                ` (${bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).wickets}/${
                  bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).runs})` : 'N/A'
              }
            </div>
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
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
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <h5 className="text-sm font-semibold text-black mb-1">Fall of Wickets:</h5>
          <p className="text-xs text-black leading-relaxed">{getFallOfWickets()}</p>
        </div>
      )}

      {/* Batting Stats and Partnerships in side-by-side grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Batting Stats */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-black flex items-center border-b pb-1">
            <span className="mr-1">📊</span> Batting Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <h5 className="text-xs font-semibold text-black">Top Scorer</h5>
              {batsmen.length > 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-black">{batsmen.reduce((max, bat) => bat.runs > max.runs ? bat : max, batsmen[0]).batName}</p>
                  <p className="text-xs text-black">{batsmen.reduce((max, bat) => bat.runs > max.runs ? bat : max, batsmen[0]).runs} runs ({batsmen.reduce((max, bat) => bat.runs > max.runs ? bat : max, batsmen[0]).balls} balls)</p>
                </div>
              ) : <p className="text-xs text-black">No data</p>}
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <h5 className="text-xs font-semibold text-black">Highest Strike Rate</h5>
              {batsmen.length > 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-black">{
                    batsmen.filter(bat => bat.balls >= 5)
                      .reduce((max, bat) => bat.strikeRate > max.strikeRate ? bat : max, 
                        batsmen.filter(bat => bat.balls >= 5)[0] || batsmen[0]).batName
                  }</p>
                  <p className="text-xs text-black">{
                    batsmen.filter(bat => bat.balls >= 5)
                      .reduce((max, bat) => bat.strikeRate > max.strikeRate ? bat : max, 
                        batsmen.filter(bat => bat.balls >= 5)[0] || batsmen[0]).strikeRate
                  } SR</p>
                </div>
              ) : <p className="text-xs text-black">No data</p>}
            </div>
          </div>
        </div>
        
        {/* Bowling Stats */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-black flex items-center border-b pb-1">
            <span className="mr-1">🎯</span> Bowling Highlights
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <h5 className="text-xs font-semibold text-black">Best Bowler</h5>
              {bowlers.length > 0 ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-black">{
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).bowlName
                  }</p>
                  <p className="text-xs text-black">{
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).wickets
                  }/{
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).runs
                  } ({
                    bowlers.reduce((best, bowl) => bowl.wickets > best.wickets ? bowl : best, bowlers[0]).overs
                  } ov)</p>
                </div>
              ) : <p className="text-xs text-black">No data</p>}
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <h5 className="text-xs font-semibold text-black">Best Economy</h5>
              {bowlers.length > 0 && bowlers.some(bowl => Number(bowl.overs) >= 2) ? (
                <div className="mt-1">
                  <p className="text-sm font-medium text-black">{
                    bowlers.filter(bowl => Number(bowl.overs) >= 2)
                      .reduce((best, bowl) => bowl.economy < best.economy ? bowl : best, 
                        bowlers.filter(bowl => Number(bowl.overs) >= 2)[0]).bowlName
                  }</p>
                  <p className="text-xs text-black">{
                    bowlers.filter(bowl => Number(bowl.overs) >= 2)
                      .reduce((best, bowl) => bowl.economy < best.economy ? bowl : best, 
                        bowlers.filter(bowl => Number(bowl.overs) >= 2)[0]).economy
                  } econ</p>
                </div>
              ) : <p className="text-xs text-black">Not enough overs</p>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Last updated */}
      <div className="mt-4 text-right">
        <p className="text-xs text-black">
          Last updated: {currentInnings?.timeScore ? new Date(currentInnings.timeScore).toLocaleTimeString() : 'N/A'}
        </p>
      </div>
    </section>
  );
};

export default LiveMatch;
