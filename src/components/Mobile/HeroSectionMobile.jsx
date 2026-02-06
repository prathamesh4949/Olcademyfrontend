
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "/images/baner1.jpeg",
  "/images/baner2.png",
  "/images/baner3.jpeg",
  "/images/Export3.png",
];

const HeroSectionMobile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleShopNow = () => {
    navigate("/discover-collection");
  };

  return (
    <section className="w-full bg-[#F9F7F6] relative" style={{ height: '420px' }}>
      {/* Container */}
      <div className="relative w-full h-full">
        
        {/* Background Images + Transitions */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Banner ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transition: 'opacity 900ms ease-in-out',
                opacity: currentIndex === idx ? 1 : 0
              }}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(262.47deg, rgba(0, 0, 0, 0.10) 32.56%, #000000 53.91%)',
            opacity: 0.69,
            zIndex: 1
          }}
        />

        {/* Navigation Arrows Removed */}

        {/* Content Overlay */}
        <div
          className="absolute flex flex-col justify-center items-start z-10 px-6"
          style={{ top: '50%', transform: 'translateY(-50%)', width: '100%' }}
        >
          <h1
            className="font-[Playfair] font-bold text-white mb-3"
            style={{ fontSize: '32px', lineHeight: '1.2' }}
          >
            Crafted in Paris.<br />Defined by You
          </h1>

          <p
            className="font-[Manrope] text-[#F9F7F6] mb-6"
            style={{ fontSize: '14px', lineHeight: '1.5', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            A fragrance that transcends time, inspired by rare woods and eternal elegance.
          </p>

          <button
            onClick={handleShopNow}
            className="font-[Manrope] font-normal uppercase flex items-center justify-center gap-2"
            style={{
              background: '#CDAF6E',
              color: '#341405',
              fontSize: '12px',
              padding: '10px 20px',
              border: '1px solid #EFDB94',
              letterSpacing: '0.05em'
            }}
          >
            <span>DISCOVER COLLECTIONS</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionMobile;

