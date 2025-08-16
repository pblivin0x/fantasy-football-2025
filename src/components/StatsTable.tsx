import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface PlayerStats {
  player: string;
  targets: number;
  receptions: number;
  yards: number;
  touchdowns: number;
}

const StatsTable: React.FC = () => {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState('2024');
  const [type, setType] = useState('regular');

  useEffect(() => {
    loadData();
  }, [season, type]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/data/pff-nfl-${type}-receiving-${season}.csv`);
      const text = await response.text();
      
      // Skip the first line and parse from the second line
      const lines = text.split('\n');
      const dataWithoutFirstLine = lines.slice(1).join('\n');
      
      Papa.parse(dataWithoutFirstLine, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processedStats = results.data
            .filter((row: any) => row.Player && row.Tgt && row.Rec)
            .map((row: any) => ({
              player: row.Player,
              targets: parseInt(row.Tgt) || 0,
              receptions: parseInt(row.Rec) || 0,
              yards: parseInt(row.Yds) || 0,
              touchdowns: parseInt(row.TD) || 0
            }))
            .sort((a: PlayerStats, b: PlayerStats) => b.yards - a.yards)
            .slice(0, 30);
          
          setStats(processedStats);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Receiving Statistics</h2>
          <div className="flex gap-4 mb-6">
            <select 
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400"
            >
              <option value="regular">Regular Season</option>
              <option value="playoff">Playoffs</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-normal text-gray-600 text-sm">Player</th>
                  <th className="text-right py-2 px-2 font-normal text-gray-600 text-sm">Targets</th>
                  <th className="text-right py-2 px-2 font-normal text-gray-600 text-sm">Receptions</th>
                  <th className="text-right py-2 px-2 font-normal text-gray-600 text-sm">Yards</th>
                  <th className="text-right py-2 px-2 font-normal text-gray-600 text-sm">TDs</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((player, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-2 text-gray-800 text-sm">{player.player}</td>
                    <td className="text-right py-2 px-2 text-gray-600 text-sm">{player.targets}</td>
                    <td className="text-right py-2 px-2 text-gray-600 text-sm">{player.receptions}</td>
                    <td className="text-right py-2 px-2 text-gray-600 text-sm">{player.yards.toLocaleString()}</td>
                    <td className="text-right py-2 px-2 text-gray-600 text-sm">{player.touchdowns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsTable;