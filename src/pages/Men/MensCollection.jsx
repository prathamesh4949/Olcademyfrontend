import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { ChevronLeft, ChevronRight, Star, RefreshCw, ShoppingBag, Eye, CheckCircle, AlertCircle, Heart, ShoppingCart } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import ProductService from '../../services/productService';

const MensCollection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
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
  
  // State for carousel navigation
  const [justArrivedIndex, setJustArrivedIndex] = useState(0);
  const [bestSellersIndex, setBestSellersIndex] = useState(0);
  const [premiumIndex, setPremiumIndex] = useState(0);

  // Enhanced state management
  const [cartNotifications, setCartNotifications] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
    const fetchMensData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching men\'s collection data...');
        
        // Fetch both products and banners
        const [productsResponse, bannersResponse] = await Promise.all([
          ProductService.getMensCollections().catch(err => {
            console.error('Products fetch error:', err);
            return { success: false, error: err.message };
          }),
          ProductService.getMensBanners().catch(err => {
            console.error('Banners fetch error:', err);
            return { success: false, error: err.message };
          })
        ]);
        
        console.log('Men\'s Products Response:', productsResponse);
        console.log('Men\'s Banners Response:', bannersResponse);
        
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
          // Organize banners by type
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
        console.error('❌ Error fetching men\'s data:', err);
        setError(err.message);
        
        // Fallback to empty arrays to prevent crashes
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

    fetchMensData();
  }, []);

  // Handle banner click tracking
  const handleBannerClick = async (banner) => {
    if (banner && banner._id) {
      try {
        await ProductService.trackBannerClick(banner._id);
      } catch (error) {
        console.error('Error tracking banner click:', error);
      }
    }
  };

  // Navigation functions with safety checks
  const createNavFunction = (products = [], setIndex) => ({
    next: () => {
      if (!products || products.length <= 4) return;
      setIndex(prev => Math.min(prev + 1, products.length - 4));
    },
    prev: () => {
      if (!products || products.length <= 4) return;
      setIndex(prev => Math.max(prev - 1, 0));
    }
  });

  const justArrivedNav = createNavFunction(collections.just_arrived, setJustArrivedIndex);
  const bestSellersNav = createNavFunction(collections.best_sellers, setBestSellersIndex);
  const premiumNav = createNavFunction(collections.huntsman_savile_row, setPremiumIndex);

  // Enhanced product navigation handler with validation
  const handleProductClick = (product) => {
    if (!product) {
      console.error('❌ No product data provided for navigation');
      return;
    }
    
    if (!product._id) {
      console.error('❌ Product missing _id:', product);
      return;
    }
    
    // Validate the product ID format
    const productId = product._id.toString();
    if (productId.length !== 24) {
      console.error('❌ Invalid product ID format:', productId);
      return;
    }
    
    console.log('🔗 Navigating to product:', {
      id: productId,
      name: product.name,
      category: product.category
    });
    
    try {
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
      // Fallback navigation
      window.location.href = `/product/${productId}`;
    }
  };

  // Product Card Component
  const ProductCard = memo(({ product, isCompact = false, collectionName = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!product) {
      console.warn('ProductCard: No product data provided');
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

    // Check if product is in cart
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

    const handleViewInCart = (e) => {
      e.stopPropagation();
      navigate('/product-cart');
    };

    const handleWishlistToggle = (e) => {
      e.stopPropagation();

      if (!product._id) {
        addNotification('Unable to add to wishlist', 'error');
        return;
      }

      try {
        const wasInWishlist = isInWishlist(product._id);
        
        // Transform the product object to match WishlistContext expectations
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

    const handleQuickView = (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('Quick View clicked for product:', product._id, product.name);
      if (product && product._id) {
        setQuickViewProduct(product);
      } else {
        console.error('❌ Invalid product for Quick View:', product);
        addNotification('Unable to show quick view', 'error');
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
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className={`bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative flex-shrink-0 border border-[#D4C5A9] dark:border-gray-600 group cursor-pointer ${isCompact ? 'w-[300px]' : 'w-full'} backdrop-blur-sm flex flex-col`}
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

        {/* In Cart Badge - Updated Color */}
        {productInCart && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 border border-emerald-400">
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
            alt={product.name || 'Gift'}
            className={`${isCompact ? 'h-[200px]' : 'h-[300px]'} w-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
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

        {/* Action Button - Updated Colors */}
        <motion.button
          onClick={productInCart ? handleViewInCart : handleAddToCart}
          disabled={isAddingToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-auto ${
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

  ProductCard.displayName = 'ProductCard';

  // Collection Section Component with smooth transitions
  const CollectionSection = ({ title, products = [], index = 0, navigation }) => {
    console.log(`Rendering ${title} with ${products?.length || 0} products`);
    
    return (
      <section className="py-16 px-6 bg-[#F2F2F2] dark:bg-[#0d0603]">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-[50px] font-dm-serif mb-12 text-[#79300f] dark:text-[#f6d110]">
            {title}
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#79300f]"></div>
            </div>
          ) : products && products.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out will-change-transform"
                  style={{ 
                    transform: `translateX(-${index * 312}px)`,
                    width: `${products.length * 312}px`
                  }}
                >
                  {products.map((product, idx) => {
                    if (!product || !product._id) {
                      console.warn(`⚠️ Invalid product at index ${idx}:`, product);
                      return null;
                    }
                    return (
                      <ProductCard key={product._id} product={product} isCompact={true} />
                    );
                  })}
                </div>
              </div>
              
              {products.length > 4 && navigation && (
                <>
                  <button
                    onClick={navigation.prev}
                    disabled={index === 0}
                    className={`absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 ${
                      index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={navigation.next}
                    disabled={index >= products.length - 4}
                    className={`absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 ${
                      index >= products.length - 4 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500 dark:text-gray-400">
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
  };

  // Dynamic Banner Component
  const DynamicBanner = ({ banner, type = 'hero' }) => {
    if (!banner) return null;

    const handleClick = () => {
      handleBannerClick(banner);
      // Navigate to banner link if needed
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
          <div className="relative h-[500px] bg-gradient-to-r from-black/50 to-transparent">
            <img 
              src={banner.backgroundImage || '/images/baner1.jpeg'} 
              alt={banner.altText || banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-start pl-12">
              <div className="text-white max-w-2xl">
                <h2 className="text-[48px] font-dm-serif mb-6 leading-tight" style={{ color: banner.textColor || '#FFFFFF' }}>
                  {banner.title} <br />
                  <span style={{ color: banner.highlightColor || '#f6d110' }}>
                    {banner.titleHighlight}
                  </span>
                </h2>
                <p className="text-[20px] mb-8 text-gray-200">
                  {banner.description}
                </p>
                <Button 
                  onClick={handleClick}
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
          className="bg-[#F2F2F2] dark:bg-[#021914] py-16 px-6"
          style={{ backgroundColor: banner.backgroundColor }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
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
  };

  // Quick View Modal
  const QuickViewModal = () => {
    if (!quickViewProduct) {
      return null;
    }

    const handleClose = () => {
      setQuickViewProduct(null);
    };

    const handleQuickViewWishlist = () => {
      if (quickViewProduct._id) {
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
                  alt={quickViewProduct.name || 'Product'}
                  className="w-full h-64 object-contain rounded-2xl bg-gray-100 dark:bg-gray-700"
                  onError={(e) => {
                    e.target.src = '/images/default-gift.png';
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {quickViewProduct.name || 'Unnamed Product'}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {quickViewProduct.description || 'No description available'}
                </p>
                <p className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110]">
                  ${quickViewProduct.price ? quickViewProduct.price.toFixed(2) : '0.00'}
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
                        navigate(`/product/${quickViewProduct._id}`);
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
    <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <NotificationSystem />
      <QuickViewModal />
      
      <main>
        {/* Hero Section */}
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          className="text-center px-6 py-16 bg-gradient-to-b from-[#F2F2F2] to-[#E8E8E8] dark:from-[#0d0603] dark:to-[#1a1410]"
        >
          <motion.h1 
            variants={fadeIn('up', 0.3)} 
            className="text-[60px] font-dm-serif mb-6 text-[#79300f] dark:text-[#f6d110]"
          >
            Men's Fragrances
          </motion.h1>
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-[20px] leading-relaxed max-w-4xl mx-auto text-[#5a2408] dark:text-gray-300"
          >
            Creating iconic hand-crafted perfumes for men, our collection has established a legacy of 
            sophisticated fragrances. Explore our bestselling men's fragrances crafted for the modern gentleman.
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
          index={justArrivedIndex}
          navigation={justArrivedNav}
        />

        {/* Dynamic Product Highlight Banners */}
        {banners.product_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="product_highlight" />
        ))}

        {/* Best Sellers */}
        <CollectionSection 
          title="Best Sellers" 
          products={collections.best_sellers} 
          index={bestSellersIndex}
          navigation={bestSellersNav}
        />

        {/* Dynamic Collection Highlight Banners */}
        {banners.collection_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="collection_highlight" />
        ))}

        {/* Huntsman Savile Row */}
        <CollectionSection 
          title="Huntsman Savile Row" 
          products={collections.huntsman_savile_row} 
          index={premiumIndex}
          navigation={premiumNav}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default MensCollection;