import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/common/HeroSection';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Checkbox from '../../components/ui/Checkbox';
import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useCart } from '@/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../variants';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  ShoppingBag,
  Eye,
  CheckCircle,
  AlertCircle,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/WishlistContext';
import ProductService from '../../services/productService';
import ScentService from '../../services/scentService'; // Import ScentService

const HomePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef(null);
  const summerScrollRef = useRef(null);
  const signatureScrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summerCurrentIndex, setSummerCurrentIndex] = useState(0);
  const [signatureCurrentIndex, setSignatureCurrentIndex] = useState(0);
  const { addToCart, cartItems, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Backend data state
  const [collections, setCollections] = useState({
    fragrant_favourites: [],
    summer_scents: [],
    signature_collection: [],
  });

  const [banners, setBanners] = useState({
    hero: null,
    product_highlight: [],
    collection_highlight: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced notification system
  const [notifications, setNotifications] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Add notification helper
  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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

  // Enhanced Banner Click Handler
  const handleBannerClick = async (banner) => {
    if (banner && banner._id) {
      try {
        await ProductService.trackBannerClick(banner._id);
      } catch (error) {
        console.error('Error tracking banner click:', error);
      }
    }

    // Navigate based on banner type or specific properties
    if (banner.buttonLink) {
      // If banner has specific link, use it
      navigate(banner.buttonLink);
    } else if (
      banner.type === 'trending_collection' ||
      banner.title?.toLowerCase().includes('trending')
    ) {
      // Navigate to trending collection
      navigate('/trending-collection');
    } else if (
      banner.type === 'best_seller_collection' ||
      banner.title?.toLowerCase().includes('best seller')
    ) {
      // Navigate to best sellers collection
      navigate('/best-sellers-collection');
    } else {
      // Default fallback
      console.log('Banner clicked but no specific navigation defined:', banner);
    }
  };

  // Updated fetchHomeData with scent integration
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching home page data...');

        // Fetch products, banners, and featured scents
        const [productsResponse, bannersResponse, scentsResponse] = await Promise.all([
          ProductService.getHomeCollections().catch((err) => {
            console.error('Products fetch error:', err);
            return { success: false, error: err.message };
          }),
          ProductService.getHomeBanners().catch((err) => {
            console.error('Banners fetch error:', err);
            return { success: false, error: err.message };
          }),
          // NEW: Fetch featured scents
          ScentService.getFeaturedScents().catch((err) => {
            console.error('Scents fetch error:', err);
            return { success: false, error: err.message };
          }),
        ]);

        console.log('Home Products Response:', productsResponse);
        console.log('Home Banners Response:', bannersResponse);
        console.log('Scents Response:', scentsResponse);

        // Handle existing products
        if (productsResponse.success && productsResponse.data) {
          const safeCollections = {
            fragrant_favourites: productsResponse.data.fragrant_favourites || [],
            summer_scents: productsResponse.data.summer_scents || [],
            signature_collection: productsResponse.data.signature_collection || [],
          };

          console.log('✅ Collections processed:', {
            fragrant_favourites: safeCollections.fragrant_favourites.length,
            summer_scents: safeCollections.summer_scents.length,
            signature_collection: safeCollections.signature_collection.length,
          });

          setCollections(safeCollections);
        } else {
          console.warn('⚠️ Products fetch failed or empty:', productsResponse);
          setCollections({
            fragrant_favourites: [],
            summer_scents: [],
            signature_collection: [],
          });
        }

        // Handle banners
        if (bannersResponse.success && bannersResponse.data) {
          const bannersByType = {
            hero: null,
            product_highlight: [],
            collection_highlight: [],
          };

          (bannersResponse.data || []).forEach((banner) => {
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
            collection_highlight: [],
          });
        }

        // NEW: Handle scents data
        if (scentsResponse.success && scentsResponse.data) {
          const scentsData = scentsResponse.data;
          console.log('✅ Featured scents loaded:', {
            trending: scentsData.trending?.length || 0,
            bestSellers: scentsData.bestSellers?.length || 0,
            signature: scentsData.signature?.length || 0,
          });

          // Option 1: Replace existing collections with scent data
          // setCollections({
          //   fragrant_favourites: scentsData.trending || [],
          //   summer_scents: scentsData.bestSellers || [],
          //   signature_collection: scentsData.signature || []
          // });

          // Option 2: Add scents as additional collections
          setCollections((prev) => ({
            ...prev,
            trending_scents: scentsData.trending || [],
            best_seller_scents: scentsData.bestSellers || [],
          }));
        }
      } catch (err) {
        console.error('❌ Error fetching home data:', err);
        setError(err.message);

        // Fallback to empty arrays to prevent crashes
        setCollections({
          fragrant_favourites: [],
          summer_scents: [],
          signature_collection: [],
        });
        setBanners({
          hero: null,
          product_highlight: [],
          collection_highlight: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Navigation functions with safety checks
  const createNavFunction = (products = [], setIndex) => ({
    next: () => {
      if (!products || products.length <= 4) return;
      setIndex((prev) => Math.min(prev + 1, products.length - 4));
    },
    prev: () => {
      if (!products || products.length <= 4) return;
      setIndex((prev) => Math.max(prev - 1, 0));
    },
  });

  const fragrantFavouritesNav = createNavFunction(collections.fragrant_favourites, setCurrentIndex);
  const summerScentsNav = createNavFunction(collections.summer_scents, setSummerCurrentIndex);
  const signatureCollectionNav = createNavFunction(
    collections.signature_collection,
    setSignatureCurrentIndex
  );

  const handleSubscribe = () => {
    if (email && acceptTerms) {
      addNotification('Thank you for subscribing to our exclusive circle!', 'success');
      setEmail('');
      setAcceptTerms(false);
    } else {
      addNotification('Please enter your email and accept terms to continue.', 'error');
    }
  };

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
      category: product.category,
    });

    try {
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
      // Fallback navigation
      window.location.href = `/product/${productId}`;
    }
  };

  // Enhanced ProductCard component
  const ProductCard = memo(({ product, isCompact = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!product) {
      console.warn('ProductCard: No product data provided');
      return (
        // HEAD
        <div
          className={`${isCompact ? 'w-[300px]' : 'w-full'} bg-gray-200 animate-pulse rounded-2xl p-6`}
        >
          <div className="h-[200px] bg-gray-300 rounded-xl mb-4"></div>

          <div className="space-y-3">
            <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      );
    }

    const validateProduct = (product) => {
      const requiredFields = ['_id', 'name', 'price'];
      return requiredFields.every((field) => product[field]);
    };

    const productInCart = isInCart(
      product._id?.toString(),
      product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null
    );

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
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : '/images/default-gift.png',
        quantity: 1,
        selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null,
        personalization: null,
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

        const wishlistProduct = {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : '/images/default-gift.png',
          description: product.description || '',
          category: product.category || '',
          selectedSize: null,
        };

        toggleWishlist(wishlistProduct);
        addNotification(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 'success');
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
      if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0 &&
        !imageError.primary
      ) {
        return product.images[0];
      }
      return '/images/default-gift.png';
    };

    const handleImageError = (e, type = 'primary') => {
      console.warn(`ProductCard (${product._id}): Image error for ${type} image`, e.target.src);
      setImageError((prev) => ({ ...prev, [type]: true }));
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
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative flex-shrink-0 border border-gray-200 group cursor-pointer ${isCompact ? 'w-[300px]' : 'w-full'} backdrop-blur-sm flex flex-col`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 text-[#79300f] hover:text-red-600 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200"
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
              className="absolute top-4 right-16 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 z-10"
              aria-label="Quick view"
            >
              <Eye size={18} className="text-[#79300f]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Product Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
            NEW
          </div>
        )}

        {/* In Cart Badge */}
        {productInCart && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 border border-emerald-400">
            ✓ IN CART
          </div>
        )}

        {/* Image Container */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-inner relative overflow-hidden">
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
            <h3
              className={`${isCompact ? 'text-lg' : 'text-xl'} font-alata text-[#5a2408] font-bold leading-tight`}
            >
              =======
              {product.name || 'Unnamed Product'}
            </h3>
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {product.description && (
            <p
              className={`${isCompact ? 'text-xs' : 'text-sm'} text-[#8b4513] leading-relaxed line-clamp-2`}
            >
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <p className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-[#79300f]`}>
                ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className="bg-[#79300f]/10 px-2 py-1 rounded-full">
              <span className="text-xs text-[#79300f] font-medium">PREMIUM</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
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
  const CollectionSection = ({ title, products = [], index = 0, navigation, scrollRef }) => {
    console.log(`Rendering ${title} with ${products?.length || 0} products`);

    return (
      <section className="py-16 px-6" style={{ backgroundColor: '#F9F7F6' }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[50px] font-dm-serif mb-12 text-[#79300f]">{title}</h2>
          </motion.div>

          {products.length === 0 && !loading ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">No products available in this collection.</p>
              <p className="text-sm text-gray-400 mt-2">
                Please check back later or try refreshing the page.
              </p>
            </div>
          ) : (
            <div className="relative">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#79300f]"></div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div
                    className="flex gap-6 transition-transform duration-500 ease-in-out will-change-transform"
                    style={{
                      transform: `translateX(-${index * 312}px)`,
                      width: `${products.length * 312}px`,
                    }}
                    ref={scrollRef}
                  >
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} isCompact={true} />
                    ))}
                  </div>
                </div>
              )}

              {products.length > 4 && (
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
          )}
        </div>
      </section>
    );
  };

  // Enhanced Dynamic Banner Component with click handling
  const DynamicBanner = ({ banner, type = 'hero' }) => {
    if (!banner) return null;

    const handleClick = () => {
      handleBannerClick(banner);
    };

    // Determine navigation based on banner content
    const getButtonAction = () => {
      if (banner.buttonLink) return banner.buttonLink;

      const title = banner.title?.toLowerCase() || '';
      const description = banner.description?.toLowerCase() || '';

      if (title.includes('trending') || description.includes('trending')) {
        return '/trending-collection';
      }
      if (
        title.includes('best seller') ||
        description.includes('best seller') ||
        title.includes('bestseller')
      ) {
        return '/best-sellers-collection';
      }

      return '#'; // Default fallback
    };

    if (type === 'product_highlight') {
      return (
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          className="py-16 px-6"
          style={{ backgroundColor: '#F9F7F6' }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              {banner.subtitle && (
                <h3 className="text-lg text-[#79300f] font-semibold uppercase mb-3">
                  {banner.subtitle}
                </h3>
              )}

              <h2 className="text-[42px] font-dm-serif mb-6 text-[#79300f]">
                {banner.title} <br />
                {banner.titleHighlight && (
                  <span className="text-[#79300f]">{banner.titleHighlight}</span>
                )}
              </h2>
              <p className="text-[18px] mb-6 text-[#5a2408] leading-relaxed">
                {banner.description}
              </p>
              {/* <button
                onClick={handleClick}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-md transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                {banner.buttonText || 'Explore Collection'}
              </button> */}
              <button
                onClick={handleClick}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-3 w-fit"
              >
                <span>{banner.buttonText || 'Explore Collection'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
            <div className="relative h-[400px]">
              <img
                src={banner.image || '/images/newimg1.PNG'}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover rounded-xl shadow-lg"
                onError={(e) => {
                  console.warn('Banner image failed to load:', e.target.src);
                  e.target.src = '/images/newimg1.PNG';
                }}
              />
            </div>
          </div>
        </motion.section>
      );
    }

    if (type === 'collection_highlight') {
      return (
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          className="py-16 px-6"
          style={{ backgroundColor: '#F9F7F6' }}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              {banner.subtitle && (
                <h3 className="text-lg text-[#79300f] font-semibold uppercase mb-3">
                  {banner.subtitle}
                </h3>
              )}

              <h2 className="text-[42px] font-dm-serif mb-6 text-[#79300f]">
                {banner.title} <br />
                {banner.titleHighlight && (
                  <span className="text-[#79300f]">{banner.titleHighlight}</span>
                )}
              </h2>
              <p className="text-[18px] mb-6 text-[#5a2408] leading-relaxed">
                {banner.description}
              </p>

              <button
                onClick={handleClick}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-3 w-fit"
              >
                <span>{banner.buttonText || 'View Collection'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
            <div className="relative h-[400px]">
              <img
                src={banner.image || '/images/newimg1.PNG'}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover rounded-xl shadow-lg"
                onError={(e) => {
                  console.warn('Banner image failed to load:', e.target.src);
                  e.target.src = '/images/newimg1.PNG';
                }}
              />
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
        try {
          const wishlistProduct = {
            id: quickViewProduct._id.toString(),
            name: quickViewProduct.name,
            price: quickViewProduct.price,
            image:
              quickViewProduct.images && quickViewProduct.images.length > 0
                ? quickViewProduct.images[0]
                : '/images/default-gift.png',
            description: quickViewProduct.description || '',
            category: quickViewProduct.category || '',
            selectedSize: null,
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
        image:
          quickViewProduct.images && quickViewProduct.images.length > 0
            ? quickViewProduct.images[0]
            : '/images/default-gift.png',
        quantity: 1,
        selectedSize:
          quickViewProduct.sizes && quickViewProduct.sizes.length > 0
            ? quickViewProduct.sizes[0].size
            : null,
        personalization: null,
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

    const productInQuickViewCart = isInCart(
      quickViewProduct._id?.toString(),
      quickViewProduct.sizes && quickViewProduct.sizes.length > 0
        ? quickViewProduct.sizes[0].size
        : null
    );

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
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#79300f]">Quick View</h3>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
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
                  className="w-full h-64 object-contain rounded-2xl bg-gray-100"
                  onError={(e) => {
                    e.target.src = '/images/default-gift.png';
                  }}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">
                  {quickViewProduct.name || 'Unnamed Product'}
                </h4>
                <p className="text-gray-600">
                  {quickViewProduct.description || 'No description available'}
                </p>
                <p className="text-2xl font-bold text-[#79300f]">
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
                    <Heart
                      size={20}
                      className={
                        isInWishlist(quickViewProduct._id) ? 'fill-red-600 text-red-600' : ''
                      }
                    />
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F6' }}>
      <Header />
      <NotificationSystem />
      <QuickViewModal />

      <main className="flex-1" style={{ backgroundColor: '#F9F7F6' }}>
        {/* HeroSection */}
        {banners.hero && (
          <HeroSection
            title={banners.hero.title || 'Discover Luxury Gifts'}
            subtitle={banners.hero.subtitle || 'Explore our exclusive collections'}
            image={banners.hero.image || '/images/hero-default.jpg'}
            buttonText="Shop Now"
            onButtonClick={() => handleBannerClick(banners.hero)}
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-4 text-red-600"
          >
            <AlertCircle size={20} className="inline mr-2" />
            {error}
          </motion.div>
        )}

        <CollectionSection
          title="Fragrant Favourites"
          products={collections.fragrant_favourites}
          index={currentIndex}
          navigation={fragrantFavouritesNav}
          scrollRef={scrollRef}
        />

        {/* Dynamic Product Highlight Banners */}
        {banners.product_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="product_highlight" />
        ))}

        <CollectionSection
          title="Summer Scents"
          products={collections.summer_scents}
          index={summerCurrentIndex}
          navigation={summerScentsNav}
          scrollRef={summerScrollRef}
        />

        {/* Dynamic Collection Highlight Banners */}
        {banners.collection_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="collection_highlight" />
        ))}

        <CollectionSection
          title="Signature Collection"
          products={collections.signature_collection}
          index={signatureCurrentIndex}
          navigation={signatureCollectionNav}
          scrollRef={signatureScrollRef}
        />

        <section className="py-20 px-6" style={{ backgroundColor: '#F9F7F6' }}>
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-lg text-[#79300f] font-medium uppercase tracking-wider mb-4 block">
                Exclusive Access
              </span>
              <h2 className="text-[50px] md:text-[60px] font-dm-serif mb-6 text-[#79300f] leading-tight">
                Join Our Exclusive Circle
              </h2>
              <p className="text-[20px] mb-12 text-[#5a2408] leading-relaxed max-w-3xl mx-auto">
                Subscribe to our newsletter for early access to limited edition releases, private
                events, and the secrets behind our scent creations. Be the first to discover luxury.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-6 ">
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-[#79300f] placeholder-gray-500 px-6 py-4 flex-1 outline-none rounded-xl border border-gray-300 shadow-lg focus:border-[#79300f] focus:shadow-xl transition-all duration-300"
                />
                <Button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-[#cdaf6e] via-[#e4c77f] to-[#f5e6a1] text-black px-6 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 font-medium text-sm md:text-base lg:text-lg tracking-widest hover:opacity-90 transition-colors sm:rounded-r sm:rounded-l-none rounded whitespace-nowrap"
                >
                  JOIN THE CIRCLE
                </Button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-5 w-5 accent-[#79300f]"
                />
                <span className="text-sm text-[#5a2408]">
                  By checking this box, I accept the{' '}
                  <a
                    href="#"
                    className="text-[#79300f] hover:text-[#5a2408] underline transition-colors"
                  >
                    terms and conditions
                  </a>
                  .
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
