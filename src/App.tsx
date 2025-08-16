import React from 'react';
import DataDashboard from './components/DataDashboard';
import { Database } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-slate-900 text-white">
      <div className="max-w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl font-bold">
              Fantasy Football 2025 Analysis
            </h1>
          </div>
          <p className="text-lg text-gray-300 mb-2">
            Comprehensive NFL Statistics Database (2022-2024)
          </p>
          <p className="text-sm text-gray-400">
            Data provided by Pro Football Focus (PFF)
          </p>
        </div>
        
        {/* Main Dashboard */}
        <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm">
          <DataDashboard />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>All statistics sourced from Pro Football Focus (PFF)</p>
          <p>Regular Season & Playoff Data | 2022-2024 Seasons</p>
        </div>
      </div>
    </div>
  );
}

export default App;