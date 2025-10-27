import React, { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { 
  ChevronRight, 
  Gift, 
  Heart, 
  Crown, 
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import ProductService from '@/services/productService';

const GiftCollection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { addToCart, isInCart } = useCart();
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

  // State for "View All" expanded sections
  const [expandedSections, setExpandedSections] = useState({
    for_her: false,
    for_him: false,
    by_price_under_50: false,
    by_price_under_100: false,
    by_price_under_200: false,
    home_gift: false,
    birthday_gift: false,
    wedding_gift: false
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

      setRetryCount(0);
    } catch (err) {
      console.error('❌ Error fetching gift data:', err);
      setError(err.message || 'Failed to load gift collections');
      
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

  // Toggle section expansion
  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  // Product Card Component - EXACT MATCH TO MEN'S PAGE
  const ProductCard = memo(({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    if (!product) return null;

    const productInCart = isInCart(product._id?.toString(), product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null);

    const handleAddToCart = async (e) => {
      e.stopPropagation();
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
        console.error('Add to cart error:', error);
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
        
        const wishlistProduct = {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-gift.png',
          description: product.description || '',
          category: product.category || '',
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

    const handleCardClick = () => {
      if (!product._id) {
        addNotification('Product not available', 'error');
        return;
      }
      navigate(`/product/${product._id.toString()}`);
    };

    const getProductImage = () => {
      if (isHovered && product.hoverImage && !imageError.hover) {
        return product.hoverImage;
      }
      if (product.images && Array.isArray(product.images) && product.images.length > 0 && !imageError.primary) {
        return product.images[0];
      }
      return '/images/default-gift.png';
    };

    const handleImageError = (e, type = 'primary') => {
      setImageError(prev => ({ ...prev, [type]: true }));
      e.target.src = '/images/default-gift.png';
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[331px]"
        style={{ height: 'auto', minHeight: '528px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Image Container with Wishlist Icon */}
        <div className="relative bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden w-full aspect-[331/273] p-3">
          <motion.img
            src={getProductImage()}
            alt={product.name || 'Product'}
            className="object-contain w-full h-full max-w-[248px] max-h-[248px]"
            onError={(e) => handleImageError(e, isHovered ? 'hover' : 'primary')}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
            loading="lazy"
          />
          
          {/* Wishlist Heart Icon */}
          <motion.button
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2.5 right-2.5 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 z-10 w-[27px] h-[27px] flex items-center justify-center"
            aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart
              size={14}
              className={`transition-all duration-200 ${isInWishlist(product._id) ? 'fill-red-600 text-red-600' : 'text-gray-700 dark:text-gray-300'}`}
            />
          </motion.button>
        </div>

        {/* Product Info Container */}
        <div className="px-3.5 py-3.5 flex flex-col gap-3.5">
          {/* Product Name */}
          <h3 
            className="font-bold uppercase text-center line-clamp-1 text-lg sm:text-xl md:text-2xl"
            style={{
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.05em',
              color: '#5A2408'
            }}
          >
            {product.name || 'Product'}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1">
            {product.rating ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    style={{ color: '#5A2408', fill: index < Math.floor(product.rating) ? '#5A2408' : 'transparent' }}
                    className={`${index < Math.floor(product.rating) ? '' : 'opacity-30'}`}
                  />
                ))}
              </>
            ) : (
              <div className="h-3.5"></div>
            )}
          </div>

          {/* Description */}
          <p 
            className="text-center line-clamp-2 text-sm sm:text-base"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: '500',
              letterSpacing: '0.02em',
              color: '#7E513A'
            }}
          >
            {product.description || 'Premium gift'}
          </p>

          {/* Price */}
          <p 
            className="font-bold text-center text-lg sm:text-xl"
            style={{
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '0.02em',
              color: '#431A06'
            }}
          >
            ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
          </p>

          {/* Add to Cart Button - FULL WIDTH */}
          <motion.button
            onClick={productInCart ? (e) => { e.stopPropagation(); navigate('/product-cart'); } : handleAddToCart}
            disabled={isAddingToCart}
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 sm:gap-2.5 text-white font-bold uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full h-[54px] sm:h-[60px] text-sm sm:text-base md:text-lg -mx-3.5 px-3.5"
            style={{
              backgroundColor: productInCart ? '#10B981' : '#431A06',
              fontFamily: 'Manrope, sans-serif',
              letterSpacing: '0.05em',
              width: 'calc(100% + 28px)'
            }}
          >
            <ShoppingCart size={20} className="sm:w-[24px] sm:h-[24px]" />
            <span>
              {isAddingToCart ? 'Adding...' : productInCart ? 'View Cart' : 'Add to Cart'}
            </span>
          </motion.button>
        </div>
      </motion.div>
    );
  });

  ProductCard.displayName = 'ProductCard';

  // Collection Section Component - WITH VIEW ALL BUTTON
  const CollectionSection = memo(({ title, collectionKey, visibleCount = 4 }) => {
    const products = collections[collectionKey] || [];
    const isExpanded = expandedSections[collectionKey];
    const displayProducts = isExpanded ? products : products.slice(0, 4);
    const hasMoreProducts = products.length > 4;

    return (
      <motion.section
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-[#F8F6F3] dark:bg-[#0d0603]"
        id={`collection-${collectionKey}`}
      >
        <div className="max-w-[1555px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-7 sm:mb-10 lg:mb-14"
          >
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: darkMode ? '#f6d110' : '#271004' }}>
              {title}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] rounded-full mx-auto"></div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 border-b-2 border-[#79300f]"></div>
            </div>
          ) : products.length > 0 ? (
            <>
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 mb-7 sm:mb-10 justify-items-center"
              >
                <AnimatePresence mode="popLayout">
                  {displayProducts.map((product) => {
                    if (!product || !product._id) return null;
                    return (
                      <ProductCard key={product._id} product={product} />
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* View All / Show Less Button */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-7 sm:mt-10 lg:mt-14">
                  <motion.button
                    onClick={() => toggleSection(collectionKey)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 transition-all duration-300 rounded-lg w-full max-w-[311px] h-[54px] sm:h-[60px] px-5 flex items-center justify-center"
                    style={{
                      borderColor: '#431A06',
                      backgroundColor: 'transparent',
                      color: '#431A06'
                    }}
                  >
                    <span
                      className="text-base sm:text-lg font-bold uppercase"
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {isExpanded ? 'Show Less' : 'View All Gifts'}
                    </span>
                  </motion.button>
                </div>
              )}
            </>
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

  // Enhanced Hero Banner
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5E9DC] via-[#E7DDC6] to-[#D4C5A9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        
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
              >
                <span className="text-lg">{bannerData.buttonText}</span>
                <ChevronRight size={20} />
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/wishlist-collection')}
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

  // Bottom Banners Section
  const BottomBannersSection = () => {
    const bottomBanners = banners.gift_highlight.slice(0, 3);
    
    const defaultBottomBanners = [
      {
        title: "Personalized Gifts",
        description: "Make it uniquely theirs with custom engraving and personalization options.",
        buttonText: "Personalize Now",
        buttonLink: "/personalized-gifts",
        image: "/images/personalized-banner.jpg"
      },
      {
        title: "Gift Cards Available",
        description: "When you can't decide, give them the choice with our luxury gift cards.",
        buttonText: "Buy Gift Cards",
        buttonLink: "/gift-cards", 
        image: "/images/gift-cards-banner.jpg"
      },
      {
        title: "Express Shipping",
        description: "Last minute? We've got you covered with same-day and next-day delivery.",
        buttonText: "Ship Express",
        buttonLink: "/shipping",
        image: "/images/express-shipping-banner.jpg"
      }
    ];

    const displayBanners = bottomBanners.length >= 3 ? bottomBanners : defaultBottomBanners;

    return (
      <motion.section
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="py-20 px-4 md:px-8 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-dm-serif text-[#79300f] dark:text-[#f6d110] mb-4">
              Why Choose Our Gifts?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] rounded-full mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {displayBanners.map((banner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/50 group cursor-pointer"
                onClick={() => {
                  if (banner._id) handleBannerClick(banner);
                  if (banner.buttonLink) {
                    if (banner.buttonLink.startsWith('#')) {
                      const element = document.querySelector(banner.buttonLink);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = banner.buttonLink;
                    }
                  }
                }}
              >
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-2xl">
                    <motion.img
                      src={banner.image || '/images/default-gift.png'}
                      alt={banner.title}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/default-gift.png';
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110] group-hover:text-[#5a2408] dark:group-hover:text-[#f6d110] transition-colors duration-300">
                      {banner.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {banner.description}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group-hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (banner._id) handleBannerClick(banner);
                        if (banner.buttonLink) {
                          if (banner.buttonLink.startsWith('#')) {
                            const element = document.querySelector(banner.buttonLink);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            window.location.href = banner.buttonLink;
                          }
                        }
                      }}
                    >
                      <span>{banner.buttonText}</span>
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  // Quick View Modal
  const QuickViewModal = () => {
    if (!quickViewProduct) return null;

    const handleClose = () => setQuickViewProduct(null);

    const handleQuickViewWishlist = () => {
      if (quickViewProduct._id) {
        try {
          const wishlistProduct = {
            id: quickViewProduct._id.toString(),
            name: quickViewProduct.name,
            price: quickViewProduct.price,
            image: quickViewProduct.images && quickViewProduct.images.length > 0 ? quickViewProduct.images[0] : '/images/default-gift.png',
            description: quickViewProduct.description || '',
            category: quickViewProduct.category || '',
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
        image: quickViewProduct.images && quickViewProduct.images.length > 0 ? quickViewProduct.images[0] : '/images/default-gift.png',
        quantity: 1,
        selectedSize: quickViewProduct.sizes && quickViewProduct.sizes.length > 0 ? quickViewProduct.sizes[0].size : null,
        personalization: null
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
        console.error('❌ Quick View Add to cart error:', error);
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
                  {productInQuickViewCart ? (
                    <button
                      onClick={() => {
                        navigate('/product-cart');
                        handleClose();
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 border border-emerald-400/30 shadow-emerald-500/20"
                    >
                      <ShoppingCart size={18} />
                      <span>View in Cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleQuickViewAddToCart}
                      className="flex-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={18} />
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
                      navigate(`/product/${quickViewProduct._id}`);
                      handleClose();
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

      <div id="collections">
        <CollectionSection
          title="Gifts For Her"
          collectionKey="for_her"
          visibleCount={4}
        />
      </div>

      <CollectionSection
        title="Gifts For Him"
        collectionKey="for_him"
        visibleCount={4}
      />

      <CollectionSection
        title="Gifts Under $50"
        collectionKey="by_price_under_50"
        visibleCount={4}
      />

      <CollectionSection
        title="Gifts Under $100"
        collectionKey="by_price_under_100"
        visibleCount={4}
      />

      <CollectionSection
        title="Gifts Under $200"
        collectionKey="by_price_under_200"
        visibleCount={4}
      />

      <CollectionSection
        title="Home & Living"
        collectionKey="home_gift"
        visibleCount={4}
      />

      <CollectionSection
        title="Birthday Celebrations"
        collectionKey="birthday_gift"
        visibleCount={4}
      />

      <CollectionSection
        title="Wedding Gifts"
        collectionKey="wedding_gift"
        visibleCount={4}
      />

      <BottomBannersSection />

      <Footer />
    </div>
  );
};

export default GiftCollection;