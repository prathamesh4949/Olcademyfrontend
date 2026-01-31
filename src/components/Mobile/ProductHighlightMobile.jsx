

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
      className="py-8 px-4 bg-white"
    >
      <div className="max-w-md mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-dm-serif text-black">
            {banner.sectionTitle}
          </h2>

          <button
            onClick={handleClick}
            className="border border-[#431A06] text-[#431A06]
                       px-3 py-2 text-xl font-medium
                       hover:bg-[#431A06] hover:text-white
                       transition-all duration-300 rounded-md"
          >
            {banner.viewAllText || "View All"}
          </button>
        </div>

        {/* Content Card */}
        <div className="flex gap-5 items-start">
          {/* Image */}
          <div className="w-[50%] h-[300px] flex-shrink-0">
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
          <div className="w-[65%] space-y-5">
            <h3 className="text-5xl font-dm-serif text-black leading-snug">
              {banner.title}
            </h3>

            {banner.description && (
              <p className="text-lg text-[#5a2408] leading-relaxed">
                {banner.description}
              </p>
            )}

            <button
              onClick={handleClick}
              className="mt-2 bg-[#431A06] text-white
                         px-4 py-2 text-md font-semibold
                         uppercase tracking-wide
                         flex items-center gap-2
                         hover:bg-[#5a2408]
                         transition-all duration-300"
            >
              <span>{banner.buttonText || "View All"}</span>
              <svg
                className="w-3.5 h-3.5"
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
    </motion.section>
  );
};

export default ProductHighlightMobile;
