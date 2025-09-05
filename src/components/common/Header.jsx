import React, { useState, useEffect, useContext } from "react";
import { FiMenu, FiSearch, FiX, FiUser, FiShoppingCart, FiHeart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "./VerifyEmail";
import Login from "./Login";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

const navItems = [
  {
    label: "Home",
    path: "/",
    items: [
      "Petal Whisper",
      "Bloomé Dusk",
      "Rose Alchemy",
      "Lush Reverie",
      "Moonlit Peony",
      "Jardin de Minuit",
      "Blush Mirage",
      "Secret Gardenia",
    ],
  },
  {
    label: "Men's Scents",
    path: "/mens-collection",
    items: ["Petal Whisper", "Bloomé Dusk", "Rose Alchemy", "Lush Reverie"],
  },
  {
    label: "Women's Scents",
    path: "/womens-collection",
    items: ["Petal Whisper", "Bloomé Dusk", "Rose Alchemy", "Lush Reverie", "Moonlit Peony"],
  },
  {
    label: "Unisex's Scents",
    path: "/unisex-collection",
    items: ["Petal Whisper", "Bloomé Dusk", "Rose Alchemy", "Lush Reverie"],
  },
  {
    label: "Gifts",
    path: "/gift-collection",
    items: ["Petal Whisper", "Bloomé Dusk", "Rose Alchemy"],
  },
];

const Header = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
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
        setSearchQuery("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#000000] text-white text-sm text-center py-2">
        Free Delivery on Orders Over $990
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-black text-[#79300f] dark:text-white shadow-md z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button onClick={toggleMenu} className="text-2xl z-50 md:hidden focus:outline-none">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Desktop Nav (Left Icons) */}
            <nav className="hidden md:flex gap-6 items-center font-medium">
              <Link to="/">Select Location</Link>
              <button
                onClick={toggleSearch}
                className="flex items-center gap-2 hover:text-[#b14527] transition duration-200"
              >
                <FiSearch />
                Search
              </button>
            </nav>
          </div>

          {/* Logo */}
          <Link to="/">
            <h1 className="text-3xl font-bold tracking-wider hover:text-[#b14527] transition duration-200">
              Vesarii
            </h1>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 z-50">
            {/* Mobile Search Icon */}
            <button onClick={toggleSearch} className="text-2xl md:hidden">
              <FiSearch className={darkMode ? "text-white" : "text-black"} />
            </button>

            {/* Wishlist Icon */}
            <Link to="/wishlist-collection" className="text-2xl">
              <FiHeart className={darkMode ? "text-white" : "text-black"} />
            </Link>

            {/* Cart Icon */}
            <Link to="/product-cart" className="text-2xl">
              <FiShoppingCart className={darkMode ? "text-white" : "text-black"} />
            </Link>

            {/* User Section */}
            {user ? (
              <div className="relative flex items-center space-x-3">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#79300f] to-[#b14527] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user.username || user.email}
                  </span>
                </button>
                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 bg-white text-black dark:bg-[#1a1a1a] dark:text-white shadow-lg p-4 rounded-lg z-50 w-48"
                    >
                      <Link
                        to="/orders"
                        className="block py-2 hover:text-[#b14527] transition duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left py-2 text-red-600 hover:text-red-800 hover:underline transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => setIsSignupOpen(true)} className="text-2xl">
                <FiUser className={darkMode ? "text-white" : "text-black"} />
              </button>
            )}
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
              className="absolute top-full left-0 right-0 bg-white dark:bg-black shadow-lg z-40 border-t border-[#D4C5A9]"
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                <form onSubmit={handleSearchSubmit} className="flex gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search for perfumes, collections, or scents..."
                      className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-[#D4C5A9] bg-white dark:bg-[#1a1410] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#79300f] focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#79300f] to-[#b14527] hover:from-[#b14527] hover:to-[#79300f] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-4 py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </form>

                {/* Search Suggestions */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Aventus', 'Rose Elegance', 'Midnight Steel', 'Golden Orchid', 'Cosmic Harmony', 'Royal Oud'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="px-3 py-2 bg-[#79300f]/10 text-[#79300f] rounded-full text-sm hover:bg-[#79300f]/20 transition-colors"
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
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200">Men's Collection</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Sophisticated masculine scents</p>
                    </div>
                  </Link>

                  <Link
                    to="/womens-collection"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">W</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-900 dark:text-pink-200">Women's Collection</h4>
                      <p className="text-sm text-pink-700 dark:text-pink-300">Elegant feminine fragrances</p>
                    </div>
                  </Link>

                  <Link
                    to="/unisex-collection"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200">Unisex Collection</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Universal appeal scents</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Nav with Dropdowns */}
        <div className="hidden md:flex justify-center space-x-8 font-medium pb-4 relative">
          {navItems.map((nav, idx) => (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={nav.path} className="hover:text-[#b14527] transition duration-200">
                {nav.label}
              </Link>

              {/* Dropdown */}
              <AnimatePresence>
                {hoveredIndex === idx && nav.items && nav.items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-4 bg-white text-black dark:bg-[#1a1a1a] dark:text-white shadow-lg p-6 rounded-lg z-50 w-[800px] grid grid-cols-5 gap-6"
                    style={{
                      left: '50%',
                      transform: 'translateX(-50%)',
                      minWidth: '800px',
                      maxWidth: '90vw',
                      marginLeft: 'max(-50vw + 50%, -400px)',
                      marginRight: 'max(-50vw + 50%, -400px)',
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Left Items */}
                    <div className="col-span-4 grid grid-cols-4 gap-4">
                      {nav.items.map((item, i) => (
                        <Link
                          key={i}
                          to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="hover:underline text-sm hover:text-[#b14527] transition duration-200"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>

                    {/* Right Images */}
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
          ))}
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-black text-[#79300f] dark:text-white px-4 py-6 space-y-4">
            <Link to="/" className="block" onClick={() => setMenuOpen(false)}>New</Link>
            <Link to="/mens-collection" className="block" onClick={() => setMenuOpen(false)}>Men's Scents</Link>
            <Link to="/womens-collection" className="block" onClick={() => setMenuOpen(false)}>Women's Scents</Link>
            <Link to="/unisex-collection" className="block" onClick={() => setMenuOpen(false)}>Unisex Scents</Link>
            <Link to="/gift-collection" className="block" onClick={() => setMenuOpen(false)}>Gifts</Link>
            
            {/* Mobile Search */}
            <div className="pt-4 border-t border-[#D4C5A9]">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search perfumes..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[#D4C5A9] bg-white dark:bg-[#1a1410] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#79300f]"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#79300f] to-[#b14527] text-white px-4 py-2 rounded-lg"
                >
                  <FiSearch />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay Background */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={toggleSearch}
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
    </>
  );
};

export default Header;