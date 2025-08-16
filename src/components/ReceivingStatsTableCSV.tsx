import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReceivingStatsLoader, { ReceivingStatsRow } from './ReceivingStatsLoader';

type SortKey = keyof ReceivingStatsRow | 'adot' | 'yprr' | 'targetShare' | 'fantasyPoints';
type SortDirection = 'asc' | 'desc';

interface ProcessedStats extends ReceivingStatsRow {
  adot: number;
  yprr: number;
  targetShare: number;
  fantasyPoints: number;
}

export default function ReceivingStatsTableCSV() {
  const [rawData, setRawData] = useState<ReceivingStatsRow[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('Rk');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minTargets, setMinTargets] = useState(0);

  const processedData = useMemo(() => {
    return rawData.map(row => {
      const targets = parseFloat(row.Tgt) || 0;
      const receptions = parseFloat(row.Rec) || 0;
      const yards = parseFloat(row.Yds) || 0;
      const touchdowns = parseFloat(row.TD) || 0;
      const games = parseFloat(row.G) || 1;
      const yardsPerTarget = parseFloat(row['Y/Tgt']) || 0;
      const yardsPerGame = parseFloat(row['Y/G']) || 0;

      // Calculate advanced metrics
      const adot = yardsPerTarget * 1.2; // Rough estimate
      const yprr = yardsPerGame / 30; // Assuming ~30 routes per game
      const targetShare = (targets / (games * 35)) * 100; // Assuming ~35 team targets per game
      const fantasyPoints = yards * 0.1 + touchdowns * 6 + receptions * 0.5; // Half PPR

      return {
        ...row,
        adot,
        yprr,
        targetShare,
        fantasyPoints
      } as ProcessedStats;
    });
  }, [rawData]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = processedData;

    // Filter by minimum targets
    filtered = filtered.filter(player => {
      const targets = parseFloat(player.Tgt) || 0;
      return targets >= minTargets;
    });

    // Filter by position
    if (positionFilter !== 'ALL') {
      filtered = filtered.filter(player => player.Pos === positionFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.Player.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.Team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    const sorted = [...filtered].sort((a, b) => {
      let aVal: any = a[sortKey as keyof ProcessedStats];
      let bVal: any = b[sortKey as keyof ProcessedStats];
      
      // Convert string numbers to actual numbers for proper sorting
      if (typeof aVal === 'string' && !isNaN(parseFloat(aVal))) {
        aVal = parseFloat(aVal);
      }
      if (typeof bVal === 'string' && !isNaN(parseFloat(bVal))) {
        bVal = parseFloat(bVal);
      }
      
      if (aVal === null || aVal === undefined || aVal === '') return 1;
      if (bVal === null || bVal === undefined || bVal === '') return -1;
      
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
  }, [processedData, positionFilter, searchTerm, sortKey, sortDirection, minTargets]);

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
      {/* CSV Loader */}
      <ReceivingStatsLoader onDataLoaded={setRawData} />

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
            <option value="FB">Fullbacks</option>
            <option value="QB">Quarterbacks</option>
          </select>

          <input
            type="number"
            placeholder="Min targets"
            value={minTargets || ''}
            onChange={(e) => setMinTargets(parseInt(e.target.value) || 0)}
            className="px-4 py-2 border rounded-lg bg-white/10 text-white placeholder-gray-400 border-gray-600 focus:outline-none focus:border-green-500 w-32"
            min="0"
          />

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Metrics
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Showing {filteredAndSortedData.length} of {rawData.length} players
          {minTargets > 0 && ` (Min ${minTargets} targets)`}
        </div>
      </div>

      {/* Table */}
      {rawData.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th 
                  className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Rk')}
                >
                  Rk <SortIcon columnKey="Rk" />
                </th>
                <th 
                  className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700 sticky left-0 bg-gray-800 z-10"
                  onClick={() => handleSort('Player')}
                >
                  Player <SortIcon columnKey="Player" />
                </th>
                <th 
                  className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Team')}
                >
                  Team <SortIcon columnKey="Team" />
                </th>
                <th 
                  className="px-3 py-3 text-left cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Pos')}
                >
                  Pos <SortIcon columnKey="Pos" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Age')}
                >
                  Age <SortIcon columnKey="Age" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('G')}
                >
                  G <SortIcon columnKey="G" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Tgt')}
                >
                  Tgt <SortIcon columnKey="Tgt" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Rec')}
                >
                  Rec <SortIcon columnKey="Rec" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Yds')}
                >
                  Yds <SortIcon columnKey="Yds" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Y/R')}
                >
                  Y/R <SortIcon columnKey="Y/R" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('TD')}
                >
                  TD <SortIcon columnKey="TD" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('1D')}
                >
                  1D <SortIcon columnKey="1D" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Ctch%')}
                >
                  Ctch% <SortIcon columnKey="Ctch%" />
                </th>
                <th 
                  className="px-3 py-3 text-center cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('Y/G')}
                >
                  Y/G <SortIcon columnKey="Y/G" />
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
                  key={`${player.PlayerID || player.Player}-${index}`}
                  className={`hover:bg-gray-800/50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'
                  }`}
                >
                  <td className="px-3 py-2">{player.Rk}</td>
                  <td className="px-3 py-2 font-medium sticky left-0 bg-gray-900/95">
                    {player.Player}
                    {player.Awards && player.Awards !== '' && (
                      <span className="ml-2 text-xs text-yellow-500">★</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{player.Team}</td>
                  <td className="px-3 py-2">{player.Pos}</td>
                  <td className="px-3 py-2 text-center">{player.Age}</td>
                  <td className="px-3 py-2 text-center">{player.G}</td>
                  <td className="px-3 py-2 text-center">{player.Tgt}</td>
                  <td className="px-3 py-2 text-center">{player.Rec}</td>
                  <td className="px-3 py-2 text-center font-medium">{player.Yds}</td>
                  <td className="px-3 py-2 text-center">{player['Y/R']}</td>
                  <td className="px-3 py-2 text-center font-medium text-green-400">{player.TD}</td>
                  <td className="px-3 py-2 text-center">{player['1D']}</td>
                  <td className="px-3 py-2 text-center">{player['Ctch%']}</td>
                  <td className="px-3 py-2 text-center">{player['Y/G']}</td>
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
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-2">No data loaded yet</p>
          <p className="text-sm">Upload a CSV file or place it in public/data/nfl-receiving-2024-full.csv</p>
        </div>
      )}
    </div>
  );
}