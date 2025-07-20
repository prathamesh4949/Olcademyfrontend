import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/CartContext';

const ProductCartSection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading, isInitialized } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Calculate total price - with safety check
  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return '0.00';
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/'); // Navigate to home page instead of products
  };

  // Show loading state while cart is initializing
  if (!isInitialized) {
    return (
      <div className="bg-[#F5F5F5] dark:bg-[#220104] font-sans text-[#3b220c] dark:text-[#f6d110] min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-8">
            <p className="text-xl">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] dark:bg-[#220104] font-sans text-[#3b220c] dark:text-[#f6d110] min-h-screen">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Your Cart</h2>
          {cartItems && cartItems.length > 0 && (
            <button
              onClick={clearCart}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
            >
              {loading ? 'Clearing...' : 'Clear Cart'}
            </button>
          )}
        </div>

        {loading && (!cartItems || cartItems.length === 0) ? (
          <div className="text-center py-8">
            <p>Loading cart...</p>
          </div>
        ) : (!cartItems || cartItems.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Your cart is empty.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cartItems && cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg dark:bg-[#2c0a0a] border dark:border-gray-700 transition-transform hover:scale-105">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[200px] w-full object-contain mb-3 rounded-lg"
                    />
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">
                      ${item.price}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          disabled={loading || (item.quantity || 1) <= 1}
                          className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-l border-r dark:border-gray-600 min-w-[50px] text-center bg-white dark:bg-gray-900">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          disabled={loading}
                          className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <p className="text-lg font-semibold mb-4 text-center bg-gray-100 dark:bg-gray-800 py-2 rounded-lg">
                      Subtotal: <span className="text-green-600 dark:text-green-400">${((item.price * (item.quantity || 1)).toFixed(2))}</span>
                    </p>
                    
                    <div className="flex justify-center">
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200"
                      >
                        {loading ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Side (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white dark:bg-[#2c0a0a] p-6 rounded-lg shadow-xl border dark:border-gray-700">
                  <h3 className="text-2xl font-bold mb-6 text-center border-b pb-3 dark:border-gray-600">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Total Items:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{cartItems.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-bold">${calculateTotal()}</span>
                    </div>
                    
                    
                    
                    <div className="border-t pt-4 mt-4 dark:border-gray-600">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  
                  {/* Security Badge */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductCartSection;