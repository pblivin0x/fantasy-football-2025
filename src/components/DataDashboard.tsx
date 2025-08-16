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
  }, []);

  // Load data when selections change
  useEffect(() => {
    loadSelectedData();
  }, [activeStatType, activeSeasonType, activeYear]);

  const checkDataAvailability = async () => {
    const status = new Map<string, boolean>();
    
    for (const file of availableDataFiles) {
      try {
        const response = await fetch(`/data/${file.fileName}`);
        status.set(file.fileName, response.ok);
      } catch {
        status.set(file.fileName, false);
      }
    }
    
    setDataStatus(status);
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
        {/* Stat Type Selector */}
        <div className="flex flex-wrap gap-2">
          {(['receiving', 'passing', 'rushing'] as StatType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveStatType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeStatType === type 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {getStatIcon(type)}
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>

        {/* Season Type and Year Selector */}
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {(['regular', 'playoff'] as SeasonType[]).map(season => (
              <button
                key={season}
                onClick={() => setActiveSeasonType(season)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeSeasonType === season 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {season === 'regular' ? 'Regular Season' : 'Playoffs'}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {(['2024', '2023', '2022'] as Year[]).map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeYear === year 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
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