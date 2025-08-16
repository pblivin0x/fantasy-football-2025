import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface Stats {
  player: string;
  targets?: number;
  receptions?: number;
  attempts?: number;
  yards: number;
  touchdowns: number;
}

type StatsType = 'receiving' | 'rushing' | 'passing';

const FloatingStatsWidget: React.FC = () => {
  const [statsType, setStatsType] = useState<StatsType>('receiving');
  const [data, setData] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadData(statsType);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [statsType]);

  const loadData = async (type: StatsType) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/pff-nfl-regular-${type}-2024.csv`);
      const text = await response.text();
      
      const lines = text.split('\n');
      const hasDoubleHeader = lines[0].includes(',,');
      const dataText = hasDoubleHeader ? lines.slice(1).join('\n') : text;
      
      Papa.parse(dataText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          let processedData: Stats[] = [];
          
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
              .sort((a, b) => b.yards - a.yards);
          } else if (type === 'rushing') {
            processedData = results.data
              .filter((row: any) => row.Player && row.Att)
              .map((row: any) => ({
                player: row.Player,
                attempts: parseInt(row.Att) || 0,
                yards: parseInt(row.Yds || row.Yards) || 0,
                touchdowns: parseInt(row.TD || row.Touchdowns) || 0
              }))
              .sort((a, b) => b.yards - a.yards);
          } else if (type === 'passing') {
            processedData = results.data
              .filter((row: any) => row.Player && row.Att)
              .map((row: any) => ({
                player: row.Player,
                attempts: parseInt(row.Att) || 0,
                yards: parseInt(row.Yds || row.Yards) || 0,
                touchdowns: parseInt(row.TD || row.Touchdowns) || 0
              }))
              .sort((a, b) => b.yards - a.yards);
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

  const displayData = expanded ? data.slice(0, 20) : data.slice(0, 5);

  return (
    <div className={`w-full max-w-3xl mx-auto transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Floating card container */}
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Tab navigation - clean and minimal */}
        <div className="border-b border-gray-100">
          <div className="flex">
            {(['receiving', 'rushing', 'passing'] as StatsType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setStatsType(type);
                  setExpanded(false);
                }}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                  statsType === type 
                    ? 'text-gray-900 bg-gray-50 border-b-2 border-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider">
                    <th className="text-left font-medium pb-4">Player</th>
                    {statsType === 'receiving' && (
                      <>
                        <th className="text-right font-medium pb-4">Tgt</th>
                        <th className="text-right font-medium pb-4">Rec</th>
                      </>
                    )}
                    {(statsType === 'rushing' || statsType === 'passing') && (
                      <th className="text-right font-medium pb-4">Att</th>
                    )}
                    <th className="text-right font-medium pb-4">Yds</th>
                    <th className="text-right font-medium pb-4">TD</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-t border-gray-50 transition-all duration-300 ${
                        index >= 5 ? 'animate-fadeIn' : ''
                      }`}
                    >
                      <td className="py-3 text-sm font-medium text-gray-900">{row.player}</td>
                      {statsType === 'receiving' && (
                        <>
                          <td className="text-right py-3 text-sm text-gray-600">{row.targets}</td>
                          <td className="text-right py-3 text-sm text-gray-600">{row.receptions}</td>
                        </>
                      )}
                      {(statsType === 'rushing' || statsType === 'passing') && (
                        <td className="text-right py-3 text-sm text-gray-600">{row.attempts}</td>
                      )}
                      <td className="text-right py-3 text-sm font-medium text-gray-900">{row.yards.toLocaleString()}</td>
                      <td className="text-right py-3 text-sm text-gray-600">{row.touchdowns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Expand/Collapse button */}
              {data.length > 5 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
                  >
                    {expanded ? (
                      <>
                        Show Less
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
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

export default FloatingStatsWidget;