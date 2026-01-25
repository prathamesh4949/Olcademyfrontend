import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const images = [
  "/images/baner1.jpeg",
  "/images/baner2.png",
  "/images/baner3.jpeg",
  "/images/Export3.png",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const INTERVAL_MS = 5000; // 5 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleClick = () => {
    navigate('/about-page');
  };

const handleClickDiscover = () => {
    navigate('/discover-collection');
  }
  return (
    <section
      className="w-full bg-[#F9F7F6]"
      style={{ minHeight: '0',
               width: '100%',
       }}
    >
      {/* Unified hero with image + overlay + content */}
      <div
        className="relative w-full max-w-[1728px] mx-auto"
        style={{ height: '490px',
                 width: '100%'
         }}
      >
        {/* Background image (carousel) with crossfade */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Banner ${idx + 1}`}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover',
                display: 'block',
                transition: 'opacity 900ms ease-in-out',
                opacity: currentIndex === idx ? 1 : 0
              }}
            />
          ))}
        </div>

        {/* Gradient overlay covering the whole image */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(262.47deg, rgba(0, 0, 0, 0.10) 32.56%, #000000 53.91%)',
            opacity: 0.69,
            zIndex: 1
          }}
        />

        {/* Left-aligned content */}
        <div
          className="absolute flex flex-col items-start justify-center"
          style={{ left: '63px', top: '150px', width: '640px', gap: '24px', zIndex: 2 }}
        >
          <h1
            className="font-[Playfair] font-bold"
            style={{
              fontSize: '50px',
              lineHeight: '120%',
              color: '#FFFFFF',
              textAlign: 'left',
              margin: '0'
            }}
          >
            Crafted in Paris. Defined by You
          </h1>

          <p
            className="font-[Manrope] font-normal"
            style={{
              fontSize: '18px',
              lineHeight: '150%',
              color: '#F9F7F6',
              textAlign: 'left',
              marginTop: '0',
              marginBottom: '0',
              textShadow: '0 1px 8px rgba(0,0,0,0.25)'
            }}
          >
            A fragrance that transcends time, inspired by rare woods and eternal elegance.
          </p>

          <div
            className="flex items-start"
            style={{
              gap: '12px',
              marginTop: '0',
              height: '40px'
            }}
          >
            <button
              onClick={handleClickDiscover}
              className="font-[Manrope] font-normal uppercase"
              style={{
                width: '190px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#CDAF6E',
                color: '#341405',
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0%',
                border: '1px solid #EFDB94',
                borderRadius: '0px',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '24px',
                paddingRight: '24px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                cursor: 'pointer',
                gap: '8px'
              }}
            >
              DISCOVER COLLECTIONS
            </button>
            {/* <button
              onClick={handleClick}
              className="font-[Manrope] font-normal uppercase"
              style={{
                width: '170px',
                height: '44px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent',
                color: '#F9F7F6',
                fontSize: '15px',
                lineHeight: '150%',
                letterSpacing: '0%',
                border: '1px solid #EFDB94',
                borderRadius: '0px',
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '24px',
                paddingRight: '24px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                cursor: 'pointer',
                gap: '8px'
              }}
            >
              EXPLORE ABOUT US
            </button> */}
          </div>
        </div>
      </div>
    </section>

  );
};

export default HeroSection;
