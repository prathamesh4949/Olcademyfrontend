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
      className="bg-white py-12 px-4"
    >
      {/* Reverse column order: Image on top (Dom order 2), Text on bottom (Dom order 1) */}
      <div className="flex flex-col-reverse gap-8 items-center max-w-md mx-auto">

        {/* BOTTOM: TEXT */}
        <div className="w-full space-y-4 text-center">
          {banner?.subtitle && (
            <p className="text-sm tracking-widest text-[#7a4a2e] font-bold uppercase mb-2">
              {banner.subtitle}
            </p>
          )}

          <h2 className="text-3xl font-dm-serif text-[#3b1a0a] leading-tight mb-3">
            {banner?.title}
            {banner?.titleHighlight && (
              <span className="block text-[#79300f] mt-1">{banner.titleHighlight}</span>
            )}
          </h2>

          {banner?.description && (
            <p className="text-base text-[#6a3a1e] leading-relaxed mb-6">
              {banner.description}
            </p>
          )}

          {banner?.buttonText && (
            <div className="flex justify-center">
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
            </div>
          )}
        </div>

        {/* TOP: IMAGE */}
        <div className="w-full">
          <img
            src={banner?.image || "/images/newimg1.PNG"}
            alt={banner?.altText || banner?.title}
            className="w-full h-[350px] object-cover shadow-lg rounded-sm"
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
