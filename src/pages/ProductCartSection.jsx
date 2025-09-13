import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/CartContext';
import { toast } from 'react-hot-toast';

const ProductCartSection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading, isInitialized, refreshCart } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Refresh cart data when component mounts to get latest stock info
  useEffect(() => {
    if (isInitialized && cartItems.length > 0) {
      refreshCart();
    }
  }, [isInitialized]);

  // Calculate total price - with safety check
  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return '0.00';
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1 || isUpdatingQuantity) return;
    
    const item = cartItems.find(cartItem => cartItem.id === id);
    if (!item) return;

    // Check if the new quantity exceeds available stock
    const availableStock = item.availableStock || 0;
    
    if (availableStock === 0) {
      toast.error('This product is currently out of stock');
      return;
    }

    if (newQuantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    setIsUpdatingQuantity(true);
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleCheckout = () => {
    // Check if any items are out of stock before checkout
    const outOfStockItems = cartItems.filter(item => item.outOfStock || item.exceedsStock);
    
    if (outOfStockItems.length > 0) {
      toast.error('Please remove out of stock items before checkout');
      return;
    }

    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/'); // Navigate to home page instead of products
  };

  // Enhanced product click handler that works for both products and scents
  const handleProductClick = (item) => {
    if (!item || !item.id) {
      console.error('Invalid item for navigation:', item);
      return;
    }

    // Check if the item has source information
    if (item.source === 'scent' || item.collection === 'trending' || item.collection === 'best-seller' || 
        item.collection === 'signature' || item.collection === 'limited-edition') {
      // Navigate to scent detail page
      navigate(`/scent/${item.id}`);
    } else if (item.source === 'product') {
      // Navigate to product detail page
      navigate(`/product/${item.id}`);
    } else {
      // Fallback: try to determine from the item structure
      // If item has scent-specific fields, treat as scent
      if (item.scentFamily || item.intensity || item.concentration || item.brand) {
        navigate(`/scent/${item.id}`);
      } else {
        // Default to product page
        navigate(`/product/${item.id}`);
      }
    }
  };

  // Show loading state while cart is initializing
  if (!isInitialized) {
    return (
      <div className="bg-[#F5F5F5] dark:bg-[#220104] font-sans text-[#3b220c] dark:text-[#f6d110] min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79300f] dark:border-[#f6d110]"></div>
              <p className="text-xl">Loading cart...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

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
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow disabled:opacity-50 transition-colors"
            >
              {loading ? 'Clearing...' : 'Clear Cart'}
            </button>
          )}
        </div>

        {loading && (!cartItems || cartItems.length === 0) ? (
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#79300f] dark:border-[#f6d110]"></div>
              <p>Loading cart...</p>
            </div>
          </div>
        ) : (!cartItems || cartItems.length === 0) ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h12.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <p className="text-xl mb-4">Your cart is empty.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow transition-colors"
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
                  <div key={`${item.id}-${item.selectedSize || 'default'}`} className={`bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] p-4 rounded-lg shadow-lg border dark:border-[#79300f]/30 transition-transform hover:scale-105 ${item.outOfStock || item.exceedsStock ? 'opacity-75 border-red-300 dark:border-red-600' : 'border-[#79300f]/20'}`}>
                    
                    {/* Out of Stock Badge */}
                    {(item.outOfStock || item.exceedsStock) && (
                      <div className="mb-2">
                        <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-200">
                          {item.outOfStock ? 'Out of Stock' : 'Exceeds Available Stock'}
                        </span>
                      </div>
                    )}

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[200px] w-full object-contain mb-3 rounded-lg cursor-pointer"
                      loading="lazy"
                      onClick={() => handleProductClick(item)}
                    />
                    <h3 
                      className="text-lg font-semibold mb-2 line-clamp-2 text-[#79300f] dark:text-[#f6d110] cursor-pointer hover:underline"
                      onClick={() => handleProductClick(item)}
                    >
                      {item.name}
                    </h3>
                    
                    {/* Selected Size Display */}
                    {item.selectedSize && (
                      <p className="text-sm text-[#5a2408] dark:text-[#d4af37] mb-2">
                        Size: <span className="font-medium">{item.selectedSize}</span>
                      </p>
                    )}
                    
                    <p className="text-xl font-bold text-[#79300f] dark:text-[#f6d110] mb-3">
                      ${item.price}
                    </p>
                    
                    {/* Stock Information */}
                    <div className="mb-3 text-sm">
                      <p className={`${item.availableStock && item.availableStock <= 5 && item.availableStock > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-[#5a2408] dark:text-[#d4af37]'}`}>
                        {item.outOfStock ? (
                          <span className="text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
                        ) : (
                          <>
                            Available: <span className="font-medium">{item.availableStock || 'N/A'}</span>
                            {item.availableStock && item.availableStock <= 5 && (
                              <span className="ml-2 text-orange-600 dark:text-orange-400 font-medium">
                                (Low Stock!)
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-[#79300f] dark:text-[#f6d110]">Quantity:</span>
                      <div className="flex items-center border rounded-lg border-[#79300f]/30 dark:border-[#f6d110]/30 bg-[#faf8f5] dark:bg-[#2c0f06]">
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          disabled={loading || isUpdatingQuantity || (item.quantity || 1) <= 1}
                          className="px-3 py-1 hover:bg-[#79300f]/10 dark:hover:bg-[#f6d110]/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg text-[#79300f] dark:text-[#f6d110] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-l border-r border-[#79300f]/30 dark:border-[#f6d110]/30 min-w-[50px] text-center bg-white dark:bg-[#1a0704] text-[#79300f] dark:text-[#f6d110]">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          disabled={
                            loading || 
                            isUpdatingQuantity ||
                            item.outOfStock || 
                            (item.availableStock && (item.quantity || 1) >= item.availableStock)
                          }
                          className={`px-3 py-1 hover:bg-[#79300f]/10 dark:hover:bg-[#f6d110]/10 disabled:opacity-50 rounded-r-lg disabled:cursor-not-allowed text-[#79300f] dark:text-[#f6d110] transition-colors ${
                            item.outOfStock || (item.availableStock && (item.quantity || 1) >= item.availableStock) 
                              ? 'bg-red-100 dark:bg-red-900' 
                              : ''
                          }`}
                          title={
                            item.outOfStock 
                              ? 'Product is out of stock' 
                              : (item.availableStock && (item.quantity || 1) >= item.availableStock) 
                                ? 'Maximum available quantity reached' 
                                : 'Increase quantity'
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Stock Warning Messages */}
                    {item.exceedsStock && (
                      <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-xs text-red-600 dark:text-red-400 text-center">
                          Quantity exceeds available stock. Please reduce quantity.
                        </p>
                      </div>
                    )}

                    {/* Subtotal */}
                    <p className="text-lg font-semibold mb-4 text-center bg-[#79300f]/10 dark:bg-[#f6d110]/10 py-2 rounded-lg text-[#79300f] dark:text-[#f6d110]">
                      Subtotal: <span className="text-[#79300f] dark:text-[#f6d110]">${((item.price * (item.quantity || 1)).toFixed(2))}</span>
                    </p>
                    
                    <div className="flex justify-center">
                      {/* Remove Button - Updated with professional color */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                        className="bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium py-2 px-6 rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200"
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
                <div className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] p-6 rounded-lg shadow-xl border border-[#79300f]/20 dark:border-[#f6d110]/30">
                  <h3 className="text-2xl font-bold mb-6 text-center border-b pb-3 border-[#79300f]/30 dark:border-[#f6d110]/30 text-[#79300f] dark:text-[#f6d110]">Order Summary</h3>
                  
                  {/* Stock Issues Warning */}
                  {cartItems.some(item => item.outOfStock || item.exceedsStock) && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">Stock Issues Detected</p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Some items are out of stock or exceed available quantity. Please review your cart.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-[#79300f]/10 dark:bg-[#f6d110]/10 rounded-lg">
                      <span className="font-medium text-[#79300f] dark:text-[#f6d110]">Total Items:</span>
                      <span className="font-bold text-[#79300f] dark:text-[#f6d110]">{cartItems.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-[#79300f]/10 dark:bg-[#f6d110]/10 rounded-lg">
                      <span className="font-medium text-[#79300f] dark:text-[#f6d110]">Subtotal:</span>
                      <span className="font-bold text-[#79300f] dark:text-[#f6d110]">${calculateTotal()}</span>
                    </div>
                    
                    <div className="border-t pt-4 mt-4 border-[#79300f]/30 dark:border-[#f6d110]/30">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#79300f]/20 to-[#5a2408]/20 dark:from-[#f6d110]/20 dark:to-[#d4af37]/20 rounded-lg">
                        <span className="text-lg font-bold text-[#79300f] dark:text-[#f6d110]">Total:</span>
                        <span className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110]">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleCheckout}
                      disabled={cartItems.some(item => item.outOfStock || item.exceedsStock) || loading || isUpdatingQuantity}
                      className="w-full bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      title={cartItems.some(item => item.outOfStock || item.exceedsStock) ? 'Please resolve stock issues before checkout' : 'Proceed to checkout'}
                    >
                      {cartItems.some(item => item.outOfStock || item.exceedsStock) ? 'Resolve Stock Issues' : 'Proceed to Checkout'}
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
                    <div className="inline-flex items-center space-x-2 text-sm text-[#5a2408] dark:text-[#d4af37] bg-[#79300f]/10 dark:bg-[#f6d110]/10 px-3 py-2 rounded-full">
                      <svg className="w-4 h-4 text-[#79300f] dark:text-[#f6d110]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Secure Checkout</span>
                    </div>
                  </div>

                  {/* Loading indicator for quantity updates */}
                  {(loading || isUpdatingQuantity) && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center space-x-2 text-sm text-[#5a2408] dark:text-[#d4af37]">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#79300f] dark:border-[#f6d110]"></div>
                        <span>Updating cart...</span>
                      </div>
                    </div>
                  )}
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