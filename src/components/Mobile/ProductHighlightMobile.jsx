

import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from '../../variants';
import { useNavigate } from "react-router-dom";

const ProductHighlightMobile = ({ banner }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (banner?.link) {
      navigate(banner.link);
    }
  };

  return (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="py-10 px-4 bg-white"
    >
      <div className="max-w-md mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-dm-serif text-black uppercase tracking-wide">
            {banner.sectionTitle}
          </h2>

          <button
            onClick={handleClick}
            className="text-[#431A06] text-sm font-medium border-b border-[#431A06] pb-0.5"
          >
            {banner.viewAllText || "View All"}
          </button>
        </div>

        {/* Content Card - Vertical Stack */}
        <div className="flex flex-col gap-6">
          {/* Image */}
          <div className="w-full h-[320px] shadow-lg rounded-sm overflow-hidden">
            <img
              src={banner.image || "/images/newimg1.PNG"}
              alt={banner.altText || banner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/newimg1.PNG";
              }}
            />
          </div>

          {/* Text */}
          <div className="w-full space-y-4 text-center">
            <h3 className="text-3xl font-dm-serif text-black leading-tight">
              {banner.title}
            </h3>

            {banner.description && (
              <p className="text-base text-[#5a2408] leading-relaxed">
                {banner.description}
              </p>
            )}

            <div className="flex justify-center pt-2">
              <button
                onClick={handleClick}
                className="bg-[#431A06] text-white
                           px-6 py-3 text-sm font-semibold
                           uppercase tracking-widest
                           flex items-center gap-2
                           shadow-md active:scale-95 transition-all"
              >
                <span>{banner.buttonText || "Explore"}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductHighlightMobile;
