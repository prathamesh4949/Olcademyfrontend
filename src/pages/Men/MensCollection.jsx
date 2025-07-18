
import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '@/components/common/Footer';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { FiHeart } from 'react-icons/fi';

// Local images
import aventus1 from './assets/aventus1.jpg';
import aventus2 from './assets/image 31.png';
import aventus3 from './assets/aventus1.jpg';
import marmaladeBanner from './assets/millesime.jpg';

const MensCollection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  const products = [
    {
      id: 1,
      name: 'Aventus',
      price: 455,
      desc: 'A new expression of bitter Orange. Sharp yet sweet',
      image: aventus1,
    },
    {
      id: 2,
      name: 'Aventus 2',
      price: 455,
      desc: 'A new expression of bitter Orange. Sharp yet sweet',
      image: aventus2,
    },
    {
      id: 3,
      name: 'Aventus 3',
      price: 455,
      desc: 'A new expression of bitter Orange. Sharp yet sweet',
      image: aventus3,
    },
  ];

  const renderButton = (product) => {
    const inCart = isInCart(product.id);
    return inCart ? (
      <button
        onClick={() => (window.location.href = '/Checkout')}
        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded shadow"
      >
        Shop Now
      </button>
    ) : (
      <button
        onClick={() => addToCart(product)}
        className="bg-[#79300f] hover:bg-[#5e250a] text-white text-sm font-medium py-2 px-4 rounded shadow"
      >
        Add to Cart
      </button>
    );
  };

  const ProductCard = ({ item }) => (
    <div className="bg-white relative p-4 text-center shadow dark:bg-[#121212]">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        onClick={() => toggleWishlist(item)}
      >
        <FiHeart
          size={22}
          className={`${isInWishlist(item.id) ? 'fill-red-600 text-red-600' : ''}`}
        />
      </button>
      <img src={item.image} alt={item.name} className="w-full h-64 object-contain mb-4" />
      <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.desc}</p>
      <p className="text-lg font-bold mb-4">${item.price}</p>
      {renderButton(item)}
    </div>
  );

  return (
    <div className="bg-white dark:bg-black text-[#79300f] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero */}
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="text-center px-6 mb-10"
        >
          <motion.h2 variants={fadeIn('up', 0.3)} className="text-3xl font-semibold my-6">
            Men's Fragrances
          </motion.h2>
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-[18px] leading-relaxed max-w-3xl mx-auto text-[#3d2b1f]"
          >
            Creating iconic hand-crafted perfume for men, Creed has established a legacy of
            fragrance, cologne and aftershave. Explore our bestselling Creed men's fragrances.
          </motion.p>
        </motion.section>

        {/* Just Arrived */}
        <motion.section className="bg-[#f7f7f7] py-12">
          <h3 className="text-3xl text-center mb-8">Just Arrived</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </motion.section>

        {/* Marmalade Banner */}
        <motion.section className="py-16 relative">
          <img src={marmaladeBanner} alt="Shop Marmalade" className="w-full h-[400px] object-cover" />
          <div className="absolute bottom-6 left-6 bg-white px-4 py-2 font-semibold">
            Shop Orange Marmalade Cologne
          </div>
        </motion.section>

        {/* Best Sellers */}
        <motion.section className="bg-[#f7f7f7] py-12">
          <h3 className="text-3xl text-center mb-8">Best Sellers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </motion.section>

        {/* Huntsman Savile Row */}
        <motion.section className="bg-white dark:bg-black py-16 px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Huntsman Savile Row</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-10 max-w-xl mx-auto">
            A collection of refined colognes and candles tailored to the modern man.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default MensCollection;
