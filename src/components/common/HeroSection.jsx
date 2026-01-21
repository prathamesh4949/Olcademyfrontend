import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const images = [
  "/images/baner1.jpeg",
  "/images/baner2.jpeg",
  "/images/baner3.jpeg",
  "/images/Export3.png",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    navigate('/about-page');
  };

const handleClickDiscover = () => {
    navigate('/discover-collection');
  }
  return (
    <section
      className="w-full bg-[#F9F7F6]"
      style={{ minHeight: '0' }}
    >
      {/* Unified hero with image + overlay + content */}
      <div
        className="relative w-full max-w-[1440px] mx-auto"
        style={{ height: '560px' }}
      >
        {/* Background image (carousel) */}
        <img
          src={images[currentIndex]}
          alt={`Banner ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Mild glass overlay covering the whole image */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.18)',
            backdropFilter: 'blur(6px) saturate(120%)',
            WebkitBackdropFilter: 'blur(6px) saturate(120%)'
          }}
        />

        {/* Centered content */}
        <div
          className="relative h-full flex flex-col items-center justify-center px-[64px]"
          style={{ gap: '24px' }}
        >
          <h1
            className="font-[Playfair] font-bold"
            style={{
              fontSize: '54px',
              lineHeight: '120%',
              color: '#FFFFFF',
              textAlign: 'center',
              margin: '0',
              textShadow: '0 2px 10px rgba(0,0,0,0.25)'
            }}
          >
            Crafted in Paris. Defined by You
          </h1>

          <p
            className="font-[Manrope] font-normal"
            style={{
              fontSize: '18px',
              lineHeight: '150%',
              color: '#EFE9E6',
              textAlign: 'center',
              marginTop: '0',
              marginBottom: '0',
              textShadow: '0 1px 8px rgba(0,0,0,0.25)'
            }}
          >
            A fragrance that transcends time, inspired by rare woods and eternal elegance.
          </p>

          <div
            className="flex justify-center items-center"
            style={{
              gap: '24px',
              marginTop: '24px',
              height: '47px'
            }}
          >
            <button
              onClick={handleClickDiscover}
              className="font-[Manrope] font-normal uppercase"
              style={{
                width: '243px',
                height: '47px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#431A06',
                color: '#FFFFFF',
                fontSize: '15px',
                lineHeight: '150%',
                letterSpacing: '0%',
                border: '1px solid #5E2509',
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
              DISCOVER THE COLLECTION
            </button>
            <button
              onClick={handleClick}
              className="font-[Manrope] font-normal uppercase"
              style={{
                width: '185px',
                height: '47px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(249, 247, 246, 0.6)',
                color: '#431A06',
                fontSize: '15px',
                lineHeight: '150%',
                letterSpacing: '0%',
                border: '1px solid #431A06',
                borderRadius: '0px',
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '24px',
                paddingRight: '24px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                cursor: 'pointer',
                gap: '8px',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)'
              }}
            >
              EXPLORE ABOUT US
            </button>
          </div>
        </div>
      </div>
    </section>

  );
};

export default HeroSection;
