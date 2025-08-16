import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Trophy } from 'lucide-react';

interface PlayerStats {
  Rank: number;
  Player: string;
  Team: string;
  G: number;
  // WR specific
  REC?: number;
  TGT?: number;
  YDS?: number;
  'Y/R'?: number;
  TD?: number;
  RZ_TGT?: number;
  // RB specific
  RUSH?: number;
  RUSH_YDS?: number;
  RUSH_TD?: number;
  REC_YDS?: number;
  REC_TD?: number;
  // Common
  FPTS: number;
  'FPTS/G': number;
}

export default function FantasyProsDataWidget() {
  const [activeTab, setActiveTab] = useState<'WR' | 'RB'>('WR');
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // First try the corrected data
      const filename = activeTab === 'WR' 
        ? 'FantasyPros_WR_2024_Totals_Corrected.csv'
        : 'FantasyPros_RB_2024_Totals_Corrected.csv';
      
      const response = await fetch(`/data/${filename}`);
      if (!response.ok) {
        // Fallback to JSON if CSV not found
        const jsonResponse = await fetch('/data/fantasy_pros_data.json');
        const jsonData = await jsonResponse.json();
        const key = activeTab === 'WR' ? 'wr_2024' : 'rb_2024';
        setData(jsonData[key] || []);
      } else {
        const text = await response.text();
        const parsed = parseCSV(text);
        setData(parsed);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Use fallback sample data
      setData(getSampleData(activeTab));
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (text: string): PlayerStats[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Convert numeric fields
        if (['Rank', 'G', 'REC', 'TGT', 'YDS', 'TD', 'RZ_TGT', 'RUSH', 'RUSH_YDS', 'RUSH_TD', 'REC_YDS', 'REC_TD'].includes(header)) {
          obj[header] = parseInt(value) || 0;
        } else if (['Y/R', 'FPTS', 'FPTS/G'].includes(header)) {
          obj[header] = parseFloat(value) || 0;
        } else {
          obj[header] = value;
        }
      });
      return obj;
    });
  };

  const getSampleData = (position: 'WR' | 'RB'): PlayerStats[] => {
    if (position === 'WR') {
      return [
        { Rank: 1, Player: "Ja'Marr Chase", Team: "CIN", G: 17, REC: 127, TGT: 175, YDS: 1708, 'Y/R': 13.4, TD: 11, RZ_TGT: 35, FPTS: 295.8, 'FPTS/G': 17.4 },
        { Rank: 2, Player: "Justin Jefferson", Team: "MIN", G: 17, REC: 103, TGT: 154, YDS: 1533, 'Y/R': 14.9, TD: 5, RZ_TGT: 25, FPTS: 213.3, 'FPTS/G': 12.5 },
      ];
    } else {
      return [
        { Rank: 1, Player: "Saquon Barkley", Team: "PHI", G: 17, RUSH: 350, RUSH_YDS: 2005, RUSH_TD: 13, REC: 35, REC_YDS: 285, REC_TD: 2, FPTS: 341.0, 'FPTS/G': 20.1 },
        { Rank: 2, Player: "Derrick Henry", Team: "BAL", G: 17, RUSH: 325, RUSH_YDS: 1921, RUSH_TD: 16, REC: 12, REC_YDS: 95, REC_TD: 0, FPTS: 305.6, 'FPTS/G': 18.0 },
      ];
    }
  };

  const displayData = expanded ? data : data.slice(0, 5);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-white">2024 Season Leaders</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('WR')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'WR'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            WR
          </button>
          <button
            onClick={() => setActiveTab('RB')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'RB'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            RB
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading data...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <th className="py-3 px-2">Rank</th>
                  <th className="py-3 px-2">Player</th>
                  <th className="py-3 px-2">Team</th>
                  <th className="py-3 px-2">G</th>
                  {activeTab === 'WR' ? (
                    <>
                      <th className="py-3 px-2">REC</th>
                      <th className="py-3 px-2">TGT</th>
                      <th className="py-3 px-2">YDS</th>
                      <th className="py-3 px-2">Y/R</th>
                      <th className="py-3 px-2">TD</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-2">RUSH</th>
                      <th className="py-3 px-2">YDS</th>
                      <th className="py-3 px-2">TD</th>
                      <th className="py-3 px-2">REC</th>
                      <th className="py-3 px-2">REC YDS</th>
                    </>
                  )}
                  <th className="py-3 px-2">FPTS</th>
                  <th className="py-3 px-2">FPTS/G</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((player, index) => (
                  <tr 
                    key={player.Rank}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-400">{player.Rank}</td>
                    <td className="py-3 px-2 text-white font-medium">{player.Player}</td>
                    <td className="py-3 px-2 text-gray-400">{player.Team}</td>
                    <td className="py-3 px-2 text-gray-300">{player.G}</td>
                    {activeTab === 'WR' ? (
                      <>
                        <td className="py-3 px-2 text-gray-300">{player.REC}</td>
                        <td className="py-3 px-2 text-gray-300">{player.TGT}</td>
                        <td className="py-3 px-2 text-yellow-500 font-semibold">{player.YDS}</td>
                        <td className="py-3 px-2 text-gray-300">{player['Y/R']?.toFixed(1)}</td>
                        <td className="py-3 px-2 text-green-500">{player.TD}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-2 text-gray-300">{player.RUSH}</td>
                        <td className="py-3 px-2 text-yellow-500 font-semibold">{player.RUSH_YDS}</td>
                        <td className="py-3 px-2 text-green-500">{player.RUSH_TD}</td>
                        <td className="py-3 px-2 text-gray-300">{player.REC || player.RUSH}</td>
                        <td className="py-3 px-2 text-gray-300">{player.REC_YDS}</td>
                      </>
                    )}
                    <td className="py-3 px-2 text-blue-400 font-semibold">{player.FPTS.toFixed(1)}</td>
                    <td className="py-3 px-2 text-gray-300">{player['FPTS/G'].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              {expanded ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show All {data.length} Players <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Data from Fantasy Pros • Updated Weekly
      </div>
    </div>
  );
}