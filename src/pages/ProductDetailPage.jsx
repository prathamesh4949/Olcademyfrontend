import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { fadeIn } from '../variants';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { 
  Heart, 
  Star, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Droplets
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
  }, [id]);

  // Reset quantity when size changes
  useEffect(() => {
    if (selectedSize) {
      setQuantity(1);
      console.log('🔍 Quantity reset for size:', selectedSize.size);
    }
  }, [selectedSize]);

  const handleAddToCart = () => {
    if (!product) {
      console.error('❌ No product data available for cart');
      return;
    }
    
    if (product.sizes?.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (selectedSize && selectedSize.stock === 0) {
      alert(`Selected size ${selectedSize.size} is out of stock`);
      return;
    }

    if (selectedSize && quantity > selectedSize.stock) {
      alert(`Only ${selectedSize.stock} items available for ${selectedSize.size}`);
      return;
    }

    const cartItem = {
      ...product,
      id: product._id,
      selectedSize: selectedSize?.size,
      price: selectedSize?.price || product.price,
      quantity,
      stock: selectedSize?.stock || 0,
      personalization: personalizationText || null
    };

    addToCart(cartItem);
    alert(`Added ${quantity} x ${product.name} (${selectedSize?.size || 'Default'}) to cart!`);
    console.log('🛒 Added to cart:', cartItem);
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = Math.max(1, prev + change);
      if (selectedSize && newQuantity > selectedSize.stock) {
        alert(`Maximum stock for ${selectedSize.size} is ${selectedSize.stock}`);
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
      alert(`Size ${size.size} is not available`);
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0d0603]">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#79300f] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading product...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Product ID: {id}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#0d0603]">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-4 text-[#79300f] dark:text-[#f6d110]">
              Product Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={() => navigate(-1)}
                className="bg-[#79300f] text-white px-6 py-2 rounded-lg hover:bg-[#5a2408] transition-colors"
                aria-label="Go back to previous page"
              >
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Browse all collections"
              >
                Browse All
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const totalPrice = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#79300f] hover:text-[#5a2408] dark:text-[#f6d110] dark:hover:text-white mb-6 transition-colors"
          aria-label="Go back to collection"
        >
          <ArrowLeft size={20} />
          Back to Collection
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] rounded-3xl p-8 shadow-xl">
              <img
                src={
                  product.images && product.images[selectedImage] 
                    ? product.images[selectedImage] 
                    : '/images/default-perfume.png'
                }
                alt={`${product.name} - Main Image`}
                className="w-full h-[500px] object-contain"
                onError={(e) => {
                  e.target.src = '/images/default-perfume.png';
                }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-[#79300f] shadow-lg' 
                        : 'border-gray-300 hover:border-[#79300f]'
                    }`}
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
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-dm-serif text-[#79300f] dark:text-[#f6d110] font-bold">
                  {product.name}
                </h1>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
                  aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    size={24} 
                    className={`${
                      isInWishlist(product._id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                </button>
              </div>
              
              {product.brand && (
                <p className="text-lg text-[#79300f] dark:text-[#f6d110] opacity-80 mb-2">
                  {product.brand}
                </p>
              )}
              
              <p className="text-lg text-[#5a2408] dark:text-gray-300 leading-relaxed mb-4">
                {product.description}
              </p>

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`${
                          i < Math.floor(product.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating}/5
                  </span>
                </div>
              )}
            </div>

            <div className="text-3xl font-bold text-[#79300f] dark:text-[#f6d110]">
              {currentPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              {quantity > 1 && (
                <span className="text-lg text-gray-600 dark:text-gray-400 ml-2">
                  (Total: {totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})
                </span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#79300f] dark:text-[#f6d110]">
                  Size
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      disabled={!size.available}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all relative ${
                        selectedSize?.size === size.size
                          ? 'border-[#79300f] bg-[#79300f] text-white'
                          : size.available
                          ? 'border-gray-300 dark:border-gray-600 hover:border-[#79300f] text-[#79300f] dark:text-[#f6d110]'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      }`}
                      aria-label={`Select ${size.size} - ${size.available ? `${size.stock} in stock` : 'Not Available'}`}
                    >
                      <div>
                        {size.size}
                        <span className="block text-xs">
                          {size.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                        <span className="block text-xs">
                          {size.available ? `${size.stock} in stock` : 'Not Available'}
                        </span>
                        {size.available && size.stock <= 5 && size.stock > 0 && (
                          <span className="block text-xs text-red-500 dark:text-red-400">
                            Low Stock
                          </span>
                        )}
                        {!size.available && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-lg text-red-500 dark:text-red-400">
                No size variants available for this product.
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#79300f] dark:text-[#f6d110]">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 rounded-full border-2 border-[#79300f] text-[#79300f] hover:bg-[#79300f] hover:text-white dark:border-[#f6d110] dark:text-[#f6d110] dark:hover:bg-[#f6d110] dark:hover:text-[#0d0603] transition-all flex items-center justify-center ${
                    quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={selectedSize && quantity >= selectedSize.stock}
                  className={`w-10 h-10 rounded-full border-2 border-[#79300f] text-[#79300f] hover:bg-[#79300f] hover:text-white dark:border-[#f6d110] dark:text-[#f6d110] dark:hover:bg-[#f6d110] dark:hover:text-[#0d0603] transition-all flex items-center justify-center ${
                    selectedSize && quantity >= selectedSize.stock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedSize.stock} available
                </p>
              )}
            </div>

            {product.personalization && product.personalization.available && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#79300f] dark:text-[#f6d110]">
                    Personalize My Bottle
                  </h3>
                  <span className="text-sm text-green-600 font-medium">
                    {product.personalization.price > 0 
                      ? `+${product.personalization.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
                      : 'Free'
                    }
                  </span>
                </div>
                
                <button
                  onClick={handlePersonalizationToggle}
                  className="w-full text-left p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#79300f] dark:hover:border-[#f6d110] transition-all"
                  aria-label={showPersonalization ? 'Hide personalization options' : 'Show personalization options'}
                >
                  <span className="text-[#79300f] dark:text-[#f6d110]">
                    {showPersonalization ? 'Hide Personalization' : 'Add Personalization'}
                  </span>
                </button>

                {showPersonalization && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={personalizationText}
                      onChange={(e) => setPersonalizationText(e.target.value)}
                      maxLength={product.personalization.max_characters || 15}
                      placeholder="Enter your text..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-[#79300f] dark:focus:border-[#f6d110] focus:outline-none"
                      aria-label="Personalization text input"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {personalizationText.length}/{product.personalization.max_characters || 15} characters
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={product.sizes?.length > 0 && (!selectedSize || selectedSize.stock === 0)}
              className={`w-full bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-semibold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                product.sizes?.length > 0 && (!selectedSize || selectedSize.stock === 0) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              aria-label={
                product.sizes?.length > 0 && !selectedSize 
                  ? 'Select size to add to cart' 
                  : product.sizes?.length > 0 && selectedSize?.stock === 0 
                  ? 'Out of stock' 
                  : 'Add to cart'
              }
            >
              {product.sizes?.length > 0 && !selectedSize 
                ? 'Select Size to Add to Cart'
                : product.sizes?.length > 0 && selectedSize?.stock === 0
                ? 'Out of Stock'
                : 'Add to Cart'
              }
            </Button>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {product.fragrance_notes && (
                <div>
                  <h4 className="font-semibold text-[#79300f] dark:text-[#f6d110] mb-3 flex items-center gap-2">
                    <Droplets size={18} />
                    Fragrance Notes
                  </h4>
                  <div className="space-y-2 text-sm">
                    {product.fragrance_notes.top?.length > 0 && (
                      <div>
                        <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                          Top:
                        </span>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.fragrance_notes.top.join(', ')}
                        </span>
                      </div>
                    )}
                    {product.fragrance_notes.middle?.length > 0 && (
                      <div>
                        <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                          Middle:
                        </span>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.fragrance_notes.middle.join(', ')}
                        </span>
                      </div>
                    )}
                    {product.fragrance_notes.base?.length > 0 && (
                      <div>
                        <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                          Base:
                        </span>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.fragrance_notes.base.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.concentration && (
                  <div>
                    <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                      Type:
                    </span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.concentration}
                    </span>
                  </div>
                )}
                {product.longevity && (
                  <div>
                    <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                      Longevity:
                    </span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.longevity}
                    </span>
                  </div>
                )}
                {product.sillage && (
                  <div>
                    <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                      Sillage:
                    </span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.sillage}
                    </span>
                  </div>
                )}
                {product.volume && (
                  <div>
                    <span className="font-medium text-[#79300f] dark:text-[#f6d110]">
                      Volume:
                    </span>{' '}
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.volume}
                    </span>
                  </div>
                )}
              </div>

              {(product.occasion || product.season) && (
                <div className="space-y-3">
                  {product.occasion?.length > 0 && (
                    <div>
                      <span className="font-medium text-[#79300f] dark:text-[#f6d110] block mb-2">
                        Occasion:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.occasion.map((occ, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-[#79300f]/10 dark:bg-[#f6d110]/10 text-[#79300f] dark:text-[#f6d110] rounded-full text-xs"
                          >
                            {occ}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.season?.length > 0 && (
                    <div>
                      <span className="font-medium text-[#79300f] dark:text-[#f6d110] block mb-2">
                        Season:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.season.map((season, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-[#79300f]/10 dark:bg-[#f6d110]/10 text-[#79300f] dark:text-[#f6d110] rounded-full text-xs"
                          >
                            {season}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-dm-serif text-[#79300f] dark:text-[#f6d110] mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  onClick={() => handleRelatedProductClick(relatedProduct)}
                  className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleRelatedProductClick(relatedProduct)}
                  aria-label={`View ${relatedProduct.name}`}
                >
                  <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-inner">
                    <img
                      src={relatedProduct.images?.[0] || '/images/default-perfume.png'}
                      alt={`${relatedProduct.name} - Related Product`}
                      className="h-48 w-full object-contain transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/default-perfume.png';
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#5a2408] dark:text-gray-200 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-[#8b4513] dark:text-gray-400 mb-2 line-clamp-2">
                    {relatedProduct.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-[#79300f] dark:text-[#f6d110]">
                      {relatedProduct.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                    {relatedProduct.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span className="text-sm text-[#79300f] dark:text-[#f6d110]">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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