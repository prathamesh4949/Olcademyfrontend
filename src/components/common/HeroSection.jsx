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

      {/* Content overlay */}
      <div className="relative z-10 py-16 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-[40px] md:text-[60px] font-joan text-white leading-[52px] md:leading-[78px] mb-4 drop-shadow-lg">
                VESARII
              </h1>
              <p className="text-[18px] md:text-[25px] font-joan text-white leading-[24px] md:leading-[32px] mb-8 max-w-[351px] mx-auto lg:mx-0 drop-shadow-md">
                Oloréve crafts luxury fragrances that capture the essence of elegance and sustainability.
              </p>
              <Button variant="secondary">
                <a href="/all-fragrances">Discover More</a>
              </Button>
            </div>
            
            {/* Center image */}
            <div className="flex-1 flex justify-center order-first lg:order-none">
              <img 
                src="/images/img_image.png" 
                alt="Vesarii fragrance bottle" 
                className="w-[300px] h-[300px] md:w-[483px] md:h-[474px] rounded-full object-cover shadow-2xl border-4 border-white border-opacity-20"
              />
            </div>
            
            {/* Right content */}
            <div className="flex-1 text-center lg:text-right">
              <h2 className="text-[24px] md:text-[30px] font-joan text-white leading-[30px] md:leading-[38px] mb-4 max-w-[406px] mx-auto lg:ml-auto lg:mr-0 drop-shadow-lg">
                Discover the Fragrance of Elegance
              </h2>
              <p className="text-[16px] md:text-[20px] font-dm-sans text-white leading-[22px] md:leading-[26px] max-w-[327px] mx-auto lg:ml-auto lg:mr-0 drop-shadow-md">
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender, smoked cedar, and a whisper of fire-kissed amber. Designed to enchant from the very first breath.
              </p>
              <Button variant="secondary" className="mt-8">
                <a href="/product-cart">Shop Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;