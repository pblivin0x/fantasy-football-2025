import React from 'react';
import ReceivingStatsTable from './components/ReceivingStatsTable';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-slate-900 text-white p-4">
      <div className="max-w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Fantasy Football 2025 Analysis
          </h1>
          <p className="text-center text-lg text-gray-300">
            2024 NFL Receiving Statistics with Advanced Metrics
          </p>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-6">2024 NFL Receiving Leaders</h2>
          <ReceivingStatsTable />
        </div>
      </div>
    </div>
  );
}

export default App;