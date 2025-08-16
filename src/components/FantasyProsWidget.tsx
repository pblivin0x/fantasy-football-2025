import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface PlayerStats {
  rank: number;
  player: string;
  games: number;
  receptions: number;
  yards: number;
  targets: number;
  touchdowns?: number;
  rushAttempts?: number;
  rushYards?: number;
}

type StatsType = 'WR' | 'RB';
type ViewType = 'Totals' | 'Per_Game';

const FantasyProsWidget: React.FC = () => {
  const [statsType, setStatsType] = useState<StatsType>('WR');
  const [viewType, setViewType] = useState<ViewType>('Totals');
  const [data, setData] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadData(statsType, viewType);
  }, [statsType, viewType]);

  const loadData = async (type: StatsType, view: ViewType) => {
    setLoading(true);
    try {
      const fileName = view === 'Per_Game' 
        ? `FantasyPros_Fantasy_Football_${type}_2024_Per_${view === 'Per_Game' ? 'game' : 'Game'}.csv`
        : `FantasyPros_Fantasy_Football_${type}_2024_${view}.csv`;
      
      const response = await fetch(`/data/${fileName}`);
      const text = await response.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processedData = results.data
            .filter((row: any) => row.Player && row.Rank)
            .map((row: any) => {
              // Helper to parse numbers with commas
              const parseNum = (val: string) => parseInt(String(val).replace(/,/g, '')) || 0;
              
              if (type === 'WR') {
                return {
                  rank: parseInt(row.Rank) || 0,
                  player: row.Player?.replace(/\s*\([A-Z]+\)\s*$/, '') || '',
                  games: parseInt(row.G) || 0,
                  receptions: parseNum(row.REC),
                  yards: parseNum(row.YDS),
                  targets: parseNum(row.TGT),
                };
              } else {
                // RB data
                return {
                  rank: parseInt(row.Rank) || 0,
                  player: row.Player?.replace(/\s*\([A-Z]+\)\s*$/, '') || '',
                  games: parseInt(row.G) || 0,
                  rushAttempts: parseNum(row.ATT),
                  rushYards: parseNum(row.YDS),
                  receptions: parseNum(row.REC),
                  yards: parseNum(row.YDS), // For receiving yards display
                  targets: parseNum(row.TGT),
                };
              }
            })
            .slice(0, 50);
          
          setData(processedData);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading Fantasy Pros data:', error);
      setLoading(false);
    }
  };

  const displayData = expanded ? data.slice(0, 20) : data.slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setStatsType('WR')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all ${
                statsType === 'WR' 
                  ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Wide Receivers
            </button>
            <button
              onClick={() => setStatsType('RB')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all ${
                statsType === 'RB' 
                  ? 'text-green-600 bg-white border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Running Backs
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('Totals')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewType === 'Totals'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Season Totals
            </button>
            <button
              onClick={() => setViewType('Per_Game')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewType === 'Per_Game'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Per Game
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase">
                    <th className="text-left pb-3">Rank</th>
                    <th className="text-left pb-3">Player</th>
                    <th className="text-right pb-3">G</th>
                    {statsType === 'WR' ? (
                      <>
                        <th className="text-right pb-3">Tgt</th>
                        <th className="text-right pb-3">Rec</th>
                        <th className="text-right pb-3">Yds</th>
                      </>
                    ) : (
                      <>
                        <th className="text-right pb-3">Att</th>
                        <th className="text-right pb-3">Rush Yds</th>
                        <th className="text-right pb-3">Rec</th>
                        <th className="text-right pb-3">Rec Yds</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((player, index) => (
                    <tr key={index} className="border-t border-gray-50">
                      <td className="py-3 text-sm font-bold text-gray-500">#{player.rank}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{player.player}</td>
                      <td className="text-right py-3 text-sm text-gray-600">{player.games}</td>
                      {statsType === 'WR' ? (
                        <>
                          <td className="text-right py-3 text-sm text-gray-600">{player.targets}</td>
                          <td className="text-right py-3 text-sm text-gray-600">{player.receptions}</td>
                          <td className="text-right py-3 text-sm font-semibold text-gray-900">{player.yards}</td>
                        </>
                      ) : (
                        <>
                          <td className="text-right py-3 text-sm text-gray-600">{player.rushAttempts}</td>
                          <td className="text-right py-3 text-sm text-gray-600">{player.rushYards}</td>
                          <td className="text-right py-3 text-sm text-gray-600">{player.receptions}</td>
                          <td className="text-right py-3 text-sm font-semibold text-gray-900">{player.yards}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Expand/Collapse */}
              {data.length > 5 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                  >
                    {expanded ? '↑ Show Less' : '↓ Show More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FantasyProsWidget;