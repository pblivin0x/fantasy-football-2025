import Papa from 'papaparse';

export type StatType = 'receiving' | 'passing' | 'rushing';
export type SeasonType = 'regular' | 'playoff';
export type Year = '2022' | '2023' | '2024';

export interface DataFile {
  statType: StatType;
  seasonType: SeasonType;
  year: Year;
  fileName: string;
  displayName: string;
}

export const availableDataFiles: DataFile[] = [
  // Receiving Data
  { statType: 'receiving', seasonType: 'regular', year: '2024', fileName: 'pff-nfl-regular-receiving-2024.csv', displayName: '2024 Regular Season Receiving' },
  { statType: 'receiving', seasonType: 'regular', year: '2023', fileName: 'pff-nfl-regular-receiving-2023.csv', displayName: '2023 Regular Season Receiving' },
  { statType: 'receiving', seasonType: 'regular', year: '2022', fileName: 'pff-nfl-regular-receiving-2022.csv', displayName: '2022 Regular Season Receiving' },
  { statType: 'receiving', seasonType: 'playoff', year: '2024', fileName: 'pff-nfl-playoff-receiving-2024.csv', displayName: '2024 Playoff Receiving' },
  { statType: 'receiving', seasonType: 'playoff', year: '2023', fileName: 'pff-nfl-playoff-receiving-2023.csv', displayName: '2023 Playoff Receiving' },
  { statType: 'receiving', seasonType: 'playoff', year: '2022', fileName: 'pff-nfl-playoff-receiving-2022.csv', displayName: '2022 Playoff Receiving' },
  
  // Passing Data
  { statType: 'passing', seasonType: 'regular', year: '2024', fileName: 'pff-nfl-regular-passing-2024.csv', displayName: '2024 Regular Season Passing' },
  { statType: 'passing', seasonType: 'regular', year: '2023', fileName: 'pff-nfl-regular-passing-2023.csv', displayName: '2023 Regular Season Passing' },
  { statType: 'passing', seasonType: 'regular', year: '2022', fileName: 'pff-nfl-regular-passing-2022.csv', displayName: '2022 Regular Season Passing' },
  { statType: 'passing', seasonType: 'playoff', year: '2024', fileName: 'pff-nfl-playoff-passing-2024.csv', displayName: '2024 Playoff Passing' },
  { statType: 'passing', seasonType: 'playoff', year: '2023', fileName: 'pff-nfl-playoff-passing-2023.csv', displayName: '2023 Playoff Passing' },
  { statType: 'passing', seasonType: 'playoff', year: '2022', fileName: 'pff-nfl-playoff-passing-2022.csv', displayName: '2022 Playoff Passing' },
  
  // Rushing Data
  { statType: 'rushing', seasonType: 'regular', year: '2024', fileName: 'pff-nfl-regular-rushing-2024.csv', displayName: '2024 Regular Season Rushing' },
  { statType: 'rushing', seasonType: 'regular', year: '2023', fileName: 'pff-nfl-regular-rushing-2023.csv', displayName: '2023 Regular Season Rushing' },
  { statType: 'rushing', seasonType: 'regular', year: '2022', fileName: 'pff-nfl-regular-rushing-2022.csv', displayName: '2022 Regular Season Rushing' },
  { statType: 'rushing', seasonType: 'playoff', year: '2024', fileName: 'pff-nfl-playoff-rushing-2024.csv', displayName: '2024 Playoff Rushing' },
  { statType: 'rushing', seasonType: 'playoff', year: '2023', fileName: 'pff-nfl-playoff-rushing-2023.csv', displayName: '2023 Playoff Rushing' },
  { statType: 'rushing', seasonType: 'playoff', year: '2022', fileName: 'pff-nfl-playoff-rushing-2022.csv', displayName: '2022 Playoff Rushing' },
];

export async function loadCSVData(fileName: string): Promise<any[]> {
  try {
    const response = await fetch(`/data/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}`);
    }
    
    const text = await response.text();
    
    // Clean up the CSV text
    const lines = text.split('\n');
    let cleanedLines = [...lines];
    
    // Remove citation line if present (e.g., "--- When using SR data...")
    if (cleanedLines[0] && cleanedLines[0].includes('When using SR data')) {
      cleanedLines = cleanedLines.slice(1);
    }
    
    // Remove empty lines at the start
    while (cleanedLines.length > 0 && cleanedLines[0].trim() === '') {
      cleanedLines = cleanedLines.slice(1);
    }
    
    // Check if first line contains "Receiving", "Passing", or "Rushing" - if so, skip it
    if (cleanedLines[0] && (cleanedLines[0].includes('Receiving') || cleanedLines[0].includes('Passing') || cleanedLines[0].includes('Rushing'))) {
      cleanedLines = cleanedLines.slice(1);
    }
    
    let cleanedCSV = cleanedLines.join('\n');
    
    // Clean up any "-9999" or "-additional" column headers
    cleanedCSV = cleanedCSV.replace(/,-9999/g, '')
                           .replace(/,-additional/g, '')
                           .replace(/,Player-additional/g, '');
    
    return new Promise((resolve, reject) => {
      Papa.parse(cleanedCSV, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter((row: any) => {
            return row.Player && 
                   row.Player !== 'League Average' && 
                   row.Rk && 
                   !isNaN(parseInt(row.Rk)) &&
                   row.Player !== 'Player';
          });
          resolve(validData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    throw error;
  }
}

export function getColumnsByStatType(statType: StatType): Array<{key: string, label: string, type: 'string' | 'number'}> {
  switch (statType) {
    case 'receiving':
      return [
        { key: 'Rk', label: 'Rk', type: 'number' },
        { key: 'Player', label: 'Player', type: 'string' },
        { key: 'Team', label: 'Team', type: 'string' },
        { key: 'Pos', label: 'Pos', type: 'string' },
        { key: 'Age', label: 'Age', type: 'number' },
        { key: 'G', label: 'G', type: 'number' },
        { key: 'Tgt', label: 'Tgt', type: 'number' },
        { key: 'Rec', label: 'Rec', type: 'number' },
        { key: 'Yds', label: 'Yds', type: 'number' },
        { key: 'Y/R', label: 'Y/R', type: 'number' },
        { key: 'TD', label: 'TD', type: 'number' },
        { key: '1D', label: '1D', type: 'number' },
        { key: 'Ctch%', label: 'Ctch%', type: 'number' },
        { key: 'Y/G', label: 'Y/G', type: 'number' },
        { key: 'Y/Tgt', label: 'Y/Tgt', type: 'number' },
      ];
    case 'passing':
      return [
        { key: 'Rk', label: 'Rk', type: 'number' },
        { key: 'Player', label: 'Player', type: 'string' },
        { key: 'Team', label: 'Team', type: 'string' },
        { key: 'Age', label: 'Age', type: 'number' },
        { key: 'G', label: 'G', type: 'number' },
        { key: 'GS', label: 'GS', type: 'number' },
        { key: 'Cmp', label: 'Cmp', type: 'number' },
        { key: 'Att', label: 'Att', type: 'number' },
        { key: 'Cmp%', label: 'Cmp%', type: 'number' },
        { key: 'Yds', label: 'Yds', type: 'number' },
        { key: 'TD', label: 'TD', type: 'number' },
        { key: 'Int', label: 'Int', type: 'number' },
        { key: 'Y/A', label: 'Y/A', type: 'number' },
        { key: 'Y/G', label: 'Y/G', type: 'number' },
        { key: 'Rate', label: 'Rate', type: 'number' },
        { key: 'QBR', label: 'QBR', type: 'number' },
      ];
    case 'rushing':
      return [
        { key: 'Rk', label: 'Rk', type: 'number' },
        { key: 'Player', label: 'Player', type: 'string' },
        { key: 'Team', label: 'Team', type: 'string' },
        { key: 'Pos', label: 'Pos', type: 'string' },
        { key: 'Age', label: 'Age', type: 'number' },
        { key: 'G', label: 'G', type: 'number' },
        { key: 'Att', label: 'Att', type: 'number' },
        { key: 'Yds', label: 'Yds', type: 'number' },
        { key: 'TD', label: 'TD', type: 'number' },
        { key: '1D', label: '1D', type: 'number' },
        { key: 'Lng', label: 'Lng', type: 'number' },
        { key: 'Y/A', label: 'Y/A', type: 'number' },
        { key: 'Y/G', label: 'Y/G', type: 'number' },
        { key: 'Fmb', label: 'Fmb', type: 'number' },
      ];
  }
}