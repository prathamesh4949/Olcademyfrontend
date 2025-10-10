import React, { useState, useEffect, useContext } from 'react';
import { FiMenu, FiSearch, FiX, FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SignupModal from './SignupModal';
import { motion, AnimatePresence } from 'framer-motion';
import VerifyEmail from './VerifyEmail';
import Login from './Login';
import Footer from './Footer';
import ProductCartSection from '@/pages/ProductCartSection';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const navItems = [
  {
    label: 'HOME',
    path: '/',
    items: [
      'Petal Whisper',
      'Bloomé Dusk',
      'Rose Alchemy',
      'Lush Reverie',
      'Moonlit Peony',
      'Jardin de Minuit',
      'Blush Mirage',
      'Secret Gardenia',
    ],
  },
  {
    label: "MEN'S SCENTS",
    path: '/mens-collection',
    items: ['Petal Whisper', 'Bloomé Dusk', 'Rose Alchemy', 'Lush Reverie'],
  },
  {
    label: "WOMEN'S SCENTS",
    path: '/womens-collection',
    items: ['Petal Whisper', 'Bloomé Dusk', 'Rose Alchemy', 'Lush Reverie', 'Moonlit Peony'],
  },
  {
    label: 'UNISEX SCENTS',
    path: '/unisex-collection',
    items: ['Petal Whisper', 'Bloomé Dusk', 'Rose Alchemy', 'Lush Reverie'],
  },
  {
    label: 'GIFTS',
    path: '/gift-collection',
    items: ['Petal Whisper', 'Bloomé Dusk', 'Rose Alchemy'],
  },
];

const Header = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Smart scroll behavior states
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  // State to control cart visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Open the cart overlay
  const openCart = () => {
    setIsCartOpen(true);
  };

  // Close the cart overlay
  const closeCart = () => {
    setIsCartOpen(false);
  };

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Smart scroll behavior effect
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
      const scrollThreshold = 5;
      const topThreshold = 80;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (currentScrollPos <= topThreshold) {
        setIsVisible(true);
        setPrevScrollPos(currentScrollPos);
        setScrollDirection('up');
        return;
      }

      const scrollDifference = Math.abs(currentScrollPos - prevScrollPos);

      if (scrollDifference > scrollThreshold) {
        const isScrollingDown = currentScrollPos > prevScrollPos;

        if (isScrollingDown && currentScrollPos > 100) {
          setScrollDirection('down');
          setIsVisible(false);
        } else if (!isScrollingDown) {
          setScrollDirection('up');
          setIsVisible(true);
        }

        setPrevScrollPos(currentScrollPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [prevScrollPos]);

  // Force navbar to show when search is open or menu is open
  useEffect(() => {
    if (searchOpen || menuOpen || isUserDropdownOpen || hoveredIndex !== null) {
      setIsVisible(true);
    }
  }, [searchOpen, menuOpen, isUserDropdownOpen, hoveredIndex]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Check if current path matches nav item path
  const isActiveNavItem = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Header with exact dimensions and styling as specified */}
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: isVisible ? 0 : '-100%',
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="fixed top-0 w-full z-50"
        style={{
          width: '1728px',
          height: '197px',
          backgroundColor: '#F9F7F6',
          border: '1px solid #B59B8E',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maxWidth: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* First Layer - Logo Only (Centered) */}
        <div
          className="absolute flex justify-center items-center"
          style={{
            width: '80px',
            height: '80px',
            top: '20px',
            left: '824px',
          }}
        >
          <Link to="/" className="flex items-center justify-center">
            <img
              src="/images/Logo.png"
              alt="Logo"
              style={{
                width: '120px',
                height: '60px',
                objectFit: 'contain',
              }}
            />
          </Link>
        </div>

        {/* Second Layer - Search Left, Icons Right */}
        <div
          className="absolute flex justify-between items-center"
          style={{
            width: '1624px',
            height: '34px',
            top: '86px',
            left: '52px',
          }}
        >
          {/* Left Section - Search */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="text-2xl z-50 md:hidden focus:outline-none mr-4"
            >
              {menuOpen ? (
                <FiX style={{ color: '#341405' }} />
              ) : (
                <FiMenu style={{ color: '#341405' }} />
              )}
            </button>

            <button
              onClick={toggleSearch}
              className="flex items-center transition duration-200"
              style={{
                width: '34px',
                height: '34px',
                color: '#341405',
              }}
            >
              <FiSearch size={34} />
            </button>
          </div>

          {/* Right Icons */}
          <div
            className="flex items-center z-50"
            style={{
              width: '162px',
              height: '34px',
              gap: '32px',
            }}
          >
            {/* Wishlist Icon */}
            <Link
              to="/wishlist-collection"
              style={{
                width: '34px',
                height: '34px',
                color: '#341405',
              }}
            >
              <FiHeart size={34} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              style={{
                width: '34px',
                height: '34px',
                color: '#341405',
              }}
              aria-label="Open cart"
            >
              <FiShoppingCart size={34} />
            </button>

            {/* User Section */}
            {user ? (
              <div className="relative flex items-center">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center focus:outline-none"
                  style={{
                    width: '34px',
                    height: '34px',
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: '34px',
                      height: '34px',
                      backgroundColor: '#341405',
                    }}
                  >
                    <span
                      style={{
                        color: '#F9F7F6',
                        fontSize: '16px',
                        fontWeight: '500',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      {user.username
                        ? user.username.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 shadow-lg rounded-lg z-50"
                      style={{
                        backgroundColor: '#F9F7F6',
                        color: '#341405',
                        padding: '16px',
                        width: '200px',
                        border: '1px solid #B59B8E',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      <Link
                        to="/orders"
                        className="block py-2 hover:opacity-70 transition duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#341405',
                        }}
                      >
                        My Orders
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left py-2 hover:opacity-70 transition-colors"
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#341405',
                        }}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsSignupOpen(true)}
                style={{
                  width: '34px',
                  height: '34px',
                  color: '#341405',
                }}
              >
                <FiUser size={34} />
              </button>
            )}
          </div>
        </div>

        {/* Third Layer - Navigation Bar */}
        <div
          className="absolute hidden md:flex items-center"
          style={{
            width: '1117px',
            height: '60px',
            top: '116px',
            left: '321px',
            gap: '0px',
          }}
        >
          {/* HOME */}
          <div
            className="relative group flex items-center justify-center"
            style={{
              width: '142px',
              height: '60px',
              paddingTop: '12px',
              paddingRight: '32px',
              paddingBottom: '12px',
              paddingLeft: '32px',
              borderBottom: isActiveNavItem('/') ? '1px solid #341405' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to="/"
              style={{
                width: '78px',
                height: '36px',
                fontFamily: 'Manrope',
                fontWeight: '400',
                fontSize: '26px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textTransform: 'uppercase',
                color: '#341405',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              HOME
            </Link>
          </div>

          {/* MEN'S SCENTS */}
          <div
            className="relative group flex items-center justify-center"
            style={{
              width: '259px',
              height: '60px',
              paddingTop: '12px',
              paddingRight: '32px',
              paddingBottom: '12px',
              paddingLeft: '32px',
              borderBottom: isActiveNavItem('/mens-collection') ? '1px solid #341405' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to="/mens-collection"
              style={{
                width: '195px',
                height: '36px',
                fontFamily: 'Manrope',
                fontWeight: '400',
                fontSize: '26px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textTransform: 'uppercase',
                color: '#341405',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              MEN'S SCENTS
            </Link>

            {/* Dropdown for Men's Scents */}
            <AnimatePresence>
              {hoveredIndex === 1 && navItems[1].items && navItems[1].items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-4 shadow-lg rounded-lg z-50 grid grid-cols-5 gap-6"
                  style={{
                    backgroundColor: '#F9F7F6',
                    color: '#341405',
                    padding: '24px',
                    width: '800px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '1px solid #B59B8E',
                    fontFamily: 'Manrope, sans-serif',
                  }}
                  onMouseEnter={() => setHoveredIndex(1)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="col-span-4 grid grid-cols-4 gap-4">
                    {navItems[1].items.map((item, i) => (
                      <Link
                        key={i}
                        to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="hover:opacity-70 transition duration-200"
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#341405',
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <img
                      src="/images/amberNocturne3.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                    <img
                      src="/images/Rectangle 60.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WOMEN'S SCENTS */}
          <div
            className="relative group flex items-center justify-center"
            style={{
              width: '304px',
              height: '60px',
              paddingTop: '12px',
              paddingRight: '32px',
              paddingBottom: '12px',
              paddingLeft: '32px',
              borderBottom: isActiveNavItem('/womens-collection') ? '1px solid #341405' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to="/womens-collection"
              style={{
                width: '240px',
                height: '36px',
                fontFamily: 'Manrope',
                fontWeight: '400',
                fontSize: '26px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textTransform: 'uppercase',
                color: '#341405',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              WOMEN'S SCENTS
            </Link>

            {/* Dropdown for Women's Scents */}
            <AnimatePresence>
              {hoveredIndex === 2 && navItems[2].items && navItems[2].items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-4 shadow-lg rounded-lg z-50 grid grid-cols-5 gap-6"
                  style={{
                    backgroundColor: '#F9F7F6',
                    color: '#341405',
                    padding: '24px',
                    width: '800px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '1px solid #B59B8E',
                    fontFamily: 'Manrope, sans-serif',
                  }}
                  onMouseEnter={() => setHoveredIndex(2)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="col-span-4 grid grid-cols-4 gap-4">
                    {navItems[2].items.map((item, i) => (
                      <Link
                        key={i}
                        to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="hover:opacity-70 transition duration-200"
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#341405',
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <img
                      src="/images/amberNocturne3.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                    <img
                      src="/images/Rectangle 60.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* UNISEX SCENTS */}
          <div
            className="relative group flex items-center justify-center"
            style={{
              width: '273px',
              height: '60px',
              paddingTop: '12px',
              paddingRight: '32px',
              paddingBottom: '12px',
              paddingLeft: '32px',
              borderBottom: isActiveNavItem('/unisex-collection') ? '1px solid #341405' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to="/unisex-collection"
              style={{
                width: '209px',
                height: '36px',
                fontFamily: 'Manrope',
                fontWeight: '400',
                fontSize: '26px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textTransform: 'uppercase',
                color: '#341405',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              UNISEX SCENTS
            </Link>

            {/* Dropdown for Unisex Scents */}
            <AnimatePresence>
              {hoveredIndex === 3 && navItems[3].items && navItems[3].items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-4 shadow-lg rounded-lg z-50 grid grid-cols-5 gap-6"
                  style={{
                    backgroundColor: '#F9F7F6',
                    color: '#341405',
                    padding: '24px',
                    width: '800px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '1px solid #B59B8E',
                    fontFamily: 'Manrope, sans-serif',
                  }}
                  onMouseEnter={() => setHoveredIndex(3)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="col-span-4 grid grid-cols-4 gap-4">
                    {navItems[3].items.map((item, i) => (
                      <Link
                        key={i}
                        to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="hover:opacity-70 transition duration-200"
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#341405',
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <img
                      src="/images/amberNocturne3.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                    <img
                      src="/images/Rectangle 60.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* GIFTS */}
          <div
            className="relative group flex items-center justify-center"
            style={{
              width: '139px',
              height: '60px',
              paddingTop: '12px',
              paddingRight: '32px',
              paddingBottom: '12px',
              paddingLeft: '32px',
              borderBottom: isActiveNavItem('/gift-collection') ? '1px solid #341405' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to="/gift-collection"
              style={{
                width: '75px',
                height: '36px',
                fontFamily: 'Manrope',
                fontWeight: '400',
                fontSize: '26px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textTransform: 'uppercase',
                color: '#341405',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              GIFTS
            </Link>

            {/* Dropdown for Gifts */}
            <AnimatePresence>
              {hoveredIndex === 4 && navItems[4].items && navItems[4].items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-4 shadow-lg rounded-lg z-50 grid grid-cols-5 gap-6"
                  style={{
                    backgroundColor: '#F9F7F6',
                    color: '#341405',
                    padding: '24px',
                    width: '800px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '1px solid #B59B8E',
                    fontFamily: 'Manrope, sans-serif',
                  }}
                  onMouseEnter={() => setHoveredIndex(4)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="col-span-4 grid grid-cols-4 gap-4">
                    {navItems[4].items.map((item, i) => (
                      <Link
                        key={i}
                        to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="hover:opacity-70 transition duration-200"
                        style={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: '#341405',
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <img
                      src="/images/amberNocturne3.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                    <img
                      src="/images/Rectangle 60.png"
                      alt="sample"
                      className="w-full h-[100px] object-cover rounded"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 shadow-lg z-40"
              style={{
                backgroundColor: '#F9F7F6',
                borderTop: '1px solid #B59B8E',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                <form onSubmit={handleSearchSubmit} className="flex gap-4">
                  <div className="flex-1 relative">
                    <FiSearch
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#341405' }}
                      size={20}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search for perfumes, collections, or scents..."
                      className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: '#F9F7F6',
                        color: '#341405',
                        borderColor: '#B59B8E',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: '#341405',
                      color: '#F9F7F6',
                      fontFamily: 'Manrope, sans-serif',
                    }}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="px-4 py-4 rounded-xl transition-colors"
                    style={{ color: '#341405' }}
                  >
                    <FiX size={24} />
                  </button>
                </form>

                {/* Search Suggestions */}
                <div className="mt-6">
                  <p
                    className="text-sm mb-3"
                    style={{ color: '#341405', fontFamily: 'Manrope, sans-serif' }}
                  >
                    Popular Searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Aventus',
                      'Rose Elegance',
                      'Midnight Steel',
                      'Golden Orchid',
                      'Cosmic Harmony',
                      'Royal Oud',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="px-3 py-2 rounded-full text-sm transition-colors"
                        style={{
                          backgroundColor: 'rgba(52, 20, 5, 0.1)',
                          color: '#341405',
                          fontFamily: 'Manrope, sans-serif',
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/mens-collection"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl hover:shadow-md transition-all duration-200"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(52, 20, 5, 0.1), rgba(52, 20, 5, 0.05))',
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#341405',
                      }}
                    >
                      <span
                        style={{
                          color: '#F9F7F6',
                          fontWeight: '500',
                          fontFamily: 'Manrope, sans-serif',
                        }}
                      >
                        M
                      </span>
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <h4 style={{ fontWeight: '500', color: '#341405' }}>Men's Collection</h4>
                      <p style={{ fontSize: '14px', fontWeight: '400', color: '#341405' }}>
                        Sophisticated masculine scents
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/womens-collection"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl hover:shadow-md transition-all duration-200"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(52, 20, 5, 0.05), rgba(52, 20, 5, 0.1))',
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#341405',
                      }}
                    >
                      <span
                        style={{
                          color: '#F9F7F6',
                          fontWeight: '500',
                          fontFamily: 'Manrope, sans-serif',
                        }}
                      >
                        W
                      </span>
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <h4 style={{ fontWeight: '500', color: '#341405' }}>Women's Collection</h4>
                      <p style={{ fontSize: '14px', fontWeight: '400', color: '#341405' }}>
                        Elegant feminine fragrances
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/unisex-collection"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl hover:shadow-md transition-all duration-200"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(52, 20, 5, 0.08), rgba(52, 20, 5, 0.12))',
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(to right, #341405, #5E2509)',
                      }}
                    >
                      <span
                        style={{
                          color: '#F9F7F6',
                          fontWeight: '500',
                          fontFamily: 'Manrope, sans-serif',
                        }}
                      >
                        U
                      </span>
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <h4 style={{ fontWeight: '500', color: '#341405' }}>Unisex Collection</h4>
                      <p style={{ fontSize: '14px', fontWeight: '400', color: '#341405' }}>
                        Universal appeal scents
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div
            className="md:hidden px-4 py-6 space-y-4"
            style={{
              backgroundColor: '#F9F7F6',
              color: '#341405',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            <Link
              to="/"
              className="block text-base hover:opacity-70"
              onClick={() => setMenuOpen(false)}
              style={{ fontWeight: '400', color: '#341405' }}
            >
              HOME
            </Link>
            <Link
              to="/mens-collection"
              className="block text-base hover:opacity-70"
              onClick={() => setMenuOpen(false)}
              style={{ fontWeight: '400', color: '#341405' }}
            >
              MEN'S SCENTS
            </Link>
            <Link
              to="/womens-collection"
              className="block text-base hover:opacity-70"
              onClick={() => setMenuOpen(false)}
              style={{ fontWeight: '400', color: '#341405' }}
            >
              WOMEN'S SCENTS
            </Link>
            <Link
              to="/unisex-collection"
              className="block text-base hover:opacity-70"
              onClick={() => setMenuOpen(false)}
              style={{ fontWeight: '400', color: '#341405' }}
            >
              UNISEX SCENTS
            </Link>
            <Link
              to="/gift-collection"
              className="block text-base hover:opacity-70"
              onClick={() => setMenuOpen(false)}
              style={{ fontWeight: '400', color: '#341405' }}
            >
              GIFTS
            </Link>

            {/* Mobile Search */}
            <div className="pt-4" style={{ borderTop: '1px solid #B59B8E' }}>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search perfumes..."
                  className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#F9F7F6',
                    color: '#341405',
                    borderColor: '#B59B8E',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: '400',
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#341405',
                    color: '#F9F7F6',
                  }}
                >
                  <FiSearch />
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.header>

      {/* Spacer div to prevent content from hiding behind fixed header */}
      <div style={{ height: '197px' }}></div>

      {/* Search Overlay Background */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={toggleSearch}
          style={{
            top: '197px',
            backgroundColor: 'rgba(52, 20, 5, 0.2)',
          }}
        />
      )}

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        openVerify={() => {
          setIsSignupOpen(false);
          setIsVerifyOpen(true);
        }}
        openLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        setEmail={setEmail}
      />

      <VerifyEmail
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        openLogin={() => {
          setIsVerifyOpen(false);
          setIsLoginOpen(true);
        }}
        email={email}
      />

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <ProductCartSection isOpen={isCartOpen} onClose={closeCart} />
      {/* CSS Custom Properties for dynamic header height */}
      <style jsx>{`
        :root {
          --header-height: ${isVisible ? '197px' : '0px'};
        }

        /* Responsive adjustments for smaller screens */
        @media (max-width: 1728px) {
          header {
            width: 100vw !important;
            left: 0 !important;
            transform: none !important;
          }

          .absolute[style*='left: 824px'] {
            left: 50% !important;
            transform: translateX(-50%) !important;
          }

          .absolute[style*='left: 52px'] {
            left: 2% !important;
            right: 2% !important;
            width: 96% !important;
          }

          .absolute[style*='left: 321px'] {
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          header {
            height: auto !important;
          }

          .absolute[style*='top: 116px'] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
