import React, { useState, useEffect } from "react";
import { FiMenu, FiSearch, FiX, FiUser, FiShoppingCart, FiHeart } from "react-icons/fi";

import { Link } from "react-router-dom";
import SignupModal from "./SignupModal";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "./VerifyEmail";
import Login from "./Login";

const navItems = [
  {
    label: "New",
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
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [email, setEmail] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

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
              <Link to="/">Search</Link>
            </nav>
          </div>

          {/* Logo */}
          <h1 className="text-3xl font-bold tracking-wider">Vesarii</h1>

          {/* Right Icons */}
          {/* Right Icons */}
          <div className="flex items-center space-x-4 z-50">
            {/* Wishlist Icon */}
            <Link to="/wishlist-collection" className="text-2xl">
              <FiHeart className={darkMode ? "text-white" : "text-black"} />
            </Link>

            {/* Cart Icon */}
            <Link to="/product-cart" className="text-2xl">
              <FiShoppingCart className={darkMode ? "text-white" : "text-black"} />
            </Link>

            {/* Login Icon */}
            <button onClick={() => setIsSignupOpen(true)} className="text-2xl">
              <FiUser className={darkMode ? "text-white" : "text-black"} />
            </button>
          </div>

        </div>

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
                      marginRight: 'max(-50vw + 50%, -400px)'
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
            <Link to="/" className="block">New</Link>
            <Link to="/mens-collection" className="block">Men's Scents</Link>
            <Link to="/womens-collection" className="block">Women's Scents</Link>
            <Link to="/unisex-collection" className="block">Unisex Scents</Link>
            <Link to="/gift-collection" className="block">Gifts</Link>
          </div>
        )}
      </header>

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}
        openVerify={() => {
          setIsSignupOpen(false)
          setIsVerifyOpen(true)
        }}
        openLogin ={()=>{
          setIsSignupOpen(false)
          setIsLoginOpen(true)
        }}
        setEmail={setEmail} />
      <VerifyEmail isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} 
        openLogin={()=>{
          setIsVerifyOpen(false)
          setIsLoginOpen(true)
        }}
        email={email} />
        <Login isOpen={isLoginOpen} onClose={()=>setIsLoginOpen(false)} />
    </>
  )
};

export default Header;