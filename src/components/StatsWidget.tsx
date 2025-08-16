import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface ReceivingStats {
  player: string;
  targets: number;
  receptions: number;
  yards: number;
  touchdowns: number;
}

interface RushingStats {
  player: string;
  attempts: number;
  yards: number;
  touchdowns: number;
}

interface PassingStats {
  player: string;
  attempts: number;
  yards: number;
  touchdowns: number;
}

type StatsType = 'receiving' | 'rushing' | 'passing';

const StatsWidget: React.FC = () => {
  const [statsType, setStatsType] = useState<StatsType>('receiving');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(statsType);
  }, [statsType]);

  const loadData = async (type: StatsType) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/pff-nfl-regular-${type}-2024.csv`);
      const text = await response.text();
      
      // Skip first line if it contains duplicate headers
      const lines = text.split('\n');
      const hasDoubleHeader = lines[0].includes(',,');
      const dataText = hasDoubleHeader ? lines.slice(1).join('\n') : text;
      
      Papa.parse(dataText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          let processedData: any[] = [];
          
          if (type === 'receiving') {
            processedData = results.data
              .filter((row: any) => row.Player && row.Tgt)
              .map((row: any) => ({
                player: row.Player,
                targets: parseInt(row.Tgt) || 0,
                receptions: parseInt(row.Rec) || 0,
                yards: parseInt(row.Yds) || 0,
                touchdowns: parseInt(row.TD) || 0
              }))
              .sort((a, b) => b.yards - a.yards)
              .slice(0, 20);
          } else if (type === 'rushing') {
            processedData = results.data
              .filter((row: any) => row.Player && row.Att)
              .map((row: any) => ({
                player: row.Player,
                attempts: parseInt(row.Att) || 0,
                yards: parseInt(row.Yds || row.Yards) || 0,
                touchdowns: parseInt(row.TD || row.Touchdowns) || 0
              }))
              .sort((a, b) => b.yards - a.yards)
              .slice(0, 20);
          } else if (type === 'passing') {
            processedData = results.data
              .filter((row: any) => row.Player && row.Att)
              .map((row: any) => ({
                player: row.Player,
                attempts: parseInt(row.Att) || 0,
                yards: parseInt(row.Yds || row.Yards) || 0,
                touchdowns: parseInt(row.TD || row.Touchdowns) || 0
              }))
              .sort((a, b) => b.yards - a.yards)
              .slice(0, 20);
          }
          
          setData(processedData);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Minimal tab switcher */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button
          onClick={() => setStatsType('receiving')}
          className={`pb-2 text-sm font-light transition-colors ${
            statsType === 'receiving' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Receiving
        </button>
        <button
          onClick={() => setStatsType('rushing')}
          className={`pb-2 text-sm font-light transition-colors ${
            statsType === 'rushing' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Rushing
        </button>
        <button
          onClick={() => setStatsType('passing')}
          className={`pb-2 text-sm font-light transition-colors ${
            statsType === 'passing' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Passing
        </button>
      </div>

      {/* Stats table */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 font-normal text-gray-500 text-xs">Player</th>
                {statsType === 'receiving' && (
                  <>
                    <th className="text-right py-2 font-normal text-gray-500 text-xs">Targets</th>
                    <th className="text-right py-2 font-normal text-gray-500 text-xs">Receptions</th>
                  </>
                )}
                {statsType === 'rushing' && (
                  <th className="text-right py-2 font-normal text-gray-500 text-xs">Attempts</th>
                )}
                {statsType === 'passing' && (
                  <th className="text-right py-2 font-normal text-gray-500 text-xs">Attempts</th>
                )}
                <th className="text-right py-2 font-normal text-gray-500 text-xs">Yards</th>
                <th className="text-right py-2 font-normal text-gray-500 text-xs">TDs</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, index) => (
                <tr key={index} className="border-b border-gray-50">
                  <td className="py-2 text-sm text-gray-800">{row.player}</td>
                  {statsType === 'receiving' && (
                    <>
                      <td className="text-right py-2 text-sm text-gray-600">{row.targets}</td>
                      <td className="text-right py-2 text-sm text-gray-600">{row.receptions}</td>
                    </>
                  )}
                  {(statsType === 'rushing' || statsType === 'passing') && (
                    <td className="text-right py-2 text-sm text-gray-600">{row.attempts}</td>
                  )}
                  <td className="text-right py-2 text-sm text-gray-600">{row.yards.toLocaleString()}</td>
                  <td className="text-right py-2 text-sm text-gray-600">{row.touchdowns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatsWidget;