import React from 'react';

const FantasyHeader: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0">
        <div className="animate-pulse absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
        <div className="text-center md:text-left mb-6 md:mb-0 flex-1">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-4 animate-bounce">
            WOAH! OKAY!
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-wider">
            YOU ARE IN THE
          </h2>
          <div className="inline-block">
            <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">
              2025 PB LIVIN
            </h3>
            <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-2xl md:text-4xl font-bold text-yellow-300 mt-4 uppercase tracking-wide animate-pulse">
            Fantasy Football Analysis
          </p>
          <div className="mt-6 flex justify-center md:justify-start space-x-4">
            <div className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white font-bold text-lg animate-bounce shadow-lg">
              ELITE STATS
            </div>
            <div className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-lg animate-bounce animation-delay-200 shadow-lg">
              BIG PLAYS
            </div>
            <div className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-full text-white font-bold text-lg animate-bounce animation-delay-400 shadow-lg">
              CHAMPIONS
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg opacity-75 blur-xl animate-pulse"></div>
          <img 
            src="/images/header-image.jpeg" 
            alt="Fantasy Football 2025" 
            className="relative z-10 rounded-lg shadow-2xl max-w-sm md:max-w-md transform hover:scale-105 transition-transform duration-300 border-4 border-yellow-400"
          />
          <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg animate-spin-slow">
            TOUCHDOWN!
          </div>
        </div>
      </div>
      
      <div className="relative z-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 p-2">
        <div className="flex justify-center space-x-8 text-black font-bold text-lg">
          <span className="animate-pulse">⚡ POWER RANKINGS</span>
          <span className="animate-pulse animation-delay-200">🏈 LIVE STATS</span>
          <span className="animate-pulse animation-delay-400">🏆 CHAMPIONSHIP MODE</span>
        </div>
      </div>
    </div>
  );
};

export default FantasyHeader;