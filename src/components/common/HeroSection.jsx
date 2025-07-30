import React from 'react';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="https://ombrelamar.com/wp-content/uploads/2024/12/Lamis-3840x2160-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content overlay (now empty) */}
      <div className="relative z-10 py-16 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* No text content */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;