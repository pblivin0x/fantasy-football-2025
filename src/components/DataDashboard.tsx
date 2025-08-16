import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, Trophy, Database, AlertCircle } from 'lucide-react';
import UniversalStatsTable from './UniversalStatsTable';
import { 
  availableDataFiles, 
  loadCSVData, 
  getColumnsByStatType,
  StatType, 
  SeasonType, 
  Year 
} from '../utils/dataLoader';

export default function DataDashboard() {
  const [activeStatType, setActiveStatType] = useState<StatType>('receiving');
  const [activeSeasonType, setActiveSeasonType] = useState<SeasonType>('regular');
  const [activeYear, setActiveYear] = useState<Year>('2024');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState<Map<string, boolean>>(new Map());

  // Check which files are available on mount
  useEffect(() => {
    checkDataAvailability();
    console.log('DataDashboard mounted - checking data availability');
  }, []);

  // Load data when selections change
  useEffect(() => {
    loadSelectedData();
  }, [activeStatType, activeSeasonType, activeYear]);

  const checkDataAvailability = async () => {
    console.log('Checking availability for', availableDataFiles.length, 'files');
    const status = new Map<string, boolean>();
    
    for (const file of availableDataFiles) {
      try {
        const response = await fetch(`/data/${file.fileName}`);
        const isAvailable = response.ok;
        status.set(file.fileName, isAvailable);
        console.log(`${file.fileName}: ${isAvailable ? '✓' : '✗'}`);
      } catch (err) {
        status.set(file.fileName, false);
        console.log(`${file.fileName}: ✗ (error)`, err);
      }
    }
    
    setDataStatus(status);
    console.log('Data availability check complete:', status.size, 'files checked');
  };

  const loadSelectedData = async () => {
    const file = availableDataFiles.find(
      f => f.statType === activeStatType && 
           f.seasonType === activeSeasonType && 
           f.year === activeYear
    );

    if (!file) {
      setError('No data file found for selected options');
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loadedData = await loadCSVData(file.fileName);
      setData(loadedData);
      console.log(`Loaded ${loadedData.length} records from ${file.fileName}`);
    } catch (err) {
      setError(`Failed to load ${file.displayName}`);
      setData([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatIcon = (type: StatType) => {
    switch (type) {
      case 'receiving': return <Users className="w-4 h-4" />;
      case 'passing': return <TrendingUp className="w-4 h-4" />;
      case 'rushing': return <Trophy className="w-4 h-4" />;
    }
  };

  const currentFile = availableDataFiles.find(
    f => f.statType === activeStatType && 
         f.seasonType === activeSeasonType && 
         f.year === activeYear
  );

  const isDataAvailable = currentFile ? dataStatus.get(currentFile.fileName) : false;

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="mb-6 space-y-4">
        {/* Stat Type Selector with enhanced design */}
        <div className="flex flex-wrap gap-3">
          {(['receiving', 'passing', 'rushing'] as StatType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveStatType(type)}
              className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all transform ${
                activeStatType === type 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:scale-102'
              }`}
            >
              <span className={`${activeStatType === type ? 'animate-pulse' : ''}`}>
                {getStatIcon(type)}
              </span>
              <span className="capitalize">{type}</span>
              {activeStatType === type && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">Active</span>
              )}
            </button>
          ))}
        </div>

        {/* Season Type and Year Selector with enhanced design */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 bg-gray-800/50 backdrop-blur rounded-xl p-1.5 border border-gray-700">
            {(['regular', 'playoff'] as SeasonType[]).map(season => (
              <button
                key={season}
                onClick={() => setActiveSeasonType(season)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSeasonType === season 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {season === 'regular' ? '🏈 Regular Season' : '🏆 Playoffs'}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-gray-800/50 backdrop-blur rounded-xl p-1.5 border border-gray-700">
            {(['2024', '2023', '2022'] as Year[]).map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeYear === year 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          
          {/* Live indicator */}
          {isDataAvailable && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Data Loaded</span>
            </div>
          )}
        </div>

        {/* Data Status Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Database className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">
            {isDataAvailable ? (
              <span className="text-green-400">Data available</span>
            ) : (
              <span className="text-yellow-400">Data not found - please add CSV file</span>
            )}
          </span>
          {currentFile && (
            <span className="text-gray-500 text-xs">
              ({currentFile.fileName})
            </span>
          )}
        </div>
      </div>

      {/* Data Display */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2 text-gray-400">Loading data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Make sure the file exists: public/data/{currentFile?.fileName}
          </p>
        </div>
      )}

      {!loading && !error && data.length > 0 && currentFile && (
        <UniversalStatsTable 
          data={data}
          columns={getColumnsByStatType(activeStatType)}
          title={currentFile.displayName}
        />
      )}

      {!loading && !error && data.length === 0 && !isDataAvailable && (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg">
          <Database className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">No data loaded</p>
          <p className="text-sm text-gray-500">
            Please add the CSV file: {currentFile?.fileName}
          </p>
        </div>
      )}
    </div>
  );
}