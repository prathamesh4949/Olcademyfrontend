import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CollectionHighlight = ({ banner }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (banner?.link) navigate(banner.link);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white py-16 px-6"
    >
      <div className="flex gap-5 items-start">

        {/* LEFT — TEXT */}
        <div className="w-[65%] space-y-5">
          {banner?.subtitle && (
            <p className="text-5xl text-[#7a4a2e] font-medium mb-3">
              {banner.subtitle}
            </p>
          )}

          <h2 className="text-5xl font-dm-serif text-[#3b1a0a] leading-tight mb-4">
            {banner?.title}
            {banner?.titleHighlight && (
              <span className="block">{banner.titleHighlight}</span>
            )}
          </h2>

          {banner?.description && (
            <p className="text-lg text-[#6a3a1e] leading-relaxed mb-8">
              {banner.description}
            </p>
          )}

          {banner?.buttonText && (
            <button
              onClick={handleClick}
              className="bg-[#3b1a0a] text-white
                         px-8 py-3
                         text-sm font-semibold
                         uppercase tracking-widest
                         flex items-center gap-3
                         hover:bg-[#5a2408]
                         transition-all duration-300"
            >
              {banner.buttonText}
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
          )}
        </div>

        {/* RIGHT — IMAGE */}
        <div className="w-[65%]">
          <img
            src={banner?.image || "/images/newimg1.PNG"}
            alt={banner?.altText || banner?.title}
            className="w-full max-w-md object-contain"
            onError={(e) => {
              e.target.src = "/images/newimg1.PNG";
            }}
          />
        </div>

      </div>
    </motion.section>
  );
};

export default CollectionHighlight;
