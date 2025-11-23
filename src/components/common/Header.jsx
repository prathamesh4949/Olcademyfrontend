import React, { useState, useEffect, useContext } from 'react';
import { FiMenu, FiSearch, FiX, FiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SignupModal from './SignupModal';
import { motion, AnimatePresence } from 'framer-motion';
import VerifyEmail from './VerifyEmail';
import Login from './Login';
import ProductCartSection from '@/pages/ProductCartSection';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  {
    label: 'HOME',
    path: '/',
  },
  {
    label: "MEN'S SCENTS",
    path: '/mens-collection',
  },
  {
    label: "WOMEN'S SCENTS",
    path: '/womens-collection',
  },
  {
    label: 'UNISEX SCENTS',
    path: '/unisex-collection',
  },
  {
    label: 'GIFTS',
    path: '/gift-collection',
  },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const INITIAL_HEIGHT = 197;
  const STICKY_HEIGHT = 160;
  const SCROLL_THRESHOLD = 50;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(currentScrollPos > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [menuOpen, searchOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };
  
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

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

  const isActiveNavItem = (path) => location.pathname === path;

  const currentHeight = isScrolled ? STICKY_HEIGHT : INITIAL_HEIGHT;
  const logoTop = isScrolled ? '50px' : '20px';
  const logoLeft = isScrolled ? '52px' : '50%';
  const logoTransform = isScrolled ? 'translateX(0%)' : 'translateX(-50%)';
  const iconSearchLayerTop = isScrolled ? '63px' : '86px';
  const navLayerTop = isScrolled ? '50px' : '116px';
  const spacerHeight = INITIAL_HEIGHT;

  return (
    <>
      <style>{`
        /* Hide scrollbar globally */
        html::-webkit-scrollbar {
          display: none;
        }
        
        html {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow-x: hidden;
          overflow-y: scroll;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        #root {
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
      `}</style>

      <motion.header
        animate={{
          height: currentHeight,
          borderBottomWidth: isScrolled ? '0px' : '1px',
          backgroundColor: isScrolled ? '#FFFFFF' : '#F9F7F6',
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="fixed top-0 left-0 right-0 z-[9999]"
        style={{
          width: '100%',
          maxWidth: '100vw',
          height: `${INITIAL_HEIGHT}px`,
          backgroundColor: '#F9F7F6',
          border: '1px solid #B59B8E',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div className="relative w-full h-full max-w-[1728px] mx-auto px-[52px]">
          {/* Logo Layer */}
          <div
            className="absolute flex items-center transition-all duration-300 ease-out"
            style={{
              width: '80px',
              height: '60px',
              top: logoTop,
              left: isScrolled ? '52px' : '50%',
              transform: logoTransform,
              justifyContent: isScrolled ? 'flex-start' : 'center',
              zIndex: 10001,
            }}
          >
            <Link to="/" className="flex items-center justify-center">
              <motion.img
                src="/images/Logo.png"
                alt="Logo"
                animate={{
                  scale: isScrolled ? 0.75 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: '120px',
                  height: '60px',
                  objectFit: 'contain',
                }}
              />
            </Link>
          </div>

          {/* Search Icon Adjacent to Logo (when scrolled) */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute flex items-center"
                style={{
                  top: '63px',
                  left: '162px',
                  zIndex: 10001,
                }}
              >
                <button
                  onClick={toggleSearch}
                  className="flex items-center transition duration-200 hover:opacity-70"
                  style={{
                    width: '34px',
                    height: '34px',
                    color: '#341405',
                  }}
                  aria-label="Toggle Search"
                >
                  <FiSearch size={34} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icons/Search Layer */}
          <div
            className="absolute flex items-center transition-all duration-300 ease-out"
            style={{
              width: isScrolled ? 'auto' : 'calc(100% - 104px)',
              height: '34px',
              top: iconSearchLayerTop,
              left: isScrolled ? 'auto' : '52px',
              right: '52px',
              justifyContent: isScrolled ? 'flex-end' : 'space-between',
              zIndex: 10001,
            }}
          >
            {/* Left Section - Search & Menu (only visible when NOT scrolled) */}
            <div
              className="flex items-center"
              style={{
                opacity: isScrolled ? 0 : 1,
                pointerEvents: isScrolled ? 'none' : 'auto',
                visibility: isScrolled ? 'hidden' : 'visible',
              }}
            >
              <button
                onClick={toggleMenu}
                className="text-2xl z-50 md:hidden focus:outline-none mr-4"
                style={{ color: '#341405' }}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <FiX size={34} /> : <FiMenu size={34} />}
              </button>

              <button
                onClick={toggleSearch}
                className="flex items-center transition duration-200"
                style={{
                  width: '34px',
                  height: '34px',
                  color: '#341405',
                }}
                aria-label="Toggle Search"
              >
                <FiSearch size={34} />
              </button>
            </div>

            {/* Right Icons */}
            <div
              className="flex items-center"
              style={{
                height: '34px',
                gap: '32px',
                zIndex: 10001,
              }}
            >
              {/* Wishlist Icon */}
              <Link
                to="/wishlist-collection"
                style={{
                  width: '34px',
                  height: '34px',
                  color: '#341405',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Wishlist"
              >
                <FiHeart size={34} />
              </Link>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                onClick={openCart}
                style={{
                  width: '34px',
                  height: '34px',
                  color: '#341405',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                    style={{ width: '34px', height: '34px', zIndex: 10002 }}
                    aria-label="User Account"
                  >
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '34px',
                        height: '34px',
                        backgroundColor: '#341405',
                        color: '#F9F7F6',
                        fontSize: '16px',
                        fontWeight: '500',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      {user.username
                        ? user.username.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 right-0 shadow-lg rounded-lg"
                        style={{
                          backgroundColor: '#F9F7F6',
                          border: '1px solid #B59B8E',
                          padding: '16px',
                          width: '200px',
                          fontFamily: 'Manrope, sans-serif',
                          zIndex: 10003,
                        }}
                      >
                        {/* <Link
                          to="/orders"
                          className="block py-2 hover:opacity-70 transition duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                          style={{ fontSize: '16px', fontWeight: '400', color: '#341405' }}
                        >
                          My Orders
                        </Link> */}

                                               <Link
                        to="/userProfile"
                        className="block py-2 hover:opacity-70 transition duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                        style={{ fontSize: '16px', fontWeight: '400', color: '#341405' }}
                      >
                        My Profile
                      </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="block w-full text-left py-2 hover:opacity-70 transition-colors"
                          style={{ fontSize: '16px', fontWeight: '400', color: '#341405' }}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Sign Up"
                >
                  <FiUser size={34} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Bar */}
          <motion.div
            animate={{
              top: navLayerTop,
            }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute hidden md:flex items-center"
            style={{
              width: isScrolled ? '100%' : 'auto',
              height: '60px',
              left: isScrolled ? '0%' : '50%',
              transform: isScrolled ? 'translateX(0%)' : 'translateX(-50%)',
              gap: '0px',
              justifyContent: 'center',
              zIndex: 10000,
            }}
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative flex items-center justify-center"
                style={{
                  minWidth: '142px',
                  height: '60px',
                  padding: '12px 32px',
                  borderBottom: isActiveNavItem(item.path) ? '1px solid #341405' : 'none',
                  width: item.label === 'HOME' ? '142px' : 'auto',
                }}
              >
                <Link
                  to={item.path}
                  className="hover:opacity-70 transition-opacity duration-200"
                  style={{
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#F9F7F6] shadow-lg overflow-y-auto"
              style={{ zIndex: 10004 }}
            >
              <div className="p-6">
                <button
                  onClick={toggleMenu}
                  className="mb-6 text-[#341405]"
                  aria-label="Close Menu"
                >
                  <FiX size={28} />
                </button>
                {navItems.map((item) => (
                  <div key={item.label} className="mb-4">
                    <Link
                      to={item.path}
                      onClick={toggleMenu}
                      className="block py-2 text-lg font-medium text-[#341405] hover:text-[#79300f]"
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32"
            style={{ zIndex: 10005, overflow: 'hidden' }}
            onClick={toggleSearch}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 10006 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#341405]">Search Perfumes</h2>
                <button
                  onClick={toggleSearch}
                  className="text-[#341405] hover:text-[#79300f] transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for your perfect scent..."
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-[#B59B8E] focus:border-[#79300f] focus:outline-none text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: `${spacerHeight}px` }}></div>

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
    </>
  );
};

export default Header;