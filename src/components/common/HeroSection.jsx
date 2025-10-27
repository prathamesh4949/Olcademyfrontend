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

  return (
    <section
      className="flex flex-col items-center justify-center w-full min-h-screen bg-[#F9F7F6]"
      style={{ minHeight: '502px', paddingTop: '197px' }}
    >
      <div
        className="w-full max-w-[1440px] px-0 mx-auto"
        style={{ minHeight: '502px' }}
      >
        <div
          className="flex flex-col items-center justify-center w-full h-auto mx-auto bg-transparent"
          style={{
            width: '1280px',
            maxWidth: '1280px',
            paddingTop: '112px',
            paddingBottom: '112px',
            paddingLeft: '64px',
            paddingRight: '64px',
            gap: '80px'
          }}
        >
          <div
            className="flex flex-col items-center w-full"
            style={{ maxWidth: '768px', gap: '24px' }}
          >
            {/* Heading */}
            <h1
              className="font-[Playfair] font-bold"
              style={{
                fontSize: '62px',
                lineHeight: '120%',
                color: '#271004',
                textAlign: 'center',
                height: '148px',
                marginBottom: '24px'
              }}
            >
              Crafted in Paris. Defined by You
            </h1>

            {/* Subheading */}
            <p
              className="font-[Manrope] font-normal"
              style={{
                fontSize: '18px',
                lineHeight: '150%',
                color: '#431A06',
                textAlign: 'center',
                marginTop: '0',
                marginBottom: '0',
                // height: '27px',

              }}
            >
              A fragrance that transcends time, inspired by rare woods and eternal elegance.
            </p>

            {/* Buttons */}
            <div
              className="flex justify-center items-center"
              style={{
                width: '460px',
                gap: '32px',
                marginTop: '24px',
                height: '47px'
              }}
            >
              <button
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
                  background: '#F9F7F6',
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
                  gap: '8px'
                }}
              >
                EXPLORE ABOUT US
              </button>

            </div>

          </div>
        </div>

        {/* Carousel Image */}
        <div
          className="flex justify-center items-center w-full"
          style={{
            marginTop: '80px',
            paddingTop: '40px',
            paddingBottom: '40px',
            paddingLeft: '76.8px',
            paddingRight: '76.8px',
            background: '#F9F7F6',
            boxSizing: 'border-box'
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            style={{
              width: '1344px',
              height: '864px',
              objectFit: 'cover', // Use your design system's "Radius/Large" value
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              background: '#eee',
              maxWidth: '100%',
              display: 'block'
            }}
          />
        </div>
        

      </div>

    </section>

  );
};

export default HeroSection;
