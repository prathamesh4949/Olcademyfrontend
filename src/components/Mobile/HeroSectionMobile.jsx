
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "/images/baner1.jpeg",
  "/images/baner2.jpeg",
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

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleShopNow = () => {
    navigate("/discover-collection");
  };

  return (
    <section className="w-full bg-[#F9F7F6] pt-16 pb-12 overflow-hidden">
      <div className="relative w-full h-[420px]">
        {/* Banner Image */}
        <img
          src={images[currentIndex]}
          alt={`VESARII Banner ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Previous"
        >
          <svg
            className="w-10 h-10 text-[#431A06]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Next"
        >
          <svg
            className="w-10 h-10 text-[#431A06]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* SHOP NOW Button (Below banner) */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleShopNow}
          className="bg-[#431A06] text-white
                     text-md uppercase tracking-widest
                     px-16 py-3"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
};

export default HeroSectionMobile;

