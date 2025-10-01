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
          <source
            src="https://ombrelamar.com/wp-content/uploads/2024/12/Lamis-3840x2160-1.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <h1 className="font-[Playfair] font-bold text-[62px] leading-[120%] text-center text-white">
            Crafted in Paris. Defined by You
          </h1>

          {/* Subheading */}
          <p className="mt-6 font-[Manrope] font-normal text-[18px] leading-[150%] text-center text-white/90">
            A fragrance that transcends time, inspired by rare woods and eternal elegance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;