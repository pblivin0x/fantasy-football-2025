import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Upload, AlertCircle } from 'lucide-react';

export interface ReceivingStatsRow {
  Rk: string;
  Player: string;
  Age: string;
  Team: string;
  Pos: string;
  G: string;
  GS: string;
  Tgt: string;
  Rec: string;
  Yds: string;
  'Y/R': string;
  TD: string;
  '1D': string;
  'Succ%': string;
  Lng: string;
  'R/G': string;
  'Y/G': string;
  'Ctch%': string;
  'Y/Tgt': string;
  Fmb: string;
  Awards: string;
  PlayerID?: string;
}

interface Props {
  onDataLoaded: (data: ReceivingStatsRow[]) => void;
}

export default function ReceivingStatsLoader({ onDataLoaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the CSV file from public folder
  useEffect(() => {
    loadCSVFromPublic();
  }, []);

  const loadCSVFromPublic = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try the PFF regular season receiving file
      const response = await fetch('/data/pff-nfl-regular-receiving-2024.csv');
      
      if (!response.ok) {
        // Try alternate naming conventions
        const fullResponse = await fetch('/data/nfl-receiving-2024-full.csv');
        if (fullResponse.ok) {
          const text = await fullResponse.text();
          parseCSVData(text);
        } else {
          setError('No CSV data file found. Please upload the full dataset.');
        }
        return;
      }
      
      const text = await response.text();
      parseCSVData(text);
    } catch (err) {
      setError('Failed to load CSV data');
      console.error('Error loading CSV:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseCSVData = (csvText: string) => {
    // Clean up the CSV text - remove the first header row with "Receiving" labels
    const lines = csvText.split('\n');
    
    // Check if first line contains "Receiving" - if so, skip it
    let cleanedCSV = csvText;
    if (lines[0] && lines[0].includes('Receiving')) {
      // Remove the first line and keep the rest
      cleanedCSV = lines.slice(1).join('\n');
    }
    
    // Also clean up any "-9999" or "-additional" column headers
    cleanedCSV = cleanedCSV.replace(/,-9999/g, '').replace(/,-additional/g, '');
    
    Papa.parse(cleanedCSV, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validData = results.data.filter((row: any) => {
          // Filter out invalid rows
          return row.Player && 
                 row.Player !== 'League Average' && 
                 row.Rk && 
                 !isNaN(parseInt(row.Rk)) &&
                 row.Player !== 'Player'; // In case header row gets duplicated
        });
        
        console.log(`Loaded ${validData.length} players from CSV`);
        onDataLoaded(validData as ReceivingStatsRow[]);
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
        console.error('Parse error:', error);
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSVData(text);
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-6">
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        </div>
      )}
      
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            <span>Upload Full CSV Data</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
          
          <div className="text-sm text-gray-400">
            {loading ? (
              'Loading data...'
            ) : (
              <>
                To load all players, save the complete CSV as{' '}
                <code className="bg-gray-900 px-2 py-1 rounded">
                  public/data/nfl-receiving-2024-full.csv
                </code>
                {' '}or upload it using the button
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}