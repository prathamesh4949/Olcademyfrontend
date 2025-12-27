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

  const INITIAL_HEIGHT = 197;
  const STICKY_HEIGHT = 120;
  const SCROLL_THRESHOLD = 50;

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActiveNavItem = (path) => location.pathname === path;

  const currentHeight = isScrolled ? STICKY_HEIGHT : INITIAL_HEIGHT;

  const logoTop = isScrolled ? '28px' : '20px';
  const logoLeft = isScrolled ? '52px' : '50%';
  const logoTransform = isScrolled ? 'translateX(0%)' : 'translateX(-50%)';

  const navLayerTop = isScrolled ? '22px' : '116px';
  const iconLayerTop = isScrolled ? '26px' : '86px';

  const navFontSize = isScrolled ? '18px' : '20px';
  const navPadding = isScrolled ? '6px 10px' : '12px 18px';
  const navMinWidth = isScrolled ? '95px' : '142px';

  const spacerHeight = INITIAL_HEIGHT;

  return (
    <>
      <style>{`
        html::-webkit-scrollbar { display: none; }
        html { -ms-overflow-style: none; scrollbar-width: none; overflow-y: scroll; overflow-x: hidden; }
        body, #root { margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100vw; }
      `}
      
      </style>
      {/* navbar */}
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
        <div className="relative w-full h-full max-w-[1728px] mx-auto px-[52px]">

          <div
            className="absolute flex items-center transition-all duration-300"
            style={{
              width: '80px',
              height: '60px',
              top: logoTop,
              left: logoLeft,
              transform: logoTransform,
              zIndex: 10001
            }}
          >
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
                marginRight: isScrolled ? '18px' : '0px' // ← ONLY CHANGE #2
              }}
            >
              <button
                onClick={toggleMenu}
                className="text-2xl z-50 md:hidden focus:outline-none mr-4"
                style={{ color: '#341405' }}
              >
                {menuOpen ? <FiX size={34} /> : <FiMenu size={34} />}
              </button>

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
                        className="absolute top-full mt-2 right-0 shadow-lg "
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
                            logout();
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
            {/* <button
              onClick={toggleSearch}
              style={{
                width: isScrolled ? '32px' : '40px',
                height: isScrolled ? '32px' : '40px',
                color: '#341405',
                transform: isScrolled ? 'scale(0.9)' : 'scale(1)',
                transition: 'all 0.25s ease'
              }}
            >
              <FiSearch size={isScrolled ? 28 : 34} />
            </button> */}

            {navItems.map((item) => (
              <div
                key={item.label}
                style={{
                  minWidth: navMinWidth,
                  padding: navPadding,
                  borderBottom: isActiveNavItem(item.path) ? '1px solid #341405' : 'none'
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
      </motion.header>

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
              className="bg-white  shadow-2xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your perfect scent..."
                  className="flex-1 px-6 py-4  border-2 border-[#B59B8E] text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white px-8 py-4  font-semibold shadow-lg"
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
    </>
  );
};

export default React.memo(Header);
