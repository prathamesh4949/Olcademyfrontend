
import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '@/components/common/Footer';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { useWishlist } from '@/WishlistContext';
import { useCart } from '@/CartContext';
import { FiHeart } from 'react-icons/fi';

import aventus1 from './assets/aventus1.jpg';
import aventus2 from '../../../public/images/amberNocturne4.png';
import aventus3 from '../../../public/images/millesimeImperial.png';
import marmalade from './assets/millesime.jpg';
import intimateImage from './assets/millesime.jpg';

const WomensCollection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { cartItems, addToCart } = useCart();

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
    { id: 1, name: "Aventus", price: 455, description: "A new expression of bitter Orange. Sharp yet Sweet", image: aventus1 },
    { id: 2, name: "Aventus 2", price: 455, description: "A new expression of bitter Orange. Sharp yet Sweet", image: aventus2 },
    { id: 3, name: "Aventus 3", price: 455, description: "A new expression of bitter Orange. Sharp yet Sweet", image: aventus3 },
  ];

  const ProductCard = ({ product }) => (
    <div className="bg-white relative p-4 text-center shadow dark:bg-[#121212]">
      {/* Wishlist Icon */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        onClick={() => toggleWishlist(product)}
      >
        <FiHeart
          size={22}
          className={`${isInWishlist(product.id) ? 'fill-red-600 text-red-600' : ''}`}
        />
      </button>

      <img src={product.image} alt={product.name} className="w-full h-64 object-contain mb-4" />
      <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
      <p className="text-lg font-bold mb-4">${product.price}</p>

      {isInCart(product.id) ? (
        <button
          onClick={() => (window.location.href = '/ProductCartSection')}
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#220104] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Heading */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Women's Fragrances</h1>
          <p className="text-[#3d2b1f] dark:text-white max-w-3xl mx-auto">
            Creating iconic hand-crafted perfume for women, Creed has established a legacy...
          </p>
        </section>

        {/* Just Arrived */}
        <section className="py-10 bg-[#F4F4F4] dark:bg-[#1c1c1c]">
          <h2 className="text-2xl font-semibold text-center mb-8">Just Arrived</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Banner */}
        <section className="relative py-12">
          <img
            src={marmalade}
            alt="Marmalade Cologne"
            className="w-full h-[400px] object-cover rounded-lg shadow"
          />
          <div className="absolute bottom-6 left-6 bg-white px-6 py-3 text-[#79300f] font-bold shadow-md rounded">
            Shop Orange Marmalade Cologne
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-10 bg-[#F4F4F4] dark:bg-[#1c1c1c]">
          <h2 className="text-2xl font-semibold text-center mb-8">Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-[#79300f] text-white px-6 py-2 rounded hover:opacity-90">
              See More
            </button>
          </div>
        </section>

        {/* Huntsman */}
        <section className="py-10 bg-white dark:bg-[#181818] text-center">
          <h2 className="text-xl font-bold mb-2 text-[#79300f]">Huntsman Savile Row</h2>
          <p className="mb-8 text-sm text-[#333] dark:text-gray-300">
            A collection of refined colognes and candles tailored to the modern man.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* My Very Intimate Perfumes */}
        <section className="py-16 bg-[#F9F9F9] dark:bg-[#1a1a1a] px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src={intimateImage} alt="My Very Intimate Perfumes" className="rounded-lg shadow-lg w-full object-cover" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-[#000] dark:text-[#f6d110] mb-4 leading-tight">
                <span className="underline underline-offset-4">My Very</span><br />
                <span className="underline underline-offset-4">Intimate Perfumes</span>
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-200 text-sm">
                My Very Intimate Perfumes is an exclusive collection of bold and audacious sillages that are part of Maison Francis Kurkdjian's history and heritage. Four aromatic masterpieces to discover or rediscover...
              </p>
              <button className="bg-[#79300f] text-white px-6 py-2 rounded hover:opacity-90">
                Gifts for Him
              </button>
            </div>
          </div>
        </section>

        {/* Closing Description */}
        <section className="text-center text-sm text-[#333] dark:text-gray-300 px-6 py-10 max-w-4xl mx-auto">
          <p>
            Explore Jo Malone London’s collection of men’s perfume, home scents, and grooming gifts. Each scent is crafted with rich, layered notes and timeless elegance, offering a luxurious selection for every occasion. From fresh, vibrant body washes to warm, woody scented candles, our range is designed to suit every scent preference. Discover distinctive, luxury fragrances for men who appreciate quality and sophistication, and find the perfect expression of personal style.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WomensCollection;
