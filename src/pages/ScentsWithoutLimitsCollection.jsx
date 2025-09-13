import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import ScentService from '../services/scentService';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Star, 
  RefreshCw,
  Infinity,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { FiHeart } from 'react-icons/fi';

const ScentsWithoutLimitsCollection = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State management
  const [scents, setScents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Add notification helper
  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Fetch scents without limits (using limitless collection)
  const fetchScentsWithoutLimits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        isActive: true
      };

      const response = await ScentService.getLimitlessScents(params);
      
      if (response.success) {
        setScents(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.message || 'Failed to fetch scents without limits');
        setScents([]);
      }
    } catch (err) {
      console.error('Error fetching scents without limits:', err);
      setError('Failed to load scents without limits');
      setScents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Load scents on mount
  useEffect(() => {
    fetchScentsWithoutLimits();
  }, [fetchScentsWithoutLimits]);

  // Handle add to cart
  const handleAddToCart = async (scent, e) => {
    e.stopPropagation();

    if (!scent._id) {
      addNotification('Product information is incomplete', 'error');
      return;
    }

    const cartItem = {
      id: scent._id.toString(),
      name: scent.name,
      price: Number(scent.price),
      image: scent.images && scent.images.length > 0 ? scent.images[0] : '/images/default-scent.png',
      quantity: 1,
      selectedSize: scent.sizes && scent.sizes.length > 0 ? scent.sizes[0].size : null,
      personalization: null,
      brand: scent.brand || '',
      sku: scent.sku || ''
    };

    try {
      const success = await addToCart(cartItem);
      if (success) {
        addNotification(`Added ${scent.name} to cart!`, 'success');
      } else {
        addNotification('Failed to add item to cart', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      addNotification('Something went wrong. Please try again.', 'error');
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (scent, e) => {
    e.stopPropagation();
    
    if (!scent._id) {
      addNotification('Unable to add to wishlist', 'error');
      return;
    }

    try {
      const wasInWishlist = isInWishlist(scent._id);
      
      const wishlistProduct = {
        id: scent._id.toString(),
        name: scent.name,
        price: scent.price,
        image: scent.images && scent.images.length > 0 ? scent.images[0] : '/images/default-scent.png',
        description: scent.description || '',
        category: scent.category || '',
        brand: scent.brand || '',
        selectedSize: null
      };
      
      toggleWishlist(wishlistProduct);
      addNotification(
        wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
        'success'
      );
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      addNotification('Failed to update wishlist', 'error');
    }
  };

  // Navigate to product detail
  const handleProductClick = (scent) => {
    if (scent._id) {
      navigate(`/scent/${scent._id}`);
    }
  };

  // Handle Quick View
  const handleQuickView = (scent, e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Quick View clicked for scent:', scent._id, scent.name);
    if (scent && scent._id) {
      setQuickViewProduct(scent);
    } else {
      console.error('Invalid scent for Quick View:', scent);
      addNotification('Unable to show quick view', 'error');
    }
  };

  // Scent Card Component
  const ScentCard = memo(({ scent }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!scent) {
      console.warn('ScentCard: No scent data provided');
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl p-6">
          <div className="h-[250px] bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      );
    }

    const productInCart = isInCart(scent._id?.toString(), scent.sizes && scent.sizes.length > 0 ? scent.sizes[0].size : null);

    const handleAddToCartClick = async (e) => {
      e.stopPropagation();
      setIsAddingToCart(true);
      await handleAddToCart(scent, e);
      setIsAddingToCart(false);
    };

    const handleViewInCart = (e) => {
      e.stopPropagation();
      navigate('/product-cart');
    };

    const getProductImage = () => {
      if (isHovered && scent.hoverImage && !imageError.hover) {
        return scent.hoverImage;
      }
      if (scent.images && Array.isArray(scent.images) && scent.images.length > 0 && !imageError.primary) {
        return scent.images[0];
      }
      return '/images/default-scent.png';
    };

    const handleImageError = (e, type = 'primary') => {
      console.warn(`ScentCard (${scent._id}): Image error for ${type} image`, e.target.src);
      setImageError(prev => ({ ...prev, [type]: true }));
      setImageLoading(false);
      e.target.src = '/images/default-scent.png';
    };

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    return (
      <motion.div
        layout
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative border border-[#D4C5A9] dark:border-gray-600 group cursor-pointer backdrop-blur-sm flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleProductClick(scent)}
      >
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => handleWishlistToggle(scent, e)}
          className="absolute top-4 right-4 text-[#79300f] hover:text-red-600 dark:text-[#f6d110] dark:hover:text-red-400 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200"
          aria-label={isInWishlist(scent._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart size={18} className={isInWishlist(scent._id) ? 'fill-red-600 text-red-600' : ''} />
        </motion.button>

        {/* Quick View Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleQuickView(scent, e)}
              className="absolute top-4 right-16 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 z-10"
              aria-label="Quick view"
            >
              <Eye size={18} className="text-[#79300f] dark:text-[#f6d110]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Collection Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center space-x-1">
          <Infinity size={12} />
          <span>LIMITLESS</span>
        </div>

        {/* In Cart Badge */}
        {productInCart && (
          <div className="absolute top-12 left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 border border-emerald-400">
            ✓ IN CART
          </div>
        )}

        {/* Image Container */}
        <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-inner relative overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79300f]"></div>
            </div>
          )}
          <img 
            src={getProductImage()}
            alt={scent.name || 'Scent'} 
            className={`h-[250px] w-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
            onError={(e) => handleImageError(e, isHovered ? 'hover' : 'primary')}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          
          {/* Overlay on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl flex items-end justify-center pb-4"
              >
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  Click to view details
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-alata text-[#5a2408] dark:text-gray-200 font-bold leading-tight">
              {scent.name || 'Unnamed Scent'}
            </h3>
            {scent.rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {scent.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Brand */}
          {scent.brand && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              by {scent.brand}
            </p>
          )}
          
          {scent.description && (
            <p className="text-sm text-[#8b4513] dark:text-gray-400 leading-relaxed line-clamp-2">
              {scent.description}
            </p>
          )}

          {/* Scent Details */}
          <div className="flex flex-wrap gap-2 text-xs">
            {scent.scentFamily && (
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full capitalize">
                {scent.scentFamily}
              </span>
            )}
            {scent.intensity && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full capitalize">
                {scent.intensity}
              </span>
            )}
            {scent.concentration && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full capitalize">
                {scent.concentration}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <p className="text-xl font-bold text-[#79300f] dark:text-[#f6d110]">
                ${typeof scent.price === 'number' ? scent.price.toFixed(2) : '0.00'}
              </p>
              {scent.originalPrice && scent.originalPrice > scent.price && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${scent.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="bg-indigo-500/10 dark:bg-indigo-400/10 px-2 py-1 rounded-full">
              <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">LIMITLESS</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={productInCart ? handleViewInCart : handleAddToCartClick}
          disabled={isAddingToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4 ${
            productInCart 
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white border border-emerald-400/30 shadow-emerald-500/20'
              : 'bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white'
          }`}
        >
          {isAddingToCart ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : productInCart ? (
            <ShoppingCart size={18} />
          ) : (
            <ShoppingBag size={18} />
          )}
          <span>
            {isAddingToCart ? 'Adding...' : productInCart ? 'View in Cart' : 'Add to Cart'}
          </span>
        </motion.button>
      </motion.div>
    );
  });

  ScentCard.displayName = 'ScentCard';

  // Quick View Modal (same structure as Gender-Free collection)
  const QuickViewModal = () => {
    if (!quickViewProduct) {
      return null;
    }

    const handleClose = () => {
      setQuickViewProduct(null);
    };

    const handleQuickViewWishlist = () => {
      if (quickViewProduct._id) {
        try {
          const wishlistProduct = {
            id: quickViewProduct._id.toString(),
            name: quickViewProduct.name,
            price: quickViewProduct.price,
            image: quickViewProduct.images && quickViewProduct.images.length > 0 ? quickViewProduct.images[0] : '/images/default-scent.png',
            description: quickViewProduct.description || '',
            category: quickViewProduct.category || '',
            brand: quickViewProduct.brand || '',
            selectedSize: null
          };
          
          toggleWishlist(wishlistProduct);
          addNotification(
            isInWishlist(quickViewProduct._id) ? 'Removed from wishlist' : 'Added to wishlist!',
            'success'
          );
        } catch (error) {
          console.error('Wishlist toggle error:', error);
          addNotification('Failed to update wishlist', 'error');
        }
      } else {
        addNotification('Unable to update wishlist', 'error');
      }
    };

    const handleQuickViewAddToCart = async () => {
      if (!quickViewProduct._id) {
        addNotification('Product not available', 'error');
        return;
      }

      const cartItem = {
        id: quickViewProduct._id.toString(),
        name: quickViewProduct.name,
        price: Number(quickViewProduct.price),
        image: quickViewProduct.images && quickViewProduct.images.length > 0 ? quickViewProduct.images[0] : '/images/default-scent.png',
        quantity: 1,
        selectedSize: quickViewProduct.sizes && quickViewProduct.sizes.length > 0 ? quickViewProduct.sizes[0].size : null,
        personalization: null,
        brand: quickViewProduct.brand || '',
        sku: quickViewProduct.sku || ''
      };

      try {
        const success = await addToCart(cartItem);
        if (success) {
          addNotification(`Added ${quickViewProduct.name} to cart!`, 'success');
          handleClose();
        } else {
          addNotification('Failed to add item to cart', 'error');
        }
      } catch (error) {
        console.error('Quick View Add to cart error:', error);
        addNotification('Something went wrong. Please try again.', 'error');
      }
    };

    const productInQuickViewCart = isInCart(quickViewProduct._id?.toString(), quickViewProduct.sizes && quickViewProduct.sizes.length > 0 ? quickViewProduct.sizes[0].size : null);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110]">
                Quick View
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                aria-label="Close quick view"
              >
                ×
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={quickViewProduct.images?.[0] || '/images/default-scent.png'}
                  alt={quickViewProduct.name || 'Scent'}
                  className="w-full h-64 object-contain rounded-2xl bg-gray-100 dark:bg-gray-700"
                  onError={(e) => {
                    e.target.src = '/images/default-scent.png';
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {quickViewProduct.name || 'Unnamed Scent'}
                </h4>
                {quickViewProduct.brand && (
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    by {quickViewProduct.brand}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {quickViewProduct.description || 'No description available'}
                </p>
                <p className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110]">
                  ${quickViewProduct.price ? quickViewProduct.price.toFixed(2) : '0.00'}
                </p>
                
                {/* Scent Details */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {quickViewProduct.scentFamily && (
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full capitalize">
                      {quickViewProduct.scentFamily}
                    </span>
                  )}
                  {quickViewProduct.intensity && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full capitalize">
                      {quickViewProduct.intensity}
                    </span>
                  )}
                  {quickViewProduct.concentration && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full capitalize">
                      {quickViewProduct.concentration}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-4">
                  {productInQuickViewCart ? (
                    <button
                      onClick={() => {
                        navigate('/product-cart');
                        handleClose();
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 border border-emerald-400/30 shadow-emerald-500/20"
                    >
                      <ShoppingCart size={20} />
                      <span>View in Cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleQuickViewAddToCart}
                      className="flex-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag size={20} />
                      <span>Add to Cart</span>
                    </button>
                  )}
                  <button
                    onClick={handleQuickViewWishlist}
                    className="px-4 py-3 border-2 border-[#79300f] text-[#79300f] rounded-xl hover:bg-[#79300f] hover:text-white transition-all duration-300"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} className={isInWishlist(quickViewProduct._id) ? 'fill-red-600 text-red-600' : ''} />
                  </button>
                  <button
                    onClick={() => {
                      if (quickViewProduct._id) {
                        navigate(`/scent/${quickViewProduct._id}`);
                        handleClose();
                      } else {
                        addNotification('Product details not available', 'error');
                      }
                    }}
                    className="px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-300 hover:text-gray-800 transition-all duration-300"
                    aria-label="View full details"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Notification System
  const NotificationSystem = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border max-w-sm ${
              notification.type === 'success' 
                ? 'bg-green-500/90 text-white border-green-400' 
                : 'bg-red-500/90 text-white border-red-400'
            }`}
          >
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] dark:bg-gray-900">
      <Header />
      <NotificationSystem />
      <QuickViewModal />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Infinity size={48} />
                <h1 className="text-5xl md:text-6xl font-dm-serif font-bold">
                  Scents Without Limits
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Break free from conventional boundaries. Explore an infinite world of possibilities 
                with fragrances that know no limits, crafted for the boundless spirit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Something went wrong
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                  onClick={fetchScentsWithoutLimits}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : scents.length === 0 ? (
              <div className="text-center py-16">
                <Infinity size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No limitless scents found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please try again later.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {scents.length} of {totalPages * itemsPerPage} limitless scents
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {scents.map((scent) => {
                    if (!scent || !scent._id) {
                      console.warn('Invalid scent:', scent);
                      return null;
                    }
                    return (
                      <ScentCard key={scent._id} scent={scent} />
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNum
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScentsWithoutLimitsCollection;