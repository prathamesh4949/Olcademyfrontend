import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';

const Notification = ({ show, message, type = 'cart', onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 right-8 z-[10070] pointer-events-auto"
          style={{
            backgroundColor: '#F9F7F6',
            border: '1px solid #B59B8E',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            borderRadius: '0px',
            minWidth: '320px',
            maxWidth: '400px'
          }}
        >
          <div className="p-4 flex items-start gap-3">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#5a2408' }}
            >
              {type === 'cart' ? (
                <FiShoppingCart size={20} className="text-white" />
              ) : (
                <FiCheck size={20} className="text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 
                className="font-semibold text-[15px] mb-1"
                style={{ color: '#341405' }}
              >
                {type === 'cart' ? 'Added to Cart' : 'Success'}
              </h3>
              <p 
                className="text-[14px]"
                style={{ color: '#5a2408' }}
              >
                {message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 text-[#341405] hover:text-[#5a2408] transition-colors"
              aria-label="Close notification"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;