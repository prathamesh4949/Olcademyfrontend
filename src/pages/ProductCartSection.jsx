import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/CartContext';

const ProductCartSection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="bg-[#F5F5F5] dark:bg-[#220104] font-sans text-[#3b220c] dark:text-[#f6d110] min-h-screen">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded shadow dark:bg-[#2c0a0a]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[250px] w-full object-contain mb-3"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm">${item.price}</p>
                
                <div className="flex justify-between items-center mt-4 gap-3">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-700 hover:bg-red-800 text-white text-sm font-medium py-2 px-4 rounded shadow"
                  >
                    Remove
                  </button>
                  {/* Shop Now Button */}
                  <button
                    onClick={() => window.location.href = '/Checkout'}
                    className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-4 rounded shadow"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductCartSection;
