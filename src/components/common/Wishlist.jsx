import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useWishlist } from '@/WishlistContext';
import { useCart } from '@/CartContext';
import { FiHeart, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: '', label: 'Sort by' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'rating-asc', label: 'Rating: Low to High' },
];

const Wishlist = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { wishlistItems, removeFromWishlist, isInitialized, refreshWishlist } = useWishlist();
  const { isInCart, addToCart } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) setDarkMode(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (isInitialized && wishlistItems.length > 0) refreshWishlist();
  }, [isInitialized]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleProductClick = (item) => {
    if (!item || !item.id) return;
    if (
      item.source === 'scent' ||
      ['trending', 'best-seller', 'signature', 'limited-edition'].includes(item.collection)
    ) {
      navigate(`/scent/${item.id}`);
    } else if (item.source === 'product') {
      navigate(`/product/${item.id}`);
    } else {
      if (item.scentFamily || item.intensity || item.concentration || item.brand) {
        navigate(`/scent/${item.id}`);
      } else {
        navigate(`/product/${item.id}`);
      }
    }
  };

  const handleAddToCart = async (item) => {
    if (isInCart(item.id, item.selectedSize)) return;
    try {
      await addToCart(item);
      toast.success(`${item.name} added to cart`, { id: `cart-${item.id}` });
    } catch (err) {
      toast.error(`Failed to add ${item.name} to cart`, { id: `cart-error-${item.id}` });
    }
  };

  const handleRemoveFromWishlist = (item) => {
    removeFromWishlist(item.id);
    toast(`${item.name} removed from wishlist`, { id: `wishlist-${item.id}` });
  };

  const handleContinueShopping = () => navigate('/');

  let filteredItems = wishlistItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === 'price-asc') {
    filteredItems = filteredItems.slice().sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'price-desc') {
    filteredItems = filteredItems.slice().sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === 'rating-desc') {
    filteredItems = filteredItems.slice().sort((a, b) =>
      Number(b.rating || 0) < Number(a.rating || 0) ? 1 : -1
    );
  } else if (sortBy === 'rating-asc') {
    filteredItems = filteredItems.slice().sort((a, b) =>
      Number(a.rating || 0) - Number(b.rating || 0)
    );
  }

  if (!isInitialized) {
    return (
      <div className="bg-[#faf6f2] font-sans min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex items-center justify-center py-24 text-[#5A2408] text-xl font-medium">
          Loading wishlist...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-[#FAF6F2] font-sans min-h-screen flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-[1616px] w-full mx-auto text-center pt-12">
        <h2 className="text-[36px] font-playfair font-semibold tracking-[2px] uppercase text-[#5A2408] mb-10">
          User’s Wishlist
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center mb-12 gap-4 px-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[48px] w-full sm:w-[60%] md:w-[600px] bg-transparent border border-[#5A2408] rounded font-manrope font-medium text-[#5A2408] text-[16px] px-4 placeholder-[#5A2408] focus:outline-none"
          />

          <div
            className="relative w-full sm:w-[30%] md:w-[200px] select-none"
            ref={dropdownRef}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center justify-between w-full h-[48px] px-3 border border-[#5A2408] rounded-sm font-manrope font-medium text-[#5A2408] text-[16px] bg-[#FAF6F2] transition duration-200 ease-in-out focus:outline-none"
            >
              {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Sort by'}
              <svg
                className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke="#5A2408"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 shadow-lg border border-t-0 border-[#5A2408] rounded-b-lg bg-[#FAF6F2] overflow-hidden z-10 max-h-50 ">
                {SORT_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`px-2 py-3 cursor-pointer font-manrope text-[14px] text-[#5A2408] transition-colors duration-200
                      hover:bg-[#fcf1e7] ${
                        sortBy === opt.value ? 'bg-[#ecdecb]' : ''
                      }`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex-grow px-4">
        {!filteredItems.length ? (
          <div className="text-center py-24">
            <FiHeart className="mx-auto h-20 w-20 text-[#D7C9B7]" />
            <p className="text-[24px] font-semibold font-playfair text-[#5A2408] uppercase mt-4 mb-2">
              Nothing in Wishlist
            </p>
            <p className="text-[#5A2408] font-medium font-manrope text-[17px] mb-6">
              Start adding products you love to your wishlist!
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#5A2408] hover:bg-[#3B1505] text-white uppercase text-[15px] font-bold font-manrope px-8 py-3 rounded transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-x-8 gap-y-12 mb-16">
            {filteredItems.map((item) => (
              <motion.div
                key={`${item.id}-${item.selectedSize || 'default'}`}
                className="relative bg-white border border-[#E5E1DD] rounded-lg flex flex-col justify-between shadow-sm pt-6 pb-0 w-[300px] min-h-[460px] transition duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                  className="absolute top-4 right-5 text-[#5A2408] hover:text-[#B04C3C] bg-transparent focus:outline-none"
                  title="Remove from wishlist"
                >
                  <FiX size={22} />
                </button>

                <div className="flex flex-col items-center px-5 flex-grow">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain w-[190px] h-[190px] mb-5 cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  />
                  <h3
                    onClick={() => handleProductClick(item)}
                    className="text-center font-playfair font-semibold text-[#5A2408] uppercase text-[17px] leading-snug tracking-wide cursor-pointer px-2 mb-2"
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < (item.rating || 5)
                            ? 'text-[#5A2408]'
                            : 'text-[#E5E1DD]'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <polygon points="10,1 12.5,7.5 19,8 14,12 15.5,18 10,14.5 4.5,18 6,12 1,8 7.5,7.5" />
                      </svg>
                    ))}
                  </div>
                  {item.description && (
                    <p className="text-center text-[#5A2408] font-manrope text-[13px] px-3 mb-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <p className="text-[#5A2408] text-[16px] font-bold font-manrope mb-1">
                    ₹{item.price}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={isInCart(item.id, item.selectedSize)}
                  className={`w-full h-[48px] bg-[#431A06] hover:bg-[#3B1505] uppercase text-white text-[14px] font-semibold font-manrope rounded-b-lg transition
                    ${
                      isInCart(item.id, item.selectedSize)
                        ? 'opacity-60 cursor-not-allowed'
                        : ''
                    }`}
                >
                  {isInCart(item.id, item.selectedSize)
                    ? 'Already In Cart'
                    : 'Add to Cart'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </motion.div>
  );
};

export default Wishlist;

