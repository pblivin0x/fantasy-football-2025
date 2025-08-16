import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-screen w-full">
      <img 
        src="/images/header-image.jpeg" 
        alt="Fantasy Football 2025" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-5xl font-light tracking-wide text-white">2025</h1>
      </div>
    </div>
  );
};

export default HeroSection;