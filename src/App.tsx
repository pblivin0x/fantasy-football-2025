import { useEffect } from 'react';
import HeroWithOverlay from './components/HeroWithOverlay';
import FantasyProsWidget from './components/FantasyProsWidget';
import FantasyProsDataWidget from './components/FantasyProsDataWidget';

function App() {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: Epic Opening - Full screen with exciting text */}
      <section className="snap-section relative h-screen w-full bg-black">
        <HeroWithOverlay />
        
        {/* Big scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
          <div className="flex flex-col items-center gap-3">
            <p className="text-white text-lg font-medium tracking-widest uppercase animate-pulse">
              Scroll Down
            </p>
            <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* SECTION 2: The Analysis - Text + Interactive Table */}
      <section className="snap-section min-h-screen relative">
        {/* PB Livin sticky header */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-black via-gray-900/95 to-transparent backdrop-blur-sm">
          <div className="py-4 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
              <img 
                src="/images/pblivin.png" 
                alt="PB Livin" 
                className="w-12 h-12 md:w-16 md:h-16 object-contain animate-bounce-slow"
              />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="animate-glow">PB Livin</span>
                <span className="ml-2 text-2xl md:text-3xl font-light text-gray-300">Fantasy Football</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-900 via-gray-50 to-white min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-20">
            {/* Stats Table Widget */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  📊 2024 SEASON LEADERS 📊
                </h3>
                <p className="text-xl text-gray-600">Interactive stats - tap to explore</p>
              </div>
              
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <FantasyProsDataWidget />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default App;