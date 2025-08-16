import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { receivingData, calculateAdvancedMetrics, ReceivingStats } from '../data/nfl-receiving-2024';

type SortKey = keyof ReceivingStats | 'adot' | 'yprr' | 'targetShare' | 'fantasyPoints';
type SortDirection = 'asc' | 'desc';

export default function ReceivingStatsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const processedData = useMemo(() => {
    return receivingData.map(calculateAdvancedMetrics);
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let filtered = processedData;

    // Filter by position
    if (positionFilter !== 'ALL') {
      filtered = filtered.filter(player => player.position === positionFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortKey as keyof typeof a];
      const bVal = b[sortKey as keyof typeof b];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return sorted;
  }, [processedData, positionFilter, searchTerm, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline w-4 h-4 ml-1" />
      : <ChevronDown className="inline w-4 h-4 ml-1" />;
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search player or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white/10 text-white placeholder-gray-400 border-gray-600 focus:outline-none focus:border-green-500"
          />
          
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white/10 text-white border-gray-600 focus:outline-none focus:border-green-500"
          >
            <option value="ALL">All Positions</option>
            <option value="WR">Wide Receivers</option>
            <option value="TE">Tight Ends</option>
            <option value="RB">Running Backs</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Metrics
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Showing {filteredAndSortedData.length} of {receivingData.length} players
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th 
                className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('rank')}
              >
                Rk <SortIcon columnKey="rank" />
              </th>
              <th 
                className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700 sticky left-0 bg-gray-800 z-10"
                onClick={() => handleSort('player')}
              >
                Player <SortIcon columnKey="player" />
              </th>
              <th 
                className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('team')}
              >
                Team <SortIcon columnKey="team" />
              </th>
              <th 
                className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('position')}
              >
                Pos <SortIcon columnKey="position" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('games')}
              >
                G <SortIcon columnKey="games" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('targets')}
              >
                Tgt <SortIcon columnKey="targets" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('receptions')}
              >
                Rec <SortIcon columnKey="receptions" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('yards')}
              >
                Yds <SortIcon columnKey="yards" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('yardsPerReception')}
              >
                Y/R <SortIcon columnKey="yardsPerReception" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('touchdowns')}
              >
                TD <SortIcon columnKey="touchdowns" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('catchPercentage')}
              >
                Ctch% <SortIcon columnKey="catchPercentage" />
              </th>
              <th 
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('yardsPerGame')}
              >
                Y/G <SortIcon columnKey="yardsPerGame" />
              </th>
              {showAdvanced && (
                <>
                  <th 
                    className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700 bg-green-900/30"
                    onClick={() => handleSort('adot')}
                  >
                    aDOT <SortIcon columnKey="adot" />
                  </th>
                  <th 
                    className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700 bg-green-900/30"
                    onClick={() => handleSort('yprr')}
                  >
                    YPRR <SortIcon columnKey="yprr" />
                  </th>
                  <th 
                    className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700 bg-green-900/30"
                    onClick={() => handleSort('targetShare')}
                  >
                    Tgt% <SortIcon columnKey="targetShare" />
                  </th>
                  <th 
                    className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700 bg-green-900/30"
                    onClick={() => handleSort('fantasyPoints')}
                  >
                    Fantasy Pts <SortIcon columnKey="fantasyPoints" />
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredAndSortedData.map((player, index) => (
              <tr 
                key={player.playerId} 
                className={`hover:bg-gray-800/50 transition-colors ${
                  index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'
                }`}
              >
                <td className="px-3 py-2">{player.rank}</td>
                <td className="px-3 py-2 font-medium sticky left-0 bg-gray-900/95">
                  {player.player}
                  {player.awards && (
                    <span className="ml-2 text-xs text-yellow-500">★</span>
                  )}
                </td>
                <td className="px-3 py-2">{player.team}</td>
                <td className="px-3 py-2">{player.position}</td>
                <td className="px-3 py-2 text-center">{player.games}</td>
                <td className="px-3 py-2 text-center">{player.targets}</td>
                <td className="px-3 py-2 text-center">{player.receptions}</td>
                <td className="px-3 py-2 text-center font-medium">{player.yards}</td>
                <td className="px-3 py-2 text-center">{player.yardsPerReception.toFixed(1)}</td>
                <td className="px-3 py-2 text-center font-medium text-green-400">{player.touchdowns}</td>
                <td className="px-3 py-2 text-center">{player.catchPercentage.toFixed(1)}%</td>
                <td className="px-3 py-2 text-center">{player.yardsPerGame.toFixed(1)}</td>
                {showAdvanced && (
                  <>
                    <td className="px-3 py-2 text-center bg-green-900/10">
                      {player.adot.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-center bg-green-900/10">
                      {player.yprr.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center bg-green-900/10">
                      {player.targetShare.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-center bg-green-900/10 font-medium">
                      {player.fantasyPoints.toFixed(1)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}