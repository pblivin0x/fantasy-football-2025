import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  type: 'string' | 'number';
}

interface Props {
  data: any[];
  columns: Column[];
  title: string;
}

export default function UniversalStatsTable({ data, columns, title }: Props) {
  const [sortKey, setSortKey] = useState<string>('Rk');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');

  // Get unique positions from data
  const positions = useMemo(() => {
    const posSet = new Set<string>();
    data.forEach(row => {
      if (row.Pos) posSet.add(row.Pos);
    });
    return Array.from(posSet).sort();
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Filter by position if column exists
    if (positionFilter !== 'ALL' && columns.some(col => col.key === 'Pos')) {
      filtered = filtered.filter(player => {
        return player.Pos && player.Pos.includes(positionFilter);
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.Player?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.Team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    const sorted = filtered.sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];
      
      // Convert string numbers to actual numbers for proper sorting
      const column = columns.find(col => col.key === sortKey);
      if (column?.type === 'number') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
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
  }, [data, columns, positionFilter, searchTerm, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline w-4 h-4 ml-1" />
      : <ChevronDown className="inline w-4 h-4 ml-1" />;
  };

  const formatValue = (value: any, column: Column) => {
    if (value === undefined || value === null || value === '') return '-';
    
    if (column.type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      
      // Format percentages
      if (column.key.includes('%')) {
        return `${num.toFixed(1)}%`;
      }
      
      // Format decimals for rates and averages
      if (column.key.includes('/') || column.key === 'Rate' || column.key === 'QBR') {
        return num.toFixed(1);
      }
      
      // Round whole numbers
      if (column.key === 'Yds' || column.key === 'TD' || column.key === 'Int' || 
          column.key === 'Att' || column.key === 'Cmp' || column.key === 'Rec' || 
          column.key === 'Tgt' || column.key === 'Fmb') {
        return Math.round(num).toString();
      }
      
      return num.toFixed(1);
    }
    
    return value;
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{title}</h3>
          <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
            {filteredAndSortedData.length} players
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="🔍 Search player or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border-gray-700 focus:outline-none focus:border-green-500 focus:bg-gray-800/70 transition-all text-sm"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
          
          {columns.some(col => col.key === 'Pos') && positions.length > 0 && (
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-4 py-2.5 border rounded-xl bg-gray-800/50 text-white border-gray-700 focus:outline-none focus:border-green-500 focus:bg-gray-800/70 transition-all text-sm font-medium"
            >
              <option value="ALL">📊 All Positions</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>
                  {pos === 'QB' ? '🎯 ' : pos === 'RB' ? '🏃 ' : pos === 'WR' ? '🙌 ' : pos === 'TE' ? '💪 ' : ''}{pos}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-gray-400">
          Showing {filteredAndSortedData.length} of {data.length} players
        </div>
      </div>

      {/* Table with enhanced design */}
      <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-700/50">
        <table className="w-full text-xs">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-3 py-3 text-left cursor-pointer hover:bg-gray-700/50 transition-colors ${
                    column.key === 'Player' ? 'sticky left-0 bg-gradient-to-r from-gray-800 to-gray-900 z-10' : ''
                  } ${sortKey === column.key ? 'bg-gray-700/30' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{column.label}</span>
                    <SortIcon columnKey={column.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredAndSortedData.map((row, index) => (
              <tr 
                key={`${row.Player}-${index}`}
                className={`hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-transparent transition-all ${
                  index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-900/5'
                }`}
              >
                {columns.map(column => (
                  <td 
                    key={column.key}
                    className={`px-3 py-2 ${
                      column.key === 'Player' 
                        ? 'font-semibold sticky left-0 bg-gray-900/95 text-white' 
                        : ''
                    } ${
                      column.key === 'TD' 
                        ? 'text-green-400 font-bold' 
                        : column.key === 'Int' 
                        ? 'text-red-400' 
                        : column.key === 'Yds' 
                        ? 'text-blue-400 font-medium'
                        : ''
                    }`}
                  >
                    {formatValue(row[column.key], column)}
                    {column.key === 'Player' && row.Awards && row.Awards !== '' && (
                      <span className="ml-2 text-yellow-400 animate-pulse">⭐</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}