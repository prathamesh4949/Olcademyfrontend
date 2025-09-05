import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../variants';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { 
  Heart, 
  Star, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Droplets,
  ShoppingCart,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Truck,
  RotateCcw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import ProductService from '../services/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [personalizationText, setPersonalizationText] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistNotifications, setWishlistNotifications] = useState([]);

  // Scroll to top when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }, [id]);

  // Load theme preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Product fetching with timeout and error handling
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      const timeout = setTimeout(() => {
        setError('Request timed out. Please try again.');
        setLoading(false);
      }, 10000);

      try {
        setLoading(true);
        setError(null);

        const cleanId = id.toString().trim();
        console.log('🔍 ProductDetailPage: Fetching product with ID:', cleanId);
        if (cleanId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
          throw new Error('Invalid product ID format');
        }

        const existsResponse = await ProductService.checkProductExists(cleanId);
        console.log('🔍 Product exists response:', existsResponse);
        if (!existsResponse.success || !existsResponse.exists) {
          throw new Error(`Product with ID ${cleanId} not found`);
        }

        const response = await ProductService.getProduct(cleanId);
        console.log('🔍 Product data:', JSON.stringify(response.data, null, 2));
        if (response.success && response.data?.product) {
          const productData = response.data.product;
          console.log('🔍 Product sizes:', productData.sizes);
          setProduct(productData);
          setRelatedProducts(response.data.relatedProducts || []);
          setIsWishlisted(isInWishlist(productData._id));

          if (productData.sizes && productData.sizes.length > 0) {
            const availableSize = productData.sizes.find(size => size.available);
            if (availableSize) {
              setSelectedSize(availableSize);
              setQuantity(1);
              console.log('🔍 Selected default size:', availableSize);
            } else {
              console.warn('⚠️ No available sizes found for product:', productData.name);
            }
          } else {
            console.warn('⚠️ No sizes array found for product:', productData.name);
          }
        } else {
          throw new Error(response.message || 'Invalid response format');
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(`Failed to load product: ${err.message}`);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isInWishlist]);

  // Reset quantity when size changes
  useEffect(() => {
    if (selectedSize) {
      setQuantity(1);
      console.log('🔍 Quantity reset for size:', selectedSize.size);
    }
  }, [selectedSize]);

  // Notification system for cart and wishlist
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setWishlistNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setWishlistNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const showSuccessNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddToCart = () => {
    if (!product) {
      console.error('❌ No product data available for cart');
      addNotification('Product information is incomplete', 'error');
      return;
    }
    
    if (product.sizes?.length > 0 && !selectedSize) {
      addNotification('Please select a size first', 'error');
      return;
    }

    if (selectedSize && selectedSize.stock === 0) {
      addNotification('Selected size is out of stock', 'error');
      return;
    }

    if (selectedSize && quantity > selectedSize.stock) {
      addNotification(`Only ${selectedSize.stock} items available`, 'error');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: selectedSize?.price || product.price,
      image: product.images?.[0] || '/images/default-perfume.png',
      quantity,
      selectedSize: selectedSize?.size || null,
      personalization: personalizationText || null
    };

    console.log('🛒 Adding to cart:', cartItem);
    addToCart(cartItem).then(success => {
      if (success) {
        showSuccessNotification();
      } else {
        addNotification('Failed to add item to cart', 'error');
      }
    });
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = Math.max(1, prev + change);
      if (selectedSize && newQuantity > selectedSize.stock) {
        addNotification(`Only ${selectedSize.stock} items available`, 'error');
        return prev;
      }
      return newQuantity;
    });
  };

  const handleSizeSelect = (size) => {
    if (size.available) {
      setSelectedSize(size);
      setQuantity(1);
      console.log('🔍 Selected size:', size);
    } else {
      addNotification('Selected size is not available', 'error');
    }
  };

  const handlePersonalizationToggle = () => {
    setShowPersonalization(!showPersonalization);
    if (!showPersonalization) {
      setPersonalizationText('');
    }
  };

  const handleRelatedProductClick = (relatedProduct) => {
    if (relatedProduct?._id) {
      navigate(`/product/${relatedProduct._id}`);
      console.log('🔍 Navigating to related product:', relatedProduct._id);
    } else {
      console.error('❌ Invalid related product ID');
      addNotification('Unable to view related product', 'error');
    }
  };

  const handleWishlistToggle = () => {
    if (!product) {
      addNotification('Product information is incomplete', 'error');
      return;
    }

    const wasInWishlist = isInWishlist(product._id);
    
    if (wasInWishlist) {
      const wishlistProduct = {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-perfume.png',
        description: product.description || '',
        category: product.category || '',
        selectedSize: null
      };
      toggleWishlist(wishlistProduct);
      setIsWishlisted(false);
      addNotification('Removed from wishlist', 'success');
    } else {
      if (isInWishlist(product._id)) {
        addNotification('Product already in wishlist', 'error');
        return;
      }
      
      const wishlistProduct = {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-perfume.png',
        description: product.description || '',
        category: product.category || '',
        selectedSize: null
      };
      
      toggleWishlist(wishlistProduct);
      setIsWishlisted(true);
      addNotification('Added to wishlist!', 'success');
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Notification System
  const NotificationSystem = () => (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {wishlistNotifications.map((notification) => (
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex justify-center items-center h-96">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full opacity-75 mx-auto mb-6"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
            </motion.div>
            <motion.p 
              className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading your perfect fragrance...
            </motion.p>
            <p className="text-sm text-amber-600 dark:text-amber-300">Product ID: {id}</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex justify-center items-center min-h-[500px]">
          <motion.div 
            className="text-center max-w-2xl mx-auto p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <X className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Fragrance Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{error}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate(-1)}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
                  aria-label="Go back to previous page"
                >
                  Go Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  aria-label="Browse all collections"
                >
                  Browse All
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const totalPrice = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full opacity-20 dark:opacity-10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full opacity-20 dark:opacity-10"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* Notification Systems */}
      <NotificationSystem />
      
      {/* Success Notification for Cart */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.3 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Check className="w-5 h-5" />
            </motion.div>
            <div className="flex-1">
              <p className="font-semibold">Added to Cart!</p>
              <p className="text-sm opacity-90">
                {quantity} × {product.name} {selectedSize && `(${selectedSize.size})`}
              </p>
            </div>
            <motion.button
              onClick={() => setShowNotification(false)}
              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-white mb-8 transition-all duration-300 group"
          whileHover={{ x: -5 }}
          aria-label="Go back to collection"
        >
          <motion.div
            className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.div>
          <span className="font-medium">Back to Collection</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="relative group">
              <motion.div 
                className="bg-gradient-to-br from-white via-amber-50/50 to-orange-100/50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  key={selectedImage}
                  src={
                    product.images && product.images[selectedImage] 
                      ? product.images[selectedImage] 
                      : '/images/default-perfume.png'
                  }
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  className="w-full h-[600px] object-contain"
                  onError={(e) => {
                    e.target.src = '/images/default-perfume.png';
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>

              {/* Image Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 justify-center">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index 
                        ? 'ring-4 ring-amber-500 shadow-lg scale-110' 
                        : 'hover:ring-2 hover:ring-amber-300 hover:scale-105'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/default-perfume.png';
                      }}
                    />
                    {selectedImage === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <motion.h1 
                    className="text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.name}
                  </motion.h1>
                  {product.brand && (
                    <motion.p 
                      className="text-xl text-amber-600 dark:text-amber-400 font-medium"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {product.brand}
                    </motion.p>
                  )}
                </div>
                <motion.button
                  onClick={handleWishlistToggle}
                  className="relative w-14 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    size={28} 
                    className={`transition-all ${
                      isWishlisted 
                        ? 'fill-red-500 text-red-500 scale-110' 
                        : 'text-gray-400 dark:text-gray-500 hover:text-red-400'
                    }`}
                  />
                  {isWishlisted && (
                    <motion.div
                      className="absolute inset-0 bg-red-500/20 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </motion.button>
              </div>
              
              <motion.p 
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {product.description}
              </motion.p>

              {/* Rating */}
              {product.rating && (
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Star
                          size={24}
                          className={`${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    {product.rating}/5
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (248 reviews)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Price */}
            <motion.div 
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {currentPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  {quantity > 1 && (
                    <span className="text-lg text-gray-600 dark:text-gray-400 ml-3">
                      Total: {totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"></p>
              </div>
            </motion.div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Select Size
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.sizes.map((size, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      disabled={!size.available}
                      className={`relative p-4 rounded-2xl font-medium transition-all border-2 ${
                        selectedSize?.size === size.size
                          ? 'border-amber-500 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 shadow-lg'
                          : size.available
                          ? 'border-gray-200 dark:border-gray-600 hover:border-amber-300 bg-white/80 dark:bg-gray-800/80 hover:bg-amber-50 dark:hover:bg-amber-900/20 backdrop-blur-sm'
                          : 'border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800/30'
                      }`}
                      whileHover={size.available ? { scale: 1.02, y: -2 } : {}}
                      whileTap={size.available ? { scale: 0.98 } : {}}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      aria-label={`Select ${size.size} - ${size.available ? `${size.stock} in stock` : 'Not Available'}`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{size.size}</div>
                        <div className="text-sm opacity-75">
                          {size.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </div>
                        <div className={`text-xs mt-1 ${
                          size.available 
                            ? size.stock <= 5 
                              ? 'text-red-500' 
                              : 'text-green-600'
                            : 'text-gray-400'
                        }`}>
                          {size.available 
                            ? size.stock <= 5 
                              ? `Only ${size.stock} left!` 
                              : `${size.stock} in stock`
                            : 'Out of stock'
                          }
                        </div>
                      </div>
                      {selectedSize?.size === size.size && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity Selection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Quantity
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
                  <motion.button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      quantity <= 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                    }`}
                    whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                    whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} />
                  </motion.button>
                  <div className="w-16 text-center">
                    <motion.span 
                      className="text-2xl font-bold text-gray-800 dark:text-white"
                      key={quantity}
                      initial={{ scale: 1.2, color: '#f59e0b' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      transition={{ duration: 0.2 }}
                    >
                      {quantity}
                    </motion.span>
                  </div>
                  <motion.button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedSize && quantity >= selectedSize.stock}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      selectedSize && quantity >= selectedSize.stock 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                    }`}
                    whileHover={!selectedSize || quantity < selectedSize.stock ? { scale: 1.1 } : {}}
                    whileTap={!selectedSize || quantity < selectedSize.stock ? { scale: 0.9 } : {}}
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>
                {selectedSize && (
                  <motion.p 
                    className="text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {selectedSize.stock} available
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Personalization */}
            {product.personalization && product.personalization.available && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Personalize Your Bottle
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-medium">
                    {product.personalization.price > 0 
                      ? `+${product.personalization.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
                      : 'Free'
                    }
                  </span>
                </div>
                
                <motion.div
                  className={`p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer backdrop-blur-sm ${
                    showPersonalization 
                      ? 'border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-amber-300 bg-white/50 dark:bg-gray-800/50'
                  }`}
                  onClick={handlePersonalizationToggle}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                      {showPersonalization ? 'Hide Personalization' : 'Add Personal Touch'}
                    </span>
                    <motion.div
                      animate={{ rotate: showPersonalization ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5 text-amber-600" />
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showPersonalization && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        value={personalizationText}
                        onChange={(e) => setPersonalizationText(e.target.value)}
                        maxLength={product.personalization.max_characters || 15}
                        placeholder="Enter your text..."
                        className="w-full p-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-800/80 dark:text-white rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 focus:outline-none transition-all backdrop-blur-sm"
                        aria-label="Personalization text input"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {personalizationText.length}/{product.personalization.max_characters || 15} characters
                        </span>
                        <span className="text-amber-600 dark:text-amber-400">
                          Preview: "{personalizationText || 'Your text here'}"
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Add to Cart Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="pt-6"
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={product.sizes?.length > 0 && (!selectedSize || selectedSize.stock === 0)}
                className={`w-full relative overflow-hidden font-bold py-6 rounded-2xl text-lg shadow-2xl transition-all duration-300 ${
                  product.sizes?.length > 0 && (!selectedSize || selectedSize.stock === 0) 
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:via-orange-700 hover:to-amber-800 text-white shadow-amber-500/30'
                }`}
                whileHover={
                  !(product.sizes?.length > 0 && (!selectedSize || selectedSize.stock === 0))
                    ? { scale: 1.02, y: -2 } 
                    : {}
                }
                whileTap={
                  !(product.sizes?.length > 0 && (!selectedSize || selectedSize.stock === 0))
                    ? { scale: 0.98 } 
                    : {}
                }
                aria-label={
                  product.sizes?.length > 0 && !selectedSize 
                    ? 'Select size to add to cart' 
                    : product.sizes?.length > 0 && selectedSize?.stock === 0 
                    ? 'Out of stock' 
                    : 'Add to cart'
                }
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center justify-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  <span>
                    {product.sizes?.length > 0 && !selectedSize 
                      ? 'Select Size First'
                      : product.sizes?.length > 0 && selectedSize?.stock === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'
                    }
                  </span>
                </div>
              </motion.button>
            </motion.div>

            {/* Product Details Accordion */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              {product.fragrance_notes && (
                <div className="bg-gradient-to-r from-white/80 to-amber-50/80 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                  <h4 className="font-bold text-xl text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-3">
                    <Droplets className="w-6 h-6" />
                    Fragrance Profile
                  </h4>
                  <div className="space-y-4">
                    {product.fragrance_notes.top?.length > 0 && (
                      <div className="flex gap-4">
                        <span className="font-semibold text-amber-700 dark:text-amber-300 min-w-[80px]">
                          Top Notes:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.fragrance_notes.top.map((note, index) => (
                            <motion.span
                              key={index}
                              className="px-3 py-1 bg-amber-200/50 dark:bg-amber-800/30 text-amber-800 dark:text-amber-200 rounded-full text-sm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.3 + index * 0.1 }}
                            >
                              {note}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.fragrance_notes.middle?.length > 0 && (
                      <div className="flex gap-4">
                        <span className="font-semibold text-amber-700 dark:text-amber-300 min-w-[80px]">
                          Heart:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.fragrance_notes.middle.map((note, index) => (
                            <motion.span
                              key={index}
                              className="px-3 py-1 bg-orange-200/50 dark:bg-orange-800/30 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.4 + index * 0.1 }}
                            >
                              {note}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.fragrance_notes.base?.length > 0 && (
                      <div className="flex gap-4">
                        <span className="font-semibold text-amber-700 dark:text-amber-300 min-w-[80px]">
                          Base:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.fragrance_notes.base.map((note, index) => (
                            <motion.span
                              key={index}
                              className="px-3 py-1 bg-rose-200/50 dark:bg-rose-800/30 text-rose-800 dark:text-rose-200 rounded-full text-sm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.5 + index * 0.1 }}
                            >
                              {note}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {product.concentration && (
                  <motion.div
                    className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">Type:</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.concentration}</span>
                  </motion.div>
                )}
                {product.longevity && (
                  <motion.div
                    className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">Longevity:</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.longevity}</span>
                  </motion.div>
                )}
                {product.sillage && (
                  <motion.div
                    className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">Projection:</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.sillage}</span>
                  </motion.div>
                )}
                {product.volume && (
                  <motion.div
                    className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">Volume:</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.volume}</span>
                  </motion.div>
                )}
              </div>

              {/* Occasion and Season Tags */}
              {(product.occasion?.length > 0 || product.season?.length > 0) && (
                <div className="space-y-4">
                  {product.occasion?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.7 }}
                    >
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Perfect For:</h5>
                      <div className="flex flex-wrap gap-2">
                        {product.occasion.map((occ, index) => (
                          <motion.span 
                            key={index} 
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.7 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {occ}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {product.season?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 }}
                    >
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Best Season:</h5>
                      <div className="flex flex-wrap gap-2">
                        {product.season.map((season, index) => (
                          <motion.span 
                            key={index} 
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.8 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {season}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-24"
          >
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent mb-4">
                You Might Also Love
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover more exquisite fragrances curated just for you
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  onClick={() => handleRelatedProductClick(relatedProduct)}
                  className="group bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleRelatedProductClick(relatedProduct)}
                  aria-label={`View ${relatedProduct.name}`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-orange-400/0 to-amber-500/0 group-hover:from-amber-400/10 group-hover:via-orange-400/5 group-hover:to-amber-500/10 transition-all duration-500"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  
                  <div className="relative">
                    <motion.div 
                      className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-inner group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={relatedProduct.images?.[0] || '/images/default-perfume.png'}
                        alt={`${relatedProduct.name} - Related Product`}
                        className="h-56 w-full object-contain transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/images/default-perfume.png';
                        }}
                      />
                    </motion.div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {relatedProduct.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {relatedProduct.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        {relatedProduct.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={18} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {relatedProduct.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <motion.div
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180 text-amber-600" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;