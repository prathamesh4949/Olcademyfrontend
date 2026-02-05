import React, { useState, useEffect, useContext } from 'react';
import { FiMenu, FiSearch, FiX, FiUser, FiShoppingCart, FiHeart, FiHome } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SignupModal from './SignupModal';
import { motion, AnimatePresence } from 'framer-motion';
import VerifyEmail from './VerifyEmail';
import Login from './Login';
import ProductCartSection from '@/pages/ProductCartSection';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { label: 'HOME', path: '/' },
  { label: "MEN'S SCENTS", path: '/mens-collection' },
  { label: "WOMEN'S SCENTS", path: '/womens-collection' },
  { label: 'UNISEX SCENTS', path: '/unisex-collection' },
  { label: 'GIFTS', path: '/gift-collection' }
];

const Header = ({ darkMode, setDarkMode }) => {
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const INITIAL_HEIGHT = 197;
  const STICKY_HEIGHT = 120;
  const MOBILE_HEIGHT = 'auto';
  const SCROLL_THRESHOLD = 50;

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(top > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
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
    if (searchOpen) setSearchQuery('');
  };

  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setIsUserDropdownOpen(false);
    logout();
    setShowLogoutNotification(true);
    setTimeout(() => {
      setShowLogoutNotification(false);
    }, 3000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActiveNavItem = (path) => location.pathname === path;

  const currentHeight = isMobile ? MOBILE_HEIGHT : (isScrolled ? STICKY_HEIGHT : INITIAL_HEIGHT);

  const logoTop = isScrolled ? '28px' : '20px';
  const logoLeft = isScrolled ? '52px' : '50%';
  const logoTransform = isScrolled ? 'translateX(0%)' : 'translateX(-50%)';

  const navLayerTop = isScrolled ? '22px' : '116px';
  const iconLayerTop = isScrolled ? '26px' : '86px';

  const navFontSize = isScrolled ? '18px' : '20px';
  const navPadding = isScrolled ? '2px 8px' : '12px 8px';
  const navMinWidth = isScrolled ? '80px' : '120px';

  const spacerHeight = isMobile ? 120 : INITIAL_HEIGHT;

  return (
    <>
      <style>{`
        html::-webkit-scrollbar { display: none; }
        html { -ms-overflow-style: none; scrollbar-width: none; overflow-y: scroll; overflow-x: hidden; }
        body, #root { margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100vw; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {isMobile ? (
        <header className="fixed top-0 left-0 right-0 bg-white border-b z-[9999]" style={{ borderColor: '#B59B8E' }}>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Link to="/">
                <img src="/images/Logo.png" alt="Logo" style={{ width: 60, height: 30, objectFit: 'contain' }} />
              </Link>

              <div className="flex-1 relative">
                <input
                  readOnly
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search For Perfume"
                  className="w-full pl-10 pr-4 py-2.5 border-2 focus:outline-none"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderRadius: '10px',
                    borderColor: '#8B6F47',
                    color: '#6b3f2a',
                    backgroundColor: '#FFFFFF'
                  }}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: '#8B6F47' }} />
              </div>

              <div className="flex gap-3">
                <Link to="/wishlist-collection"><FiHeart size={22} color="#341405" /></Link>
                <button onClick={() => setIsCartOpen(true)}><FiShoppingCart size={22} color="#341405" /></button>
                {user ? (
                  <button onClick={() => setIsUserDropdownOpen(v => !v)}>
                    <div className="w-6 h-6 rounded-full bg-[#341405] text-white flex items-center justify-center text-xs">
                      {(user.username || user.email)[0].toUpperCase()}
                    </div>
                  </button>
                ) : (
                  <button onClick={() => setIsSignupOpen(true)}><FiUser size={22} color="#341405" /></button>
                )}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap flex-shrink-0"
                style={{
                  border: '1.5px solid #8B6F47',
                  backgroundColor: '#F5F3F0',
                  color: '#6b3f2a',
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '1.2px'
                }}
              >
                <FiHome size={16} color="#6b3f2a" />
                HOME
              </button>

              {navItems.slice(1).map(item => {
                const active = isActiveNavItem(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-4 py-2.5 rounded-lg whitespace-nowrap flex-shrink-0 text-center"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '13px',
                      fontWeight: '500',
                      letterSpacing: '1.2px',
                      color: '#6b3f2a',
                      backgroundColor: active ? '#E8D4A0' : '#F5F3F0',
                      border: '1.5px solid #8B6F47'
                    }}
                  >
                    {item.label.replace("'S SCENTS", "'S").replace(" SCENTS", "")}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>
      ) : (
        <motion.header
          animate={{
            height: currentHeight,
            backgroundColor: isScrolled ? '#ffffff' : '#F9F7F6',
            borderBottomWidth: isScrolled ? '0px' : '1px'
          }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[9999]"
          style={{
            width: '100%',
            height: INITIAL_HEIGHT,
            border: '1px solid #B59B8E',
            backgroundColor: '#F9F7F6',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="relative w-full h-full max-w-full mx-auto px-[52px]">
            <div
              className="absolute flex items-center transition-all duration-300"
              style={{
                width: isScrolled ? 'auto' : '80px',
                height: '60px',
                top: logoTop,
                left: logoLeft,
                transform: logoTransform,
                zIndex: 10001,
                gap: isScrolled ? '12px' : '0'
              }}
            >
              {isScrolled && (
                <button
                  onClick={toggleSearch}
                  style={{
                    width: '28px',
                    height: '28px',
                    color: '#341405',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiSearch size={28} />
                </button>
              )}
              <Link to="/">
                <motion.img
                  src="/images/Logo.png"
                  alt="Logo"
                  animate={{ scale: isScrolled ? 0.78 : 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: '120px', height: '60px', objectFit: 'contain' }}
                />
              </Link>
            </div>

            <div
              className="absolute flex items-center transition-all duration-300"
              style={{
                width: isScrolled ? 'auto' : 'calc(100% - 104px)',
                top: iconLayerTop,
                left: isScrolled ? 'auto' : '52px',
                right: '52px',
                justifyContent: isScrolled ? 'flex-end' : 'space-between',
                zIndex: 10002,
                pointerEvents: 'auto'
              }}
            >
              <div
                className="flex items-center transition-all duration-300"
                style={{
                  transform: isScrolled ? 'scale(0.95)' : 'scale(1)',
                  marginRight: isScrolled ? '18px' : '0px'
                }}
              >
                {/* <button
                  onClick={toggleSearch}
                  style={{
                    width: '34px',
                    height: '34px',
                    color: '#341405'
                  }}
                >
                  <FiSearch size={34} />
                </button> */}
                {!isScrolled && (
                  <button
                    onClick={toggleSearch}
                    style={{
                      width: '34px',
                      height: '34px',
                      color: '#341405'
                    }}
                  >
                    <FiSearch size={34} />
                  </button>
                )}
              </div>

              <div className="flex items-center" style={{ gap: '28px' }}>
                <Link
                  to="/wishlist-collection"
                  style={{
                    width: '34px',
                    height: '34px',
                    color: '#341405',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FiHeart size={34} />
                </Link>

                <button
                  onClick={openCart}
                  style={{
                    width: '34px',
                    height: '34px',
                    color: '#341405',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FiShoppingCart size={34} />
                </button>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={toggleUserDropdown}
                      style={{
                        width: '34px',
                        height: '34px'
                      }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: '34px',
                          height: '34px',
                          backgroundColor: '#341405',
                          color: '#fff'
                        }}
                      >
                        {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 right-0 shadow-lg"
                          style={{
                            backgroundColor: '#F9F7F6',
                            border: '1px solid #B59B8E',
                            width: '200px',
                            padding: '16px',
                            zIndex: 10050,
                            pointerEvents: 'auto'
                          }}
                        >
                          <Link
                            to="/userProfile"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="block py-2"
                            style={{ color: '#341405', fontSize: '16px' }}
                          >
                            My Profile
                          </Link>

                          <button
                            onClick={() => {
                              setIsLogoutModalOpen(true);
                              setIsUserDropdownOpen(false);
                            }}
                            className="block w-full text-left py-2"
                            style={{ color: '#341405', fontSize: '16px' }}
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
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <FiUser size={34} />
                  </button>
                )}
              </div>
            </div>

            <motion.div
              animate={{ top: navLayerTop }}
              transition={{ duration: 0.3 }}
              className="absolute hidden md:flex items-center"
              style={{
                width: '100%',
                left: 0,
                transform: 'translateX(0)',
                justifyContent: 'center',
                gap: '12px',
                height: '60px',
                pointerEvents: 'auto',
                zIndex: 10000
              }}
            >
              {navItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    minWidth: navMinWidth,
                    padding: navPadding,
                    borderBottom: isActiveNavItem(item.path) ? '1px solid #341405' : 'none',
                    textAlign: 'center'
                  }}
                >
                  <Link
                    to={item.path}
                    className="hover:opacity-70"
                    style={{
                      fontFamily: 'Manrope',
                      fontWeight: '400',
                      fontSize: navFontSize,
                      textTransform: 'uppercase',
                      color: '#341405'
                    }}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.header>
      )}

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-[#F9F7F6] shadow-lg"
            style={{ zIndex: 10010 }}
          >
            <div className="p-6">
              <button onClick={toggleMenu} className="mb-6 text-[#341405]">
                <FiX size={28} />
              </button>

              {navItems.map((item) => (
                <div key={item.label} className="mb-4">
                  <Link
                    to={item.path}
                    onClick={toggleMenu}
                    className="block py-2 text-lg text-[#341405]"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32"
            style={{ zIndex: 10030 }}
            onClick={toggleSearch}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-2xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your perfect scent..."
                  className="flex-1 px-6 py-4 border-2 border-[#B59B8E] text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white px-8 py-4 font-semibold shadow-lg"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: spacerHeight }} />

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

      <AnimatePresence>
        {isLogoutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            style={{ zIndex: 10040 }}
            onClick={() => setIsLogoutModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#F9F7F6] border border-[#B59B8E] shadow-2xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold text-[#341405] mb-4">Confirm Logout</h3>
              <p className="text-[#341405] mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-6 py-2 border-2 border-[#B59B8E] text-[#341405] font-semibold hover:bg-[#B59B8E] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 right-8 bg-green-600 text-white px-6 py-4 shadow-2xl flex items-center gap-3 z-[10060]"
            style={{ 
              zIndex: 10060,
              borderRadius: '8px'
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-lg">Successfully logged out!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Header);