import React, { useEffect, useState } from 'react';

const HeroWithOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Hollywoo background with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src="/images/hollywoo.png" 
          alt="Hollywoo Fantasy Football" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }} />
      </div>
      
      {/* PB Livin Sonic overlay - larger and moved up */}
      <div className={`absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}>
        <img 
          src="/images/pblivin.png" 
          alt="PB Livin Sonic" 
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        />
      </div>
      
      {/* Simple text overlay */}
      <div className="absolute left-[20%] top-[10%]">
        <h1 className="text-white">
          <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Fantasy Football 2025
          </div>
          <div className="text-2xl md:text-3xl lg:text-4xl">
            PB Livin' is going 
            <span className="inline-block ml-2 animate-bounce">back to</span>
          </div>
        </h1>
      </div>
      
      {/* Minimal scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse" />
          <svg className="w-5 h-5 text-white/70 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroWithOverlay;