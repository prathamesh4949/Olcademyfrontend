import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useWishlist } from '@/WishlistContext';
import { useCart } from '@/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { 
    wishlistItems, 
    removeFromWishlist, 
    clearWishlist, 
    moveToCart, 
    loading, 
    isInitialized, 
    refreshWishlist 
  } = useWishlist();
  const { isInCart } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (isInitialized && wishlistItems.length > 0) {
      refreshWishlist();
    }
  }, [isInitialized]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleMoveToCart = async (item) => {
    const success = await moveToCart(item.id);
    if (!success && !loading) {
      // Fallback: manually add to cart and remove from wishlist
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        selectedSize: item.selectedSize,
        personalization: null
      });
      if (isInCart(item.id, item.selectedSize)) {
        removeFromWishlist(item.id);
      }
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (!isInitialized) {
    return (
      <div className="bg-[#F5F5F5] dark:bg-[#220104] font-sans text-[#3b220c] dark:text-[#f6d110] min-h-screen">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79300f] dark:border-[#f6d110]"></div>
              <p className="text-xl">Loading wishlist...</p>
            </div>
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
          <h2 className="text-3xl font-bold flex items-center space-x-3">
            <FiHeart className="text-red-500" />
            <span>Your Wishlist</span>
          </h2>
          {wishlistItems && wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <FiTrash2 size={16} />
              <span>{loading ? 'Clearing...' : 'Clear Wishlist'}</span>
            </button>
          )}
        </div>

        {loading && (!wishlistItems || wishlistItems.length === 0) ? (
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#79300f] dark:border-[#f6d110]"></div>
              <p>Loading wishlist...</p>
            </div>
          </div>
        ) : (!wishlistItems || wishlistItems.length === 0) ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <FiHeart className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-xl mb-4">Your wishlist is empty.</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start adding products you love to your wishlist!</p>
            <button
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-6 py-3 rounded-lg shadow transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8 p-4 bg-gradient-to-r from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] rounded-lg border border-[#79300f]/20 dark:border-[#f6d110]/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-[#79300f] dark:text-[#f6d110]">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Wishlist
                  </p>
                  <p className="text-sm text-[#5a2408] dark:text-[#d4af37]">
                    Keep track of products you love
                  </p>
                </div>
                <FiHeart className="text-3xl text-red-500" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems && wishlistItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize || 'default'}`}
                  className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] p-4 rounded-lg shadow-lg border border-[#79300f]/20 dark:border-[#f6d110]/30 transition-transform hover:scale-105 relative group"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={loading}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-[#220104] rounded-full shadow-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                    title="Remove from wishlist"
                  >
                    <FiX size={16} />
                  </button>

                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[200px] w-full object-contain rounded-lg cursor-pointer"
                      loading="lazy"
                      onClick={() => handleProductClick(item.id)}
                    />
                    <div className="absolute top-2 left-2">
                      <div className="bg-red-500 text-white p-2 rounded-full shadow-md">
                        <FiHeart size={12} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 
                      className="text-lg font-semibold line-clamp-2 text-[#79300f] dark:text-[#f6d110] cursor-pointer hover:underline"
                      onClick={() => handleProductClick(item.id)}
                    >
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[#5a2408] dark:text-[#d4af37] line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.selectedSize && (
                      <p className="text-sm text-[#5a2408] dark:text-[#d4af37]">
                        Size: <span className="font-medium">{item.selectedSize}</span>
                      </p>
                    )}
                    <p className="text-xl font-bold text-[#79300f] dark:text-[#f6d110]">
                      ${item.price}
                    </p>
                    {item.addedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={loading || isInCart(item.id, item.selectedSize)}
                      className={`w-full font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                        isInCart(item.id, item.selectedSize)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white disabled:opacity-50'
                      }`}
                      title={isInCart(item.id, item.selectedSize) ? 'Already in cart' : 'Add to cart'}
                    >
                      <FiShoppingCart size={16} />
                      <span>
                        {loading ? 'Adding...' : 
                         isInCart(item.id, item.selectedSize) ? 'In Cart' : 'Add to Cart'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleContinueShopping}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>

            {loading && (
              <div className="fixed bottom-4 right-4 bg-white dark:bg-[#220104] p-4 rounded-lg shadow-lg border border-[#79300f]/20 dark:border-[#f6d110]/30">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#79300f] dark:border-[#f6d110]"></div>
                  <span className="text-sm text-[#5a2408] dark:text-[#d4af37]">Updating wishlist...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;