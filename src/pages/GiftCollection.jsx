import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Gift, 
  Heart, 
  Crown, 
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import ProductService from '@/services/productService';

const GiftCollection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State for gift collections from backend
  const [collections, setCollections] = useState({
    for_her: [],
    for_him: [],
    by_price_under_50: [],
    by_price_under_100: [],
    by_price_under_200: [],
    home_gift: [],
    birthday_gift: [],
    wedding_gift: []
  });

  // State for banners from backend
  const [banners, setBanners] = useState({
    hero: null,
    gift_highlight: []
  });

  // Enhanced state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cartNotifications, setCartNotifications] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    priceRange: 'all',
    category: 'all',
    sortBy: 'featured'
  });

  // State for carousel navigation with better management
  const [carouselStates, setCarouselStates] = useState({
    for_her: 0,
    for_him: 0,
    by_price_under_50: 0,
    by_price_under_100: 0,
    by_price_under_200: 0,
    home_gift: 0,
    birthday_gift: 0,
    wedding_gift: 0
  });

  // Load theme preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Enhanced notification system
  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setCartNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setCartNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Enhanced fetch function with retry logic
  const fetchGiftData = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);
      if (!isRetry) setError(null);

      console.log('🔍 Fetching gift collection data...');

      const [productsResponse, bannersResponse] = await Promise.all([
        ProductService.getGiftCollections().catch(err => {
          console.error('Products fetch error:', err);
          return { success: false, error: err.message };
        }),
        ProductService.getGiftBanners().catch(err => {
          console.error('Banners fetch error:', err);
          return { success: false, error: err.message };
        })
      ]);

      // Handle products with better error checking
      if (productsResponse.success && productsResponse.data) {
        const safeCollections = Object.keys(collections).reduce((acc, key) => {
          acc[key] = Array.isArray(productsResponse.data[key]) ? productsResponse.data[key] : [];
          return acc;
        }, {});

        console.log('✅ Gift Collections processed successfully');
        setCollections(safeCollections);
      } else {
        throw new Error(productsResponse.error || 'Failed to load gift collections');
      }

      // Handle banners
      if (bannersResponse.success && bannersResponse.data) {
        const bannersByType = {
          hero: null,
          gift_highlight: []
        };

        (bannersResponse.data || []).forEach(banner => {
          if (banner.type === 'hero') {
            bannersByType.hero = banner;
          } else if (banner.type === 'gift_highlight') {
            bannersByType.gift_highlight.push(banner);
          }
        });

        setBanners(bannersByType);
      }

      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('❌ Error fetching gift data:', err);
      setError(err.message || 'Failed to load gift collections');
      
      // Show user-friendly error message
      if (!isRetry) {
        addNotification('Failed to load some content. Please try refreshing the page.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [collections, addNotification]);

  // Initial data fetch
  useEffect(() => {
    fetchGiftData();
  }, []);

  // Retry mechanism
  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchGiftData(true);
    }
  }, [retryCount, fetchGiftData]);

  // Handle banner click tracking
  const handleBannerClick = useCallback(async (banner) => {
    if (banner && banner._id) {
      try {
        await ProductService.trackBannerClick(banner._id);
      } catch (error) {
        console.error('Error tracking banner click:', error);
      }
    }
  }, []);

  // Enhanced carousel navigation
  const updateCarouselIndex = useCallback((collection, direction) => {
    setCarouselStates(prev => {
      const products = collections[collection] || [];
      const visibleCount = 4;
      const currentIndex = prev[collection] || 0;
      
      let newIndex = currentIndex;
      if (direction === 'next' && products.length > visibleCount) {
        newIndex = Math.min(currentIndex + 1, products.length - visibleCount);
      } else if (direction === 'prev' && products.length > visibleCount) {
        newIndex = Math.max(currentIndex - 1, 0);
      }
      
      return { ...prev, [collection]: newIndex };
    });
  }, [collections]);

  // Enhanced Product Card Component with better UX
  const ProductCard = memo(({ product, isCompact = false, collectionName = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!product) {
      return (
        <div className={`${isCompact ? 'w-[300px]' : 'w-full'} bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl p-6`}>
          <div className="h-[200px] bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      );
    }

    const validateProduct = (product) => {
      const requiredFields = ['_id', 'name', 'price'];
      return requiredFields.every(field => product[field]);
    };

    const handleAddToCart = async (e) => {
      e.stopPropagation();

      if (!validateProduct(product)) {
        addNotification('Product information is incomplete', 'error');
        return;
      }

      setIsAddingToCart(true);

      const cartItem = {
        id: product._id.toString(),
        name: product.name,
        price: Number(product.price),
        image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-gift.png',
        quantity: 1,
        selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null,
        personalization: null
      };

      try {
        const success = await addToCart(cartItem);
        if (success) {
          addNotification(`Added ${product.name} to cart!`, 'success');
        } else {
          addNotification('Failed to add item to cart', 'error');
        }
      } catch (error) {
        console.error('❌ Add to cart error:', error);
        addNotification('Something went wrong. Please try again.', 'error');
      } finally {
        setIsAddingToCart(false);
      }
    };

    const handleWishlistToggle = (e) => {
      e.stopPropagation();

      if (!product._id) {
        addNotification('Unable to add to wishlist', 'error');
        return;
      }

      try {
        const wasInWishlist = isInWishlist(product._id);
        toggleWishlist(product);
        addNotification(
          wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
          'success'
        );
      } catch (error) {
        addNotification('Failed to update wishlist', 'error');
      }
    };

    const handleCardClick = () => {
      if (!product._id) {
        addNotification('Product not available', 'error');
        return;
      }

      const productId = product._id.toString();
      try {
        navigate(`/product/${productId}`);
      } catch (error) {
        console.error('❌ Navigation error:', error);
        window.location.href = `/product/${productId}`;
      }
    };

    const handleQuickView = (e) => {
      e.stopPropagation();
      setQuickViewProduct(product);
    };

    const getProductImage = () => {
      if (imageError) return '/images/default-gift.png';
      if (isHovered && product.hoverImage) return product.hoverImage;
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      }
      return '/images/default-gift.png';
    };

    const handleImageError = (e) => {
      setImageError(true);
      setImageLoading(false);
      e.target.src = '/images/default-gift.png';
    };

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    return (
      <motion.div
        layout
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className={`bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative flex-shrink-0 border border-[#D4C5A9] dark:border-gray-600 group cursor-pointer ${isCompact ? 'w-[300px]' : 'w-full'} backdrop-blur-sm`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 text-[#79300f] hover:text-red-600 dark:text-[#f6d110] dark:hover:text-red-400 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200"
          aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart
            size={18}
            className={isInWishlist(product._id) ? 'fill-red-600 text-red-600' : ''}
          />
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
              onClick={handleQuickView}
              className="absolute top-4 right-16 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 z-10"
              aria-label="Quick view"
            >
              <Eye size={18} className="text-[#79300f] dark:text-[#f6d110]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Product Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
            NEW
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
            alt={product.name || 'Gift'}
            className={`${isCompact ? 'h-[200px]' : 'h-[300px]'} w-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={handleImageError}
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
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-alata text-[#5a2408] dark:text-gray-200 font-bold leading-tight`}>
              {product.name || 'Unnamed Gift'}
            </h3>
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {product.description && (
            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-[#8b4513] dark:text-gray-400 leading-relaxed line-clamp-2`}>
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <p className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-[#79300f] dark:text-[#f6d110]`}>
                ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="bg-[#79300f]/10 dark:bg-[#f6d110]/10 px-2 py-1 rounded-full">
              <span className="text-xs text-[#79300f] dark:text-[#f6d110] font-medium">
                PREMIUM
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isAddingToCart ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <ShoppingBag size={18} />
          )}
          <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
        </motion.button>
      </motion.div>
    );
  });

  ProductCard.displayName = 'ProductCard';

  // Enhanced Collection Section with better loading states
  const CollectionSection = memo(({ title, collectionKey, visibleCount = 4, accent = "rose" }) => {
    const products = collections[collectionKey] || [];
    const index = carouselStates[collectionKey] || 0;
    const cardWidth = 300;
    const gap = 24;

    const canNavigateNext = products.length > visibleCount && index < products.length - visibleCount;
    const canNavigatePrev = products.length > visibleCount && index > 0;

    const handleNext = () => canNavigateNext && updateCarouselIndex(collectionKey, 'next');
    const handlePrev = () => canNavigatePrev && updateCarouselIndex(collectionKey, 'prev');

    return (
      <motion.section
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="py-16 px-6 bg-[#F2F2F2] dark:bg-[#0d0603]"
        id={`collection-${collectionKey}`}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-dm-serif text-[#79300f] dark:text-[#f6d110] mb-4">
              {title}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] rounded-full mx-auto"></div>
          </motion.div>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, idx) => (
                <ProductCard key={idx} product={null} isCompact={true} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <motion.div
                  className="flex flex-nowrap gap-6 transition-transform duration-500 ease-out will-change-transform"
                  style={{ transform: `translateX(-${index * (cardWidth + gap)}px)` }}
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product, idx) => (
                      <ProductCard 
                        key={`${product._id}-${idx}`} 
                        product={product} 
                        isCompact={true} 
                        collectionName={collectionKey}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Navigation Controls */}
              <AnimatePresence>
                {products.length > visibleCount && (
                  <>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: canNavigatePrev ? 1 : 0.3 }}
                      onClick={handlePrev}
                      disabled={!canNavigatePrev}
                      whileHover={{ scale: canNavigatePrev ? 1.1 : 1 }}
                      whileTap={{ scale: canNavigatePrev ? 0.9 : 1 }}
                      className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed z-10"
                      aria-label="Previous products"
                    >
                      <ChevronLeft size={28} />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: canNavigateNext ? 1 : 0.3 }}
                      onClick={handleNext}
                      disabled={!canNavigateNext}
                      whileHover={{ scale: canNavigateNext ? 1.1 : 1 }}
                      whileTap={{ scale: canNavigateNext ? 0.9 : 1 }}
                      className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed z-10"
                      aria-label="Next products"
                    >
                      <ChevronRight size={28} />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>

              {/* Progress Indicator */}
              {products.length > visibleCount && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(Math.ceil((products.length - visibleCount + 1)))].map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCarouselStates(prev => ({ ...prev, [collectionKey]: idx }))}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === idx 
                          ? 'bg-[#79300f] scale-125' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Gift size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                No products available in this collection.
              </p>
              <motion.button
                onClick={() => handleRetry()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>
    );
  });

  CollectionSection.displayName = 'CollectionSection';

  // Enhanced Hero Banner with better interaction
  const HeroBanner = ({ banner }) => {
    const defaultHeroBanner = {
      title: 'Luxury Gifts',
      subtitle: 'Premium Collection',
      description: 'From the crisp of the tissue paper to the last loop of the bow, it has to be just right. Whether it\'s a token of appreciation or the grandest of gestures.',
      buttonText: 'Shop Now',
      buttonLink: '#collections',
      backgroundImage: '/images/gift-hero-bg.jpg'
    };

    const bannerData = banner || defaultHeroBanner;

    const handleClick = () => {
      if (banner) {
        handleBannerClick(banner);
      }
      if (bannerData.buttonLink) {
        if (bannerData.buttonLink.startsWith('#')) {
          const element = document.querySelector(bannerData.buttonLink);
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = bannerData.buttonLink;
        }
      }
    };

    return (
      <motion.section
        variants={fadeIn('down', 0.3)}
        initial="hidden"
        animate="show"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5E9DC] via-[#E7DDC6] to-[#D4C5A9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-4 h-4 bg-[#79300f]/30 rounded-full blur-sm"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 px-6 py-3 rounded-full border border-[#D4C5A9] dark:border-gray-600"
              >
                <Crown className="text-[#79300f] dark:text-[#f6d110]" size={20} />
                <span className="text-[#79300f] dark:text-[#f6d110] font-semibold text-sm uppercase tracking-wider">
                  {bannerData.subtitle}
                </span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  Perfect
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
                  {bannerData.title}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                {bannerData.description}
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                aria-label="Start shopping for gifts"
              >
                <span className="text-lg">{bannerData.buttonText}</span>
                <ChevronRight size={20} />
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/wishlist')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#79300f] hover:text-[#79300f] dark:hover:border-[#f6d110] dark:hover:text-[#f6d110] font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                aria-label="View your wishlist"
              >
                <Heart size={20} />
                <span className="text-lg">View Wishlist</span>
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                src={bannerData.backgroundImage}
                alt="Gift Hero"
                className="w-full h-auto max-h-[700px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
                onError={(e) => {
                  e.target.src = '/images/default-gift-hero.png';
                }}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#79300f]/10 via-transparent to-[#5a2408]/10"></div>
            </div>
            
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#79300f]/30 to-[#5a2408]/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-tr from-[#5a2408]/30 to-[#79300f]/30 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </motion.section>
    );
  };

  // Enhanced Featured Collection Banner
  const FeaturedCollectionBanner = ({ banner, index }) => {
    if (!banner) return null;

    const handleClick = () => {
      handleBannerClick(banner);
      if (banner.buttonLink) {
        if (banner.buttonLink.startsWith('#')) {
          const element = document.querySelector(banner.buttonLink);
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = banner.buttonLink;
        }
      }
    };

    const isReversed = index % 2 === 1;

    return (
      <motion.section
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 px-4 md:px-8 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-16 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
            <motion.div
              initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`space-y-8 ${isReversed ? 'lg:col-start-2 text-center lg:text-right' : 'text-center lg:text-left'}`}
            >
              {banner.subtitle && (
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 px-6 py-3 rounded-full border border-[#D4C5A9] dark:border-gray-600">
                  <Crown className="text-[#79300f] dark:text-[#f6d110]" size={16} />
                  <span className="text-[#79300f] dark:text-[#f6d110] font-semibold text-sm uppercase tracking-wider">
                    {banner.subtitle}
                  </span>
                </div>
              )}
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
                  {banner.title}
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                {banner.description}
              </p>
              
              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3"
              >
                <span className="text-lg">{banner.buttonText || 'Explore Collection'}</span>
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`relative ${isReversed ? 'lg:col-start-1' : ''}`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <motion.img
                  src={banner.image || '/images/default-gift.png'}
                  alt={banner.altText || banner.title}
                  className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.7 }}
                  onError={(e) => {
                    e.target.src = '/images/default-gift.png';
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#79300f]/20 to-[#5a2408]/20 opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  };

  // Quick View Modal
  const QuickViewModal = () => {
    if (!quickViewProduct) return null;

    const handleClose = () => setQuickViewProduct(null);

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
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close quick view"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={quickViewProduct.images?.[0] || '/images/default-gift.png'}
                  alt={quickViewProduct.name}
                  className="w-full h-64 object-contain rounded-2xl bg-gray-100 dark:bg-gray-700"
                  onError={(e) => {
                    e.target.src = '/images/default-gift.png';
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {quickViewProduct.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {quickViewProduct.description}
                </p>
                <p className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110]">
                  ${quickViewProduct.price.toFixed(2)}
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      navigate(`/product/${quickViewProduct._id}`);
                      handleClose();
                    }}
                    className="flex-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className="px-4 py-3 border-2 border-[#79300f] text-[#79300f] rounded-xl hover:bg-[#79300f] hover:text-white transition-all duration-300"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} />
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
        {cartNotifications.map((notification) => (
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

  // Enhanced Error State
  const ErrorState = () => (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0d0603] text-[#79300f] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex justify-center items-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{error}</p>
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>{retryCount >= 3 ? 'Too many retries' : 'Try Again'}</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  // Loading State
  const LoadingState = () => (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0d0603]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex justify-center items-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-[#79300f]/30 border-t-[#79300f] mx-auto mb-8"></div>
            <Gift size={48} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#79300f]" />
          </div>
          <h2 className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110] mb-4">
            Loading Gift Collections
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Finding the perfect gifts for you...
          </p>
        </motion.div>
      </div>
    </div>
  );

  // Main render logic
  if (error && !loading) {
    return <ErrorState />;
  }

  if (loading && Object.values(collections).every(collection => collection.length === 0)) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0d0603] text-[#79300f] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <NotificationSystem />
      <QuickViewModal />

      <HeroBanner banner={banners.hero} />

      {banners.gift_highlight.length > 0 && (
        <FeaturedCollectionBanner banner={banners.gift_highlight[0]} index={0} />
      )}

      <div id="collections">
        <CollectionSection
          title="Gifts For Her"
          collectionKey="for_her"
          visibleCount={4}
          accent="rose"
        />
      </div>

      {banners.gift_highlight.length > 1 && (
        <FeaturedCollectionBanner banner={banners.gift_highlight[1]} index={1} />
      )}

      <CollectionSection
        title="Gifts For Him"
        collectionKey="for_him"
        visibleCount={4}
        accent="blue"
      />

      <motion.section
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="py-24 px-4 md:px-8 relative"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#79300f] to-[#5a2408] rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">$</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-dm-serif bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
                Shop by Budget
              </h2>
              <div className="w-12 h-12 bg-gradient-to-br from-[#5a2408] to-[#79300f] rounded-full flex items-center justify-center">
                <Gift className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Find the perfect gift within your budget - luxury doesn't have to break the bank
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] rounded-full mx-auto mt-6"></div>
          </motion.div>

          <div className="space-y-24">
            <CollectionSection
              title="Under $50"
              collectionKey="by_price_under_50"
              visibleCount={4}
              accent="emerald"
            />
            
            {banners.gift_highlight.length > 2 && (
              <FeaturedCollectionBanner banner={banners.gift_highlight[2]} index={2} />
            )}
            
            <CollectionSection
              title="Under $100"
              collectionKey="by_price_under_100"
              visibleCount={4}
              accent="amber"
            />
            <CollectionSection
              title="Under $200"
              collectionKey="by_price_under_200"
              visibleCount={4}
              accent="purple"
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="py-24 px-4 md:px-8 relative"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#79300f] to-[#5a2408] rounded-full flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-dm-serif bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
                Special Occasions
              </h2>
              <div className="w-12 h-12 bg-gradient-to-br from-[#5a2408] to-[#79300f] rounded-full flex items-center justify-center">
                <Gift className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Celebrate life's precious moments with gifts that create lasting memories
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] rounded-full mx-auto mt-6"></div>
          </motion.div>

          <div className="space-y-24">
            <CollectionSection
              title="Home & Living"
              collectionKey="home_gift"
              visibleCount={4}
              accent="emerald"
            />
            <CollectionSection
              title="Birthday Celebrations"
              collectionKey="birthday_gift"
              visibleCount={4}
              accent="purple"
            />
            <CollectionSection
              title="Wedding Gifts"
              collectionKey="wedding_gift"
              visibleCount={4}
              accent="rose"
            />
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default GiftCollection;