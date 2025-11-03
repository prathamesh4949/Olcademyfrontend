import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '../../components/ui/Button';
import ProductCartSection from '../../pages/ProductCartSection'; // ADD THIS IMPORT
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { Star, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import ProductService from '../../services/productService';

const WomensCollection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // ADD THIS STATE FOR CART SIDEBAR
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // State for products from backend
  const [collections, setCollections] = useState({
    just_arrived: [],
    best_sellers: [],
    huntsman_savile_row: []
  });
  
  // State for banners from backend
  const [banners, setBanners] = useState({
    hero: null,
    product_highlight: [],
    collection_highlight: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for "View All" expanded sections
  const [expandedSections, setExpandedSections] = useState({
    just_arrived: false,
    best_sellers: false,
    huntsman_savile_row: false
  });

  // Enhanced state management
  const [cartNotifications, setCartNotifications] = useState([]);

  // Enhanced notification system
  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setCartNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setCartNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Load theme preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fetch products and banners from backend
  useEffect(() => {
    const fetchWomensData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching women\'s collection data...');
        
        // Fetch both products and banners
        const [productsResponse, bannersResponse] = await Promise.all([
          ProductService.getWomensCollections().catch(err => {
            console.error('Products fetch error:', err);
            return { success: false, error: err.message };
          }),
          ProductService.getWomensBanners().catch(err => {
            console.error('Banners fetch error:', err);
            return { success: false, error: err.message };
          })
        ]);
        
        console.log('Women\'s Products Response:', productsResponse);
        console.log('Women\'s Banners Response:', bannersResponse);
        
        // Handle products
        if (productsResponse.success && productsResponse.data) {
          const safeCollections = {
            just_arrived: productsResponse.data.just_arrived || [],
            best_sellers: productsResponse.data.best_sellers || [],
            huntsman_savile_row: productsResponse.data.huntsman_savile_row || []
          };
          
          console.log('✅ Collections processed:', {
            just_arrived: safeCollections.just_arrived.length,
            best_sellers: safeCollections.best_sellers.length,
            huntsman_savile_row: safeCollections.huntsman_savile_row.length
          });
          
          setCollections(safeCollections);
        } else {
          console.warn('⚠️ Products fetch failed or empty:', productsResponse);
          setCollections({
            just_arrived: [],
            best_sellers: [],
            huntsman_savile_row: []
          });
        }

        // Handle banners
        if (bannersResponse.success && bannersResponse.data) {
          const bannersByType = {
            hero: null,
            product_highlight: [],
            collection_highlight: []
          };

          (bannersResponse.data || []).forEach(banner => {
            if (banner.type === 'hero') {
              bannersByType.hero = banner;
            } else if (banner.type === 'product_highlight') {
              bannersByType.product_highlight.push(banner);
            } else if (banner.type === 'collection_highlight') {
              bannersByType.collection_highlight.push(banner);
            }
          });

          setBanners(bannersByType);
          console.log('✅ Banners processed:', bannersByType);
        } else {
          console.warn('⚠️ Banners fetch failed, using empty fallback');
          setBanners({
            hero: null,
            product_highlight: [],
            collection_highlight: []
          });
        }
        
      } catch (err) {
        console.error('❌ Error fetching women\'s data:', err);
        setError(err.message);
        
        setCollections({
          just_arrived: [],
          best_sellers: [],
          huntsman_savile_row: []
        });
        setBanners({
          hero: null,
          product_highlight: [],
          collection_highlight: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWomensData();
  }, []);

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

  // Product Card Component - UPDATED WITH CART SIDEBAR FUNCTIONALITY
  const ProductCard = memo(({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!product) {
      console.warn('ProductCard: No product data provided');
      return (
        <div className="w-full max-w-[331px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl p-6">
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

    const productInCart = isInCart(product._id?.toString(), product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null);

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

      const productId = product._id.toString();
      try {
        navigate(`/product/${productId}`);
      } catch (error) {
        console.error('❌ Navigation error:', error);
        window.location.href = `/product/${productId}`;
      }
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
      console.warn(`ProductCard (${product._id}): Image error for ${type} image`, e.target.src);
      setImageError(prev => ({ ...prev, [type]: true }));
      setImageLoading(false);
      e.target.src = '/images/default-gift.png';
    };

    const handleImageLoad = () => {
      setImageLoading(false);
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
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79300f]"></div>
            </div>
          )}
          <motion.img
            src={getProductImage()}
            alt={product.name || 'Product'}
            className={`object-contain w-full h-full max-w-[248px] max-h-[248px] ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={(e) => handleImageError(e, isHovered ? 'hover' : 'primary')}
            onLoad={handleImageLoad}
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

        {/* Product Info Container - FIXED HEIGHT */}
        <div className="px-3.5 py-3.5 flex flex-col gap-3.5">
          {/* Product Name - ONE LINE ONLY */}
          <h3 
            className="font-bold uppercase text-center line-clamp-1 text-lg sm:text-xl md:text-2xl"
            style={{
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.05em',
              color: '#5A2408'
            }}
          >
            {product.name || 'Unnamed Gift'}
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
            {product.description || 'Premium fragrance'}
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

          {/* UPDATED Add to Cart Button - Opens Cart Sidebar when product is in cart */}
          <motion.button
            onClick={productInCart ? (e) => { 
              e.stopPropagation(); 
              setIsCartOpen(true); // CHANGED: Opens cart sidebar instead of navigating
            } : handleAddToCart}
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

  // Collection Section Component
  const CollectionSection = memo(({ title, products = [], sectionKey }) => {
    const isExpanded = expandedSections[sectionKey];
    const displayProducts = useMemo(() => 
      isExpanded ? products : products.slice(0, 4),
      [isExpanded, products]
    );
    const hasMoreProducts = products.length > 4;

    console.log(`Rendering ${title} with ${products?.length || 0} products`);
    
    return (
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-[#F8F6F3] dark:bg-[#0d0603]">
        <div className="max-w-[1555px] mx-auto">
          {/* Section Title */}
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-bold mb-7 sm:mb-10 lg:mb-14 text-3xl sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: darkMode ? '#f6d110' : '#271004'
            }}
          >
            {title}
          </motion.h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 border-b-2 border-[#79300f]"></div>
            </div>
          ) : products && products.length > 0 ? (
            <>
              {/* Products Grid */}
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 mb-7 sm:mb-10 justify-items-center"
              >
                <AnimatePresence mode="popLayout">
                  {displayProducts.map((product) => {
                    if (!product || !product._id) {
                      console.warn(`⚠️ Invalid product:`, product);
                      return null;
                    }
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
                    onClick={() => toggleSection(sectionKey)}
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
                      {isExpanded ? 'Show Less' : 'View all Fragrances'}
                    </span>
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                No products available in this collection.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Please check back later or try refreshing the page.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  });

  CollectionSection.displayName = 'CollectionSection';

  // Dynamic Banner Component
  const DynamicBanner = memo(({ banner, type = 'hero' }) => {
    if (!banner) return null;

    const handleClick = () => {
      handleBannerClick(banner);
      if (banner.buttonLink) {
        window.location.href = banner.buttonLink;
      }
    };

    if (type === 'hero') {
      return (
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="relative py-0 overflow-hidden"
        >
          <div className="relative h-[270px] sm:h-[360px] lg:h-[450px] bg-gradient-to-r from-black/50 to-transparent">
            <img 
              src={banner.backgroundImage || '/images/baner2.jpeg'} 
              alt={banner.altText || banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-start px-5 sm:px-7 lg:px-10">
              <div className="text-white max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-dm-serif mb-3.5 sm:mb-5 leading-tight" style={{ color: banner.textColor || '#FFFFFF' }}>
                  {banner.title} <br />
                  <span style={{ color: banner.highlightColor || '#f6d110' }}>
                    {banner.titleHighlight}
                  </span>
                </h2>
                <p className="text-sm sm:text-base lg:text-lg mb-5 sm:mb-7 text-gray-200">
                  {banner.description}
                </p>
                <Button 
                  onClick={handleClick}
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {banner.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      );
    }

    if (type === 'product_highlight') {
      return (
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F8F6F3] dark:bg-[#0d0603] py-10 sm:py-14 lg:py-16 px-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-7 sm:gap-10 lg:gap-14 items-center">
            <motion.div 
              className="text-left order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {banner.subtitle && (
                <motion.h3 
                  className="text-sm sm:text-base lg:text-lg text-[#79300f] dark:text-[#f6d110] font-semibold uppercase mb-2.5 sm:mb-3.5 tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {banner.subtitle}
                </motion.h3>
              )}
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3.5 sm:mb-5 leading-[110%] text-[#271004] dark:text-[#f6d110]" 
                style={{ fontFamily: 'Playfair Display, serif' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {banner.title} <br />
                <span className="text-[#79300f] dark:text-[#f6d110]">
                  {banner.titleHighlight}
                </span>
              </motion.h2>
              <motion.p 
                className="text-base sm:text-lg mb-5 sm:mb-7 text-[#5a2408] dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {banner.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={handleClick}
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-7 sm:px-9 py-3.5 sm:py-4.5 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {banner.buttonText}
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative flex items-center justify-center order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[693px]"
              >
                <img
                  src={banner.image || '/images/newimg1.PNG'}
                  alt={banner.altText || banner.title}
                  className="w-full h-auto object-contain filter drop-shadow-2xl"
                />
              </motion.div>
              
              <motion.div
                className="absolute -z-10 bg-gradient-to-br from-[#79300f]/5 to-[#5a2408]/5 rounded-full blur-3xl w-[80%] h-[80%]"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.section>
      );
    }

    if (type === 'collection_highlight') {
      return (
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F8F6F3] dark:bg-[#0d0603] py-10 sm:py-14 lg:py-16 px-4 sm:px-6"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              {banner.subtitle && (
                <h3 className="text-lg text-[#79300f] dark:text-[#f6d110] font-semibold uppercase mb-3">
                  {banner.subtitle}
                </h3>
              )}
              <h2 className="text-[42px] font-dm-serif mb-6 text-[#79300f] dark:text-[#f6d110]">
                {banner.title} <br />
                <span className="text-[#79300f] dark:text-[#f6d110]">
                  {banner.titleHighlight}
                </span>
              </h2>
              <p className="text-[18px] mb-6 text-[#5a2408] dark:text-gray-300 leading-relaxed">
                {banner.description}
              </p>
              <Button 
                onClick={handleClick}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                {banner.buttonText}
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#79300f]/10 to-[#5a2408]/10 rounded-2xl p-8">
                <img
                  src={banner.image || '/images/newimg1.PNG'}
                  alt={banner.altText || banner.title}
                  className="w-full h-[400px] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </motion.section>
      );
    }

    return null;
  });

  DynamicBanner.displayName = 'DynamicBanner';

  // Notification System
  const NotificationSystem = memo(() => (
    <div className="fixed top-3.5 right-3.5 z-50 space-y-2 max-w-[90vw] sm:max-w-sm">
      <AnimatePresence>
        {cartNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`p-2.5 sm:p-3.5 rounded-2xl shadow-lg backdrop-blur-sm border ${
              notification.type === 'success' 
                ? 'bg-green-500/90 text-white border-green-400' 
                : 'bg-red-500/90 text-white border-red-400'
            }`}
          >
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {notification.type === 'success' ? (
                <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
              )}
              <span className="font-medium text-sm sm:text-base">{notification.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  ));

  NotificationSystem.displayName = 'NotificationSystem';

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex justify-center items-center h-64">
          <div className="text-center max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Failed to load content</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-[#79300f] text-white px-6 py-2 rounded-lg hover:bg-[#5a2408] transition-colors"
              >
                Retry
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <NotificationSystem />
      
      {/* CART SIDEBAR - ADD THIS */}
      <ProductCartSection isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <main>
        {/* Hero Section */}
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="text-center px-4 sm:px-6 py-10 sm:py-14 lg:py-16 bg-white dark:from-[#0d0603] dark:to-[#1a1410]"
        >
          <motion.h1 
            variants={fadeIn('up', 0.3)} 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3.5 sm:mb-5 leading-[120%] text-[#271004] dark:text-[#f6d110]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Women's Scents
          </motion.h1>
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-[734px] mx-auto text-[#3A3A3A] dark:text-gray-300 px-4"
            style={{ letterSpacing: '0.02em', fontFamily: 'Manrope, sans-serif' }}
          >
            Elegant, floral, and sensual notes designed to capture grace and allure.
          </motion.p>
        </motion.section>

        {/* Dynamic Hero Banner */}
        {banners.hero && (
          <DynamicBanner banner={banners.hero} type="hero" />
        )}

        {/* Just Arrived */}
        <CollectionSection 
          title="Just Arrived" 
          products={collections.just_arrived} 
          sectionKey="just_arrived"
        />

        {/* Dynamic Product Highlight Banners */}
        {banners.product_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="product_highlight" />
        ))}

        {/* Best Sellers */}
        <CollectionSection 
          title="Best Sellers" 
          products={collections.best_sellers} 
          sectionKey="best_sellers"
        />

        {/* Dynamic Collection Highlight Banners */}
        {banners.collection_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="collection_highlight" />
        ))}

        {/* Huntsman Savile Row */}
        <CollectionSection 
          title="Huntsman Savile Row" 
          products={collections.huntsman_savile_row} 
          sectionKey="huntsman_savile_row"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default WomensCollection;