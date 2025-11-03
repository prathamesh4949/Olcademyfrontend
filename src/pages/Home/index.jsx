import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/common/HeroSection';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Checkbox from '../../components/ui/Checkbox';
import ProductCartSection from '../../pages/ProductCartSection'; // ADD THIS IMPORT
import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
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
import ScentService from '../../services/scentService';

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

  const [expandedSections, setExpandedSections] = useState({});

  // ADD THIS STATE FOR CART SIDEBAR
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Toggle section expansion - MEMOIZED
  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

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

    if (banner.buttonLink) {
      navigate(banner.buttonLink);
    } else if (
      banner.type === 'trending_collection' ||
      banner.title?.toLowerCase().includes('trending')
    ) {
      navigate('/trending-collection');
    } else if (
      banner.type === 'best_seller_collection' ||
      banner.title?.toLowerCase().includes('best seller')
    ) {
      navigate('/best-sellers-collection');
    } else {
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

        const [productsResponse, bannersResponse, scentsResponse] = await Promise.all([
          ProductService.getHomeCollections().catch((err) => {
            console.error('Products fetch error:', err);
            return { success: false, error: err.message };
          }),
          ProductService.getHomeBanners().catch((err) => {
            console.error('Banners fetch error:', err);
            return { success: false, error: err.message };
          }),
          ScentService.getFeaturedScents().catch((err) => {
            console.error('Scents fetch error:', err);
            return { success: false, error: err.message };
          }),
        ]);

        console.log('Home Products Response:', productsResponse);
        console.log('Home Banners Response:', bannersResponse);
        console.log('Scents Response:', scentsResponse);

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

        if (scentsResponse.success && scentsResponse.data) {
          const scentsData = scentsResponse.data;
          console.log('✅ Featured scents loaded:', {
            trending: scentsData.trending?.length || 0,
            bestSellers: scentsData.bestSellers?.length || 0,
            signature: scentsData.signature?.length || 0,
          });

          setCollections((prev) => ({
            ...prev,
            trending_scents: scentsData.trending || [],
            best_seller_scents: scentsData.bestSellers || [],
          }));
        }
      } catch (err) {
        console.error('❌ Error fetching home data:', err);
        setError(err.message);

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
      window.location.href = `/product/${productId}`;
    }
  };

  // Enhanced ProductCard component
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
        {/* Image Container with Wishlist Icon - RESPONSIVE */}
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

        {/* Product Info Container - RESPONSIVE */}
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

  const CollectionSection = memo(({ title, products = [], sectionKey }) => {
    const isExpanded = expandedSections[sectionKey];
    const displayProducts = useMemo(() =>
      isExpanded ? products : products.slice(0, 4),
      [isExpanded, products]
    );
    const hasMoreProducts = products.length > 4;

    return (
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 bg-[#F8F6F3] dark:bg-[#0d0603]">
        <div className="max-w-[1555px] mx-auto">
          {/* Section Title - RESPONSIVE */}
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
              {/* Products Grid - RESPONSIVE */}
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

              {/* View All Button - RESPONSIVE - EXACT STYLING MATCH */}
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

  // Enhanced Dynamic Banner Component with click handling
  const DynamicBanner = ({ banner, type = 'hero' }) => {
    if (!banner) return null;

    const handleClick = () => {
      handleBannerClick(banner);
    };

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

      return '#';
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

              <h2 className="text-[42px] font-dm-serif mb-6 text-black">
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
                className="bg-gradient-to-r from-[#431A06] to-[#5a2408] hover:from-[#431A06] hover:to-[#79300f] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-3 w-fit"
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
                className="w-full h-full object-cover shadow-lg"
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

              <h2 className="text-[42px] font-dm-serif mb-6 text-black">
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
                className="bg-gradient-to-r from-[#431A06] to-[#5a2408] hover:from-[#431A06] hover:to-[#79300f] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-3 w-fit"
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
                className="w-full h-full object-cover shadow-lg"
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
                        setIsCartOpen(true);
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
            className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border max-w-sm ${notification.type === 'success'
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
      
      {/* CART SIDEBAR - ADD THIS */}
      <ProductCartSection isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
          sectionKey="fragrant_favourites"
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
          sectionKey="summer_scents"
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
          sectionKey="signature_collection"
        />

        <section className="bg-gradient-to-br from-[#1C160C] via-[#1C160C] to-[#292218] py-20 px-6 ">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[42px] md:text-[48px] font-dm-serif mb-4 bg-gradient-to-r from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent leading-tight">
                The Vesarii Inner Circle
              </h2>
              <p className="text-[16px] mb-10 text-[#EFE9E6] leading-relaxed max-w-xl mx-auto">
                Private access to rare editions, secret previews, and Parisian inspirations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-6 py-4 flex-1 outline-none border border-[#D4AF7A]/40 focus:border-[#D4AF7A] transition-all duration-300 bg-transparent
    bg-gradient-to-br from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1] bg-clip-text text-transparent
    placeholder:text-transparent placeholder:bg-gradient-to-br placeholder:from-[#CDAF6E] placeholder:via-[#E4C77F] placeholder:to-[#E4C77F] placeholder:bg-clip-text"
                />
                <Button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-br from-[#CDAF6E] via-[#E4C77F] to-[#F5E6A1]  px-6 py-2 rounded-sm font-bold text-sm  hover:bg-[#E4BF8A] transition-colors tracking-wider whitespace-nowrap font-[Manrope] !text-[#341405]"
                >
                  JOIN THE CIRCLE
                </Button>
              </div>

              <p className="text-[14px] text-[#EFE9E6]">
                By joining, you'll receive updates on limited editions and private events.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;