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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Define heights
  const INITIAL_HEIGHT = 197;
  const STICKY_HEIGHT = 160; // Sleek sticky bar height
  const SCROLL_THRESHOLD = 50;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Scroll Effect Logic
   */
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

  // Effect for body overflow (kept as is)
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : 'auto';
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

  // Dynamic values
  const currentHeight = isScrolled ? STICKY_HEIGHT : INITIAL_HEIGHT;

  // *****************************************************************
  // 🚀 CORE LOGIC CHANGES FOR STICKY LAYOUT
  // Logo Layer positioning
  // Moves from top: 20px (unscrolled) to top: 50px when scrolled (160px height - 60px logo height = 100px. 100/2 = 50px)
const logoTop = isScrolled ? '50px' : '20px'; 
// Moves from '50%' (centered) to '52px' (left corner padding)
const logoLeft = isScrolled ? '52px' : '50%'; 
// Removes the centering transform
const logoTransform = isScrolled ? 'translateX(0%)' : 'translateX(-50%)'; 

// Icons/Search Layer positioning
// Unscrolled: top: 86px. Scrolled: same as logo (50px) for alignment
const iconSearchLayerTop = isScrolled ? '63px' : '86px'; 
const iconSearchLayerLeft = isScrolled ? 'auto' : '52px'; // Unscrolled: Left edge
const iconSearchLayerRight = isScrolled ? '52px' : 'auto'; // Scrolled: Right edge

// Nav Bar Layer (Now stays visible and repositions vertically)
const navLayerTop = isScrolled ? '50px' : '116px'; // Unscrolled: 116px. Scrolled: (160-60)/2 = 50px
// ⚠️ We MUST keep the Nav Layer on the page now. No more hiding animation.


const spacerHeight = INITIAL_HEIGHT;

  return (
    <>
      {/* Header with dynamic height and fixed position */}
      <motion.header
        animate={{
          height: currentHeight,
          // ⚠️ CRITICAL FIX: Header must ALWAYS be centered (left: 50%, transform: -50%) 
          // to maintain the 1728px content layout, regardless of scrolling.
          left: '50%', 
          transform: 'translateX(-50%)',
          // Reset border width based on current requirement (160px sticky is fine with 0px border)
          borderBottomWidth: isScrolled ? '0px' : '1px', 
          backgroundColor: isScrolled ? '#FFFFFF' : '#F9F7F6',
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="fixed top-0 z-50 overflow-hidden" 
        style={{
          width: '1728px',
          height: `${INITIAL_HEIGHT}px`,
          backgroundColor: '#F9F7F6',
          border: '1px solid #B59B8E',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maxWidth: '100vw',
        }}
      >
        {/* First Layer - Logo Only (Dynamic Positioning) */}
        <div
          className="absolute flex items-center transition-all duration-300 ease-out"
          style={{
            width: '80px',
            height: '60px', // Set to logo height for cleaner alignment
            top: logoTop, 
            left: logoLeft, // Dynamic left position
            transform: logoTransform, // Dynamic transform
            // ⚠️ When scrolled, justify to the START for left-alignment
          justifyContent: isScrolled ? 'flex-start' : 'center',
          zIndex:51,
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

        {/* Second Layer - Search Left, Icons Right (Dynamic Positioning) */}
        <div
          className="absolute flex items-center transition-all duration-300 ease-out"
          style={{
            width: isScrolled ? 'auto' : '1624px', // Auto width when sticky
            height: '34px',
            top: iconSearchLayerTop, 
            left: isScrolled ? 'auto' : iconSearchLayerLeft, // Controlled by CSS when sticky
          right: iconSearchLayerRight, // Pin to the right when sticky
          justifyContent: isScrolled ? 'flex-end' : 'space-between',
          zIndex:51,
          }}
        >
          {/* Left Section - Search & Menu (Only visible on the left side when sticky) */}
          <div 
            className="flex items-center"
            style={{ 
              opacity: isScrolled ? 0 : 1, // Always visible
              // When unscrolled, it takes the left side. When scrolled, it just displays here.
              pointerEvents: isScrolled ? 'none' : 'auto',
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
                // Hide search button when sticky because it should be part of the right icons block
                display: isScrolled ? 'none' : 'flex', 
              }}
              aria-label="Toggle Search"
            >
              <FiSearch size={34} />
            </button>
          </div>
          
          {/* Right Icons (Always on the right, but their container is positioned dynamically) */}
          <div
            className="flex items-center z-50"
            style={{
              // ⚠️ When scrolled, only need space for one icon
            width: isScrolled ? '34px' : '162px', 
            height: '34px',
            gap: isScrolled ? '0px' : '32px',
            }}
          >
            {/* New: Search Icon when Scrolled (Right side) */}
            {isScrolled && (
              <button
                onClick={toggleSearch}
                className="flex items-center transition duration-200"
                style={{
                  width: '34px',
                  height: '34px',
                  color: '#341405',
                  display: isScrolled ? 'none' : 'flex', // ⚠️ Hiding when scrolled
                }}
                aria-label="Toggle Search"
              >
                <FiSearch size={34} />
              </button>
            )}

            {/* Wishlist Icon */}
            <Link
              to="/wishlist-collection"
              style={{ width: '34px', height: '34px', color: '#341405',
                display: isScrolled ? 'none' : 'flex', // ⚠️ Hiding when scrolled
               }}
              aria-label="Wishlist"
            >
              <FiHeart size={34} />
            </Link>

            {/* Shopping Cart Icon */}
            <button
              type="button"
              onClick={openCart}
              style={{ width: '34px', height: '34px', color: '#341405',
                display: isScrolled ? 'none' : 'flex', // ⚠️ Hiding when scrolled
               }}
              aria-label="Open cart"
            >
              <FiShoppingCart size={34} />
            </button>

            {/* User Section (Kept as is for brevity) */}
            {user ? (
              <div className="relative flex items-center">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center focus:outline-none"
                  style={{ width: '34px', height: '34px' }}
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
                      className="absolute top-full mt-2 right-0 shadow-lg rounded-lg z-50"
                      style={{
                        backgroundColor: '#F9F7F6',
                        border: '1px solid #B59B8E',
                        padding: '16px',
                        width: '200px',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      <Link
                        to="/orders"
                        className="block py-2 hover:opacity-70 transition duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                        style={{ fontSize: '16px', fontWeight: '400', color: '#341405' }}
                      >
                        My Orders
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
                style={{ width: '34px', height: '34px', color: '#341405' }}
                aria-label="Sign Up"
              >
                <FiUser size={34} />
              </button>
            )}
          </div>
        </div>

        {/* Third Layer - Navigation Bar (Hides/Fades on scroll) */}
        <motion.div
          animate={{
            top: navLayerTop, // <--- NEW DYNAMIC TOP
            // ⚠️ NEW/MODIFIED: Use '0%' for unscrolled and a slight right-shift (e.g., 20px) for scrolled
    // x: isScrolled ? '400px' : '2000%', // Adjust the x (horizontal) transform
          }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute hidden md:flex items-center"
          style={{
            width: isScrolled ? '100%' : '1117px', 
            height: '60px',
            // ⚠️ CRITICAL: When scrolled, pin it to the left edge of the 1728px container.
            // This allows it to span the full width of the header.
            left: isScrolled ? '0%' : '50%', 
            // ⚠️ Remove the static transform. It will be controlled by 'animate' or 'left: 0'
            transform: isScrolled ? 'translateX(0%)' : 'translateX(-50%)', 
            
            gap: '0px',
            // This is the core instruction: center the links within the full-width container
            justifyContent: 'center', 
            zIndex: 50,
          }}
        >
          {navItems.map((item, index) => (
            // Navigation Items... (kept as is)
            <div
              key={item.label}
              className="relative group flex items-center justify-center"
              style={{
                minWidth: '142px',
                height: '60px',
                padding: '12px 32px',
                borderBottom: isActiveNavItem(item.path) ? '1px solid #341405' : 'none',
                width: item.label === 'HOME' ? '142px' : 'auto', 
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                to={item.path}
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
                }}
              >
                {item.label}
              </Link>

              {/* Dropdown Menu (kept as is) */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[60px] left-0 shadow-lg rounded-lg z-50"
                    style={{
                      backgroundColor: '#F9F7F6',
                      border: '1px solid #B59B8E',
                      padding: '16px',
                      width: '250px',
                      fontFamily: 'Manrope, sans-serif',
                    }}
                  >
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem}
                        to={`${item.path}/${subItem.toLowerCase().replace(/\s/g, '-')}`}
                        className="block py-2 hover:opacity-70 transition duration-200"
                        onClick={() => setHoveredIndex(null)}
                        style={{ fontSize: '16px', fontWeight: '400', color: '#341405' }}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* ... (Search Overlay and Mobile Nav kept as is for brevity) ... */}

      </motion.header>

      {/* Spacer div to prevent content from hiding behind fixed header */}
      <div style={{ height: `${spacerHeight}px` }}></div>

      {/* ... (Modals kept as is) ... */}
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
      
      {/* CSS Custom Properties */}
      <style jsx>{`
        /* Responsive adjustments for smaller screens */
        @media (max-width: 1728px) {
          header {
            width: 100vw !important; 
            max-width: 100vw !important;
          }

          /* Targets the icon/search layer */
          .absolute[style*='height: 34px'] {
            /* When unscrolled (left: 52px), it's centered width 96% */
            /* When scrolled (right: 52px), it must be pinned to the right edge (2% padding) */
            left: ${isScrolled ? 'auto' : '2%'} !important; 
            right: 2% !important;
            width: ${isScrolled ? 'auto' : '96%'} !important;
          }

          /* Targets the logo container */
          .absolute[style*='height: 60px'] {
            /* When unscrolled, it's centered by its own left: 50%/transform: -50% */
            /* When scrolled, it should be on the left edge (2% padding) */
            left: ${isScrolled ? '2%' : '50%'} !important; 
            transform: ${isScrolled ? 'translateX(0%)' : 'translateX(-50%)'} !important;
          }
          
          /* Force the logo to the far left when sticky on smaller screens */
          .absolute[style*='left: 52px'][style*='transform: translateX(0%)'] {
              left: 2% !important;
              transform: translateX(0%) !important;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          header {
            height: auto !important; 
          }
        }
      `}</style>
    </>
  );
};

export default Header;