import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/common/HeroSection';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Checkbox from '../../components/ui/Checkbox';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../variants';
import { ChevronLeft, ChevronRight, Star, RefreshCw, ShoppingBag, Eye, CheckCircle, AlertCircle, Heart, ShoppingCart } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/WishlistContext';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef(null);
  const summerScrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summerCurrentIndex, setSummerCurrentIndex] = useState(0);
  const { addToCart, cartItems, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Enhanced notification system
  const [notifications, setNotifications] = useState([]);

  // Add notification helper
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Updated hover images array with new images
  const hoverImages = [
    "/images/newimg2.PNG",
    "/images/newimg3.PNG", 
    "/images/newimg4.PNG",
    "/images/newimg5.PNG",
    "/images/newimg6.png",
    "/images/newimg7.jpeg",
    "/images/newimg8.jpeg",
    "/images/newimg1.PNG"
  ];

  // Updated cards with new images
  const cards = [
    { id: 1, name: "Aventus", price: 455, image: "/images/newimg1.PNG", hoverImage: hoverImages[0], description: "A bold and sophisticated fragrance for the discerning gentleman.", isNew: true },
    { id: 2, name: "Oud Wood", price: 455, image: "/images/newimg2.PNG", hoverImage: hoverImages[1], description: "Rich woody notes with exotic oud essence." },
    { id: 3, name: "Creed", price: 455, image: "/images/newimg3.PNG", hoverImage: hoverImages[2], description: "Timeless elegance in every spritz." },
    { id: 7, name: "Royal Essence", price: 520, image: "/images/newimg4.PNG", hoverImage: hoverImages[3], description: "Majestic fragrance fit for royalty.", isNew: true },
    { id: 8, name: "Mystic Rose", price: 480, image: "/images/newimg5.PNG", hoverImage: hoverImages[4], description: "Enchanting rose with mysterious depths." },
    { id: 9, name: "Golden Amber", price: 495, image: "/images/newimg6.png", hoverImage: hoverImages[5], description: "Warm amber with golden undertones." },
  ];

  const items = [
    {
      src: "/images/newimg1.PNG",
      name: "Aventus",
      price: 455,
      description: "Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender, smoked cedar, and a whisper of fire-kissed amber. Designed to enchant from the very first breath.",
    },
    {
      src: "/images/newimg7.jpeg",
      name: "Ember Blaze",
      price: 455,
      description: "A bold fragrance for the confident soul, Ember Blaze blends smoky spice with hints of citrus and leather to create a trail that's unforgettable.",
    },
  ];

  // Updated summer scents with new images
  const summerScents = [
    {
      id: 4,
      name: "Citrus Bloom",
      image: "/images/newimg7.jpeg",
      hoverImage: hoverImages[6],
      description: "An expression of lush orange. Sharp yet sweet.",
      price: 455,
      isNew: true
    },
    {
      id: 5,
      name: "Island Breeze",
      image: "/images/newimg8.jpeg",
      hoverImage: hoverImages[7],
      description: "A tropical escape in every spritz golden sunshine.",
      price: 399,
    },
    {
      id: 6,
      name: "Sunlit Amber",
      image: "/images/newimg1.PNG",
      hoverImage: hoverImages[0],
      description: "Amber warmth wrapped in golden sunshine.",
      price: 430,
    },
    {
      id: 10,
      name: "Ocean Mist",
      image: "/images/newimg2.PNG",
      hoverImage: hoverImages[1],
      description: "Fresh sea breeze with hints of salt and seaweed.",
      price: 420,
    },
    {
      id: 11,
      name: "Tropical Paradise",
      image: "/images/newimg3.PNG",
      hoverImage: hoverImages[2],
      description: "Exotic fruits and coconut transport you to paradise.",
      price: 465,
      isNew: true
    },
    {
      id: 12,
      name: "Summer Rain",
      image: "/images/newimg4.PNG",
      hoverImage: hoverImages[3],
      description: "Petrichor and fresh flowers after summer rain.",
      price: 445,
    },
  ];

  const handleSubscribe = () => {
    if (email && acceptTerms) {
      addNotification('Thank you for subscribing to our exclusive circle!', 'success');
      setEmail('');
      setAcceptTerms(false);
    } else {
      addNotification('Please enter your email and accept terms to continue.', 'error');
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, cards.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, cards.length - 3)) % Math.max(1, cards.length - 3));
  };

  const nextSummerSlide = () => {
    setSummerCurrentIndex((prev) => (prev + 1) % Math.max(1, summerScents.length - 3));
  };

  const prevSummerSlide = () => {
    setSummerCurrentIndex((prev) => (prev - 1 + Math.max(1, summerScents.length - 3)) % Math.max(1, summerScents.length - 3));
  };

  // Enhanced ProductCard component matching MensCollection style
  const ProductCard = ({ product, isCompact = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    const productInCart = isInCart(product.id?.toString(), null);

    const handleAddToCart = async (e) => {
      e.stopPropagation();
      setIsAddingToCart(true);

      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: Number(product.price),
        image: product.image || '/images/default-gift.png',
        quantity: 1,
        selectedSize: null,
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
      
      const wishlistProduct = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image || '/images/default-gift.png',
        description: product.description || '',
        selectedSize: null
      };
      
      const wasInWishlist = isInWishlist(product.id);
      toggleWishlist(wishlistProduct);
      addNotification(
        wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
        'success'
      );
    };

    const getProductImage = () => {
      if (isHovered && product.hoverImage && !imageError.hover) {
        return product.hoverImage;
      }
      if (product.image && !imageError.primary) {
        return product.image;
      }
      return '/images/default-gift.png';
    };

    const handleImageError = (e, type = 'primary') => {
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
        className={`bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative flex-shrink-0 border border-[#D4C5A9] dark:border-gray-600 group cursor-pointer ${isCompact ? 'w-[300px]' : 'w-full'} backdrop-blur-sm`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 text-[#79300f] hover:text-red-600 dark:text-[#f6d110] dark:hover:text-red-400 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200"
        >
          <FiHeart size={18} className={isInWishlist(product.id) ? 'fill-red-600 text-red-600' : ''} />
        </motion.button>

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

        <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-inner relative overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79300f]"></div>
            </div>
          )}
          <img 
            src={getProductImage()}
            alt={product.name} 
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
                  Premium Fragrance
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-alata text-[#5a2408] dark:text-gray-200 font-bold leading-tight`}>
              {product.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
            </div>
          </div>
          
          <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-[#8b4513] dark:text-gray-400 leading-relaxed line-clamp-2`}>
            {product.description || "Exquisite fragrance notes crafted to perfection"}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <p className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-[#79300f] dark:text-[#f6d110]`}>
              ${product.price}
            </p>
            <div className="bg-[#79300f]/10 dark:bg-[#f6d110]/10 px-2 py-1 rounded-full">
              <span className="text-xs text-[#79300f] dark:text-[#f6d110] font-medium">PREMIUM</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={productInCart ? () => {} : handleAddToCart}
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
            {isAddingToCart ? 'Adding...' : productInCart ? 'In Cart' : 'Add to Cart'}
          </span>
        </motion.button>
      </motion.div>
    );
  };

  // Enhanced Hero Banner Component
  const EnhancedHeroBanner = ({ image, title, subtitle, description, buttonText, buttonAction }) => (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      className="relative py-0 overflow-hidden"
    >
      <div className="relative h-[600px] bg-gradient-to-r from-black/50 to-transparent">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-start pl-12 md:pl-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white max-w-3xl"
          >
            {subtitle && (
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-[#f6d110] font-medium uppercase tracking-wider mb-4 block"
              >
                {subtitle}
              </motion.span>
            )}
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[48px] md:text-[60px] font-dm-serif mb-6 leading-tight"
            >
              {title} <br />
              <span className="text-[#f6d110]">Collection</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[20px] mb-8 text-gray-200 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                onClick={buttonAction}
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {buttonText}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  // Enhanced Product Highlight Banner
  const ProductHighlightBanner = ({ image, title, subtitle, description, buttonText, reverse = false }) => (
    <motion.section
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      className="bg-gradient-to-br from-[#F2F2F2] via-[#F8F5F0] to-[#E8E8E8] dark:from-[#021914] dark:via-[#0d0603] dark:to-[#1a1410] py-20 px-6"
    >
      <div className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-left ${reverse ? 'md:order-2' : ''}`}
        >
          {subtitle && (
            <h3 className="text-lg text-[#79300f] dark:text-[#f6d110] font-semibold uppercase mb-3 tracking-wider">
              {subtitle}
            </h3>
          )}
          <h2 className="text-[42px] md:text-[48px] font-dm-serif mb-6 text-[#79300f] dark:text-[#f6d110] leading-tight">
            {title}
          </h2>
          <p className="text-[18px] md:text-[20px] mb-8 text-[#5a2408] dark:text-gray-300 leading-relaxed">
            {description}
          </p>
          <Button 
            className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {buttonText}
          </Button>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`relative ${reverse ? 'md:order-1' : ''}`}
        >
          <div className="bg-gradient-to-br from-[#79300f]/10 via-[#5a2408]/5 to-[#f6d110]/10 dark:from-[#f6d110]/10 dark:to-[#79300f]/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
            <img
              src={image}
              alt={title}
              className="w-full h-[450px] object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500"
            />
          </div>
          {/* Floating elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#f6d110]/20 to-[#79300f]/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#79300f]/15 to-[#5a2408]/15 rounded-full blur-xl"></div>
        </motion.div>
      </div>
    </motion.section>
  );

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
    <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <NotificationSystem />
      
      <main>
        {/* Enhanced Hero Section */}
        <motion.div variants={fadeIn('up', 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.4 }}>
          <HeroSection />
        </motion.div>

        {/* New Hero Banner */}
        <EnhancedHeroBanner 
          image="/images/baner1.jpeg"
          title="Signature"
          subtitle="Discover Excellence"
          description="Experience the pinnacle of fragrance craftsmanship with our signature collection. Each scent tells a story of luxury, sophistication, and timeless elegance."
          buttonText="Explore Collection"
          buttonAction={() => console.log('Navigate to collection')}
        />

        {/* Fragrant Favourites - Enhanced */}
        <motion.section variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" className="py-20 px-6 bg-gradient-to-br from-[#F8F5F0] to-[#F2F2F2] dark:from-[#0d0603] dark:to-[#1a1410]">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-lg text-[#79300f] dark:text-[#f6d110] font-medium uppercase tracking-wider mb-4 block">Premium Selection</span>
              <h2 className="text-[60px] font-dm-serif mb-4 text-[#79300f] dark:text-[#f6d110]">Fragrant Favourites</h2>
              <p className="text-[18px] text-[#5a2408] dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover our most beloved fragrances, each carefully crafted to capture the essence of luxury and sophistication.
              </p>
            </motion.div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 318}px)` }}
                  drag="x"
                  dragConstraints={{ left: -((cards.length - 3) * 318), right: 0 }}
                >
                  {cards.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </motion.div>
              </div>
              
              {/* Enhanced Navigation buttons */}
              {cards.length > 3 && (
                <>
                  <motion.button
                    onClick={prevSlide}
                    whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentIndex === 0}
                    className={`absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-4 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20 ${
                      currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    }`}
                  >
                    <ChevronLeft size={28} />
                  </motion.button>
                  <motion.button
                    onClick={nextSlide}
                    whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentIndex >= Math.max(1, cards.length - 3) - 1}
                    className={`absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-4 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20 ${
                      currentIndex >= Math.max(1, cards.length - 3) - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    }`}
                  >
                    <ChevronRight size={28} />
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Product Highlight Banner 1 */}
        <ProductHighlightBanner 
          image="/images/baner2.jpeg"
          title="Orange Marmalade Cologne"
          subtitle="Limited Edition"
          description="Experience the vibrant essence of fresh citrus blended with warm amber notes. This exclusive cologne captures the perfect balance between zesty freshness and sophisticated warmth."
          buttonText="Shop Limited Edition"
        />

        {/* The Scents of Summer - Enhanced */}
        <motion.section variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" className="py-20 px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8FF] dark:from-[#0a1a1f] dark:to-[#0d0603]">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-lg text-[#79300f] dark:text-[#f6d110] font-medium uppercase tracking-wider mb-4 block">Seasonal Collection</span>
              <h2 className="text-[60px] font-dm-serif mb-4 text-[#79300f] dark:text-[#f6d110]">The Scents of Summer</h2>
              <p className="text-[18px] text-[#5a2408] dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Embrace the warmth of summer with our refreshing collection of light, airy fragrances that capture the essence of sunny days and balmy nights.
              </p>
            </motion.div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${summerCurrentIndex * 318}px)` }}
                  drag="x"
                  dragConstraints={{ left: -((summerScents.length - 3) * 318), right: 0 }}
                >
                  {summerScents.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </motion.div>
              </div>
              
              {/* Enhanced Navigation buttons */}
              {summerScents.length > 3 && (
                <>
                  <motion.button
                    onClick={prevSummerSlide}
                    whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    disabled={summerCurrentIndex === 0}
                    className={`absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-4 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20 ${
                      summerCurrentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    }`}
                  >
                    <ChevronLeft size={28} />
                  </motion.button>
                  <motion.button
                    onClick={nextSummerSlide}
                    whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    disabled={summerCurrentIndex >= Math.max(1, summerScents.length - 3) - 1}
                    className={`absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-4 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20 ${
                      summerCurrentIndex >= Math.max(1, summerScents.length - 3) - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    }`}
                  >
                    <ChevronRight size={28} />
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Product Highlight Banner 2 */}
        <ProductHighlightBanner 
          image="/images/baner3.jpeg"
          title="New Mini Collection"
          subtitle="Travel Size Luxury"
          description="Take your favorite fragrances wherever you go with our new mini collection. Perfect for travel, gifting, or trying new scents without commitment."
          buttonText="Explore Mini Collection"
          reverse={true}
        />

        {/* Signature Collection - Enhanced with split layout */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-gradient-to-br from-[#F2F2F2] via-[#F8F5F0] to-[#E8E8E8] dark:from-[#0d0603] dark:via-[#1a1410] dark:to-[#021914] py-20 px-6"
        >
          {/* First Row */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h3 className="text-lg text-[#79300f] font-semibold uppercase mb-3 dark:text-[#f6d110] tracking-wider">Discover Our Signature Collection</h3>
              <h2 className="text-[42px] font-dm-serif mb-6 text-[#79300f] dark:text-[#f6d110] leading-tight">
                VESARII Ember Nocturne
              </h2>
              <p className="text-[18px] mb-8 dark:text-white leading-relaxed">
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender, smoked cedar, and a whisper of fire-kissed amber. Designed to enchant from the very first breath.
              </p>
              <Button 
                variant="primary"
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#79300f]/10 to-[#5a2408]/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <img
                  src="/images/newimg7.jpeg"
                  alt="VESARII Perfume"
                  className="w-full h-[400px] object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#f6d110]/20 to-[#79300f]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#79300f]/15 to-[#5a2408]/15 rounded-full blur-xl"></div>
            </motion.div>
          </div>

          {/* Second Row - Reversed */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:order-2"
            >
              <img
                src="/images/baner3.jpeg"
                alt="VESARII Masterpiece"
                className="rounded-2xl object-cover w-full h-[450px] shadow-2xl transform hover:scale-105 transition-all duration-500"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-[#F5E9DC]/80 to-[#E7DDC6]/80 dark:from-[#291e1a]/80 dark:to-[#1a1410]/80 p-10 rounded-3xl text-left backdrop-blur-sm shadow-2xl border border-[#D4C5A9]/50 dark:border-gray-600/50 md:order-1"
            >
              <span className="text-sm uppercase text-[#79300f] tracking-widest dark:text-[#f6d110] font-medium mb-4 block">A Vesarii Masterpiece</span>
              <h3 className="text-[32px] font-bold mt-2 mb-6 dark:text-white leading-tight">
                CRAFTED TO CAPTIVATE. <br />
                <span className="text-[#79300f] dark:text-[#f6d110]">WORN TO REMEMBER.</span>
              </h3>
              <p className="text-[18px] dark:text-white leading-relaxed mb-8">
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender, smoked cedar, and a whisper of fire-kissed amber.
              </p>
              <Button 
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Find out more
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Newsletter / Join Exclusive Circle - Enhanced */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="relative bg-gradient-to-br from-[#79300f] via-[#5a2408] to-[#79300f] dark:from-[#0d0603] dark:via-[#1a1410] dark:to-[#0d0603] py-24 px-6 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f6d110] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-lg text-[#f6d110] font-medium uppercase tracking-wider mb-4 block">Exclusive Access</span>
              <h2 className="text-[50px] md:text-[60px] font-dm-serif mb-6 text-white leading-tight">
                Join Our Exclusive Circle
              </h2>
              <p className="text-[20px] mb-12 text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Subscribe to our newsletter for early access to limited edition releases, private events,
                and the secrets behind our scent creations. Be the first to discover luxury.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center mb-6">
                <input 
                  type="email"
                  placeholder='Enter your email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white/90 text-[#79300f] placeholder-gray-500 px-6 py-4 flex-1 outline-none rounded-xl border border-white/30 backdrop-blur-sm shadow-lg focus:bg-white focus:shadow-xl transition-all duration-300' 
                />
                <Button
                  className='bg-gradient-to-r from-[#f6d110] to-[#e6c200] hover:from-[#e6c200] hover:to-[#f6d110] text-[#79300f] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap'
                  onClick={handleSubscribe}
                >
                  Subscribe Now
                </Button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className='h-5 w-5 accent-[#f6d110]'
                />
                <span className="text-sm text-gray-200">
                  By checking this box, I accept the{' '}
                  <a href="#" className="text-[#f6d110] hover:text-white underline transition-colors">
                    terms and conditions
                  </a>
                  .
                </span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;