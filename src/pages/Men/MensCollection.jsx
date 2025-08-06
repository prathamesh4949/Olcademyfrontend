import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import ProductService from '../../services/productService';

const MensCollection = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { addToCart } = useCart();
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

  // Enhanced Product Card Component with improved navigation and error handling
  const ProductCard = memo(({ product, isCompact = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    if (!product) {
      console.warn('⚠️ ProductCard: No product data provided');
      return null;
    }

    // Enhanced product validation
    const validateProduct = (product) => {
      const requiredFields = ['_id', 'name', 'price'];
      const missingFields = requiredFields.filter(field => !product[field]);
      
      if (missingFields.length > 0) {
        console.warn('⚠️ Product missing required fields:', {
          productId: product._id,
          missingFields,
          product
        });
        return false;
      }
      
      return true;
    };

    const handleAddToCart = (e) => {
      e.stopPropagation();
      
      if (!validateProduct(product)) {
        console.error('❌ Cannot add invalid product to cart');
        return;
      }
      
      const cartItem = {
        ...product,
        id: product._id,
        quantity: 1
      };
      
      console.log('🛒 Adding to cart:', cartItem);
      addToCart(cartItem);
    };

    const handleWishlistToggle = (e) => {
      e.stopPropagation();
      
      if (!product._id) {
        console.error('❌ Cannot toggle wishlist for product without ID');
        return;
      }
      
      console.log('❤️ Toggling wishlist for:', product._id);
      toggleWishlist(product);
    };

    const handleCardClick = () => {
      console.log('🖱️ Product card clicked:', product._id);
      handleProductClick(product);
    };

    const getProductImage = () => {
      if (imageError) {
        return '/images/default-perfume.png';
      }
      
      if (isHovered && product.hoverImage) {
        return product.hoverImage;
      }
      
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      }
      
      return '/images/default-perfume.png';
    };

    const handleImageError = (e) => {
      console.warn('⚠️ Image failed to load:', e.target.src);
      setImageError(true);
      e.target.src = '/images/default-perfume.png';
    };
    
    return (
      <div 
        className={`bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left relative flex-shrink-0 border border-[#D4C5A9] dark:border-gray-600 group hover:scale-105 cursor-pointer ${isCompact ? 'w-[300px]' : 'w-full'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 text-[#79300f] hover:text-red-600 dark:text-[#f6d110] dark:hover:text-red-400 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 hover:bg-white dark:hover:bg-black"
        >
          <FiHeart 
            size={18} 
            className={isInWishlist(product._id) ? 'fill-red-600 text-red-600' : ''} 
          />
        </button>
        
        <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-inner">
          <img 
            src={getProductImage()}
            alt={product.name || 'Product'} 
            className={`${isCompact ? 'h-[200px]' : 'h-[300px]'} w-full object-contain transition-all duration-300 group-hover:scale-105`}
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className={`${isCompact ? 'text-[20px]' : 'text-[30px]'} font-alata text-[#5a2408] dark:text-gray-200 font-bold`}>
            {product.name || 'Unnamed Product'}
          </h3>
          <p className={`${isCompact ? 'text-[12px]' : 'text-[16px]'} text-[#8b4513] dark:text-gray-400 italic leading-relaxed line-clamp-2`}>
            {product.description || 'No description available'}
          </p>
          <div className="flex items-center justify-between pt-2">
            <p className={`${isCompact ? 'text-[20px]' : 'text-[26px]'} font-bold text-[#79300f] dark:text-[#f6d110]`}>
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
            </p>
            <div className="bg-[#79300f]/10 dark:bg-[#f6d110]/10 px-2 py-1 rounded-full">
              <span className="text-xs text-[#79300f] dark:text-[#f6d110] font-medium">
                {product.brand?.toUpperCase() || 'PREMIUM'}
              </span>
            </div>
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-[#79300f] dark:text-[#f6d110]">
                {product.rating}/5
              </span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full mt-4 bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add to Cart
        </Button>
      </div>
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
                {banner.title}
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
              <div className="bg-gradient-to-br from-[#f6d110]/20 to-[#79300f]/20 rounded-2xl p-8">
                <img
                  src={banner.image || '/images/baner1.jpeg'}
                  alt={banner.altText || banner.title}
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
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
          className="bg-[#F2F2F2] dark:bg-[#0d0603] py-16 px-6"
          style={{ backgroundColor: banner.backgroundColor }}
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
  };

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