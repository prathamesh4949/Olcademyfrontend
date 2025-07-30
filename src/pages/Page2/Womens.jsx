import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';

const WomensCollection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // State for carousel navigation
  const [justArrivedIndex, setJustArrivedIndex] = useState(0);
  const [bestSellersIndex, setBestSellersIndex] = useState(0);
  const [premiumIndex, setPremiumIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Hover images array for interactive cards
  const hoverImages = [
    "/images/newimg2.PNG",
    "/images/newimg3.PNG", 
    "/images/newimg4.PNG",
    "/images/newimg5.PNG",
    "/images/newimg6.png",
    "/images/newimg7.jpeg",
    "/images/newimg8.jpeg",
    "/images/newimg1.PNG",
    "/images/newimg2.PNG",
    "/images/newimg3.PNG",
    "/images/newimg4.PNG",
    "/images/newimg5.PNG"
  ];

  // Just Arrived Products (6 products)
  const justArrivedProducts = [
    {
      id: 1,
      name: 'Rose Elegance',
      price: 465,
      description: 'A timeless blend of Bulgarian rose petals with delicate jasmine undertones',
      image: "/images/newimg1.PNG",
      hoverImage: hoverImages[0]
    },
    {
      id: 2,
      name: 'Midnight Bloom',
      price: 495,
      description: 'Mysterious night-blooming flowers with hints of vanilla and sandalwood',
      image: "/images/newimg2.PNG",
      hoverImage: hoverImages[1]
    },
    {
      id: 3,
      name: 'Golden Orchid',
      price: 435,
      description: 'Exotic orchid essence combined with warm amber and golden honey',
      image: "/images/newimg3.PNG",
      hoverImage: hoverImages[2]
    },
    {
      id: 4,
      name: 'Crystal Blossom',
      price: 530,
      description: 'Pure white florals with crystal-clear musk and soft powder notes',
      image: "/images/newimg4.PNG",
      hoverImage: hoverImages[3]
    },
    {
      id: 5,
      name: 'Velvet Peony',
      price: 585,
      description: 'Luxurious peony petals wrapped in velvet musk and silk accord',
      image: "/images/newimg5.PNG",
      hoverImage: hoverImages[4]
    },
    {
      id: 6,
      name: 'Enchanted Garden',
      price: 455,
      description: 'A magical garden blend of lily, gardenia, and morning dew',
      image: "/images/newimg6.png",
      hoverImage: hoverImages[5]
    }
  ];

  // Best Sellers Products (6 products)
  const bestSellersProducts = [
    {
      id: 7,
      name: 'Diamond Essence',
      price: 505,
      description: 'Sparkling citrus top notes with precious diamond dust accord',
      image: "/images/newimg7.jpeg",
      hoverImage: hoverImages[6]
    },
    {
      id: 8,
      name: 'Moonlight Serenade',
      price: 445,
      description: 'Romantic moonlit florals with soft violin string harmonies',
      image: "/images/newimg8.jpeg",
      hoverImage: hoverImages[7]
    },
    {
      id: 9,
      name: 'Secret Garden',
      price: 475,
      description: 'Hidden garden blooms with mysterious herb and moss undertones',
      image: "/images/newimg1.PNG",
      hoverImage: hoverImages[8]
    },
    {
      id: 10,
      name: 'Silk Whisper',
      price: 520,
      description: 'Gentle silk accord with whispered florals and cashmere warmth',
      image: "/images/newimg2.PNG",
      hoverImage: hoverImages[9]
    },
    {
      id: 11,
      name: 'Royal Bouquet',
      price: 555,
      description: 'Majestic floral arrangement with royal crown jewel essences',
      image: "/images/newimg3.PNG",
      hoverImage: hoverImages[10]
    },
    {
      id: 12,
      name: 'Angel\'s Touch',
      price: 490,
      description: 'Heavenly light florals with angelic musk and cloud-soft powder',
      image: "/images/newimg4.PNG",
      hoverImage: hoverImages[11]
    }
  ];

  // Premium Collection Products (6 products)
  const premiumProducts = [
    {
      id: 13,
      name: 'Empress Crown',
      price: 670,
      description: 'Imperial fragrance with rare saffron, gold rose, and precious gems',
      image: "/images/newimg5.PNG",
      hoverImage: hoverImages[0]
    },
    {
      id: 14,
      name: 'Platinum Rose',
      price: 645,
      description: 'Precious platinum-infused rose with silver cedar and diamond dew',
      image: "/images/newimg6.png",
      hoverImage: hoverImages[1]
    },
    {
      id: 15,
      name: 'Dark Goddess',
      price: 705,
      description: 'Divine darkness with black orchid, midnight truffle, and shadow musk',
      image: "/images/newimg7.jpeg",
      hoverImage: hoverImages[2]
    },
    {
      id: 16,
      name: 'Crystal Queen',
      price: 615,
      description: 'Crystalline beauty with transparent florals and queen\'s crown accord',
      image: "/images/newimg8.jpeg",
      hoverImage: hoverImages[3]
    },
    {
      id: 17,
      name: 'Mystic Princess',
      price: 635,
      description: 'Enchanted princess essence with mystical herbs and fairy dust',
      image: "/images/newimg1.PNG",
      hoverImage: hoverImages[4]
    },
    {
      id: 18,
      name: 'Infinity Grace',
      price: 725,
      description: 'Endless elegance with infinite layers of graceful floral harmony',
      image: "/images/newimg2.PNG",
      hoverImage: hoverImages[5]
    }
  ];

  // Navigation functions (showing 4 cards at a time)
  const nextJustArrived = () => {
    setJustArrivedIndex((prev) => (prev + 1) % Math.max(1, justArrivedProducts.length - 3));
  };

  const prevJustArrived = () => {
    setJustArrivedIndex((prev) => (prev - 1 + Math.max(1, justArrivedProducts.length - 3)) % Math.max(1, justArrivedProducts.length - 3));
  };

  const nextBestSellers = () => {
    setBestSellersIndex((prev) => (prev + 1) % Math.max(1, bestSellersProducts.length - 3));
  };

  const prevBestSellers = () => {
    setBestSellersIndex((prev) => (prev - 1 + Math.max(1, bestSellersProducts.length - 3)) % Math.max(1, bestSellersProducts.length - 3));
  };

  const nextPremium = () => {
    setPremiumIndex((prev) => (prev + 1) % Math.max(1, premiumProducts.length - 3));
  };

  const prevPremium = () => {
    setPremiumIndex((prev) => (prev - 1 + Math.max(1, premiumProducts.length - 3)) % Math.max(1, premiumProducts.length - 3));
  };

  const ProductCard = ({ product, isCompact = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        className={`bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left relative flex-shrink-0 border border-[#D4C5A9] group hover:scale-105 ${isCompact ? 'w-[300px]' : 'w-full'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 text-[#79300f] hover:text-red-600 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md transition-all duration-200 hover:bg-white"
        >
          <FiHeart size={18} className={isInWishlist(product.id) ? 'fill-red-600' : ''} />
        </button>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-inner">
          <img 
            src={isHovered && product.hoverImage ? product.hoverImage : product.image} 
            alt={product.name} 
            className={`${isCompact ? 'h-[200px]' : 'h-[300px]'} w-full object-contain transition-all duration-300 group-hover:scale-105`} 
          />
        </div>
        <div className="space-y-2">
          <h3 className={`${isCompact ? 'text-[20px]' : 'text-[30px]'} font-alata text-[#5a2408] font-bold`}>{product.name}</h3>
          <p className={`${isCompact ? 'text-[12px]' : 'text-[16px]'} text-[#8b4513] italic leading-relaxed`}>
            {product.description || "Exquisite fragrance notes"}
          </p>
          <div className="flex items-center justify-between pt-2">
            <p className={`${isCompact ? 'text-[20px]' : 'text-[26px]'} font-bold text-[#79300f]`}>${product.price}</p>
            <div className="bg-[#79300f]/10 px-2 py-1 rounded-full">
              <span className="text-xs text-[#79300f] font-medium">PREMIUM</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full mt-4 bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add to Cart
        </Button>
      </div>
    );
  };

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
          <motion.h1 variants={fadeIn('up', 0.3)} className="text-[60px] font-dm-serif mb-6 dark:text-white">
            Women's Fragrances
          </motion.h1>
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-[20px] leading-relaxed max-w-4xl mx-auto text-[#5a2408] dark:text-[#f6d110]"
          >
            Creating iconic hand-crafted perfumes for women, our collection has established a legacy of 
            sophisticated fragrances. Explore our bestselling women's fragrances crafted for the modern lady.
          </motion.p>
        </motion.section>

        {/* Attractive Banner Section */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="relative py-0 overflow-hidden"
        >
          <div className="relative h-[500px] bg-gradient-to-r from-black/50 to-transparent">
            <img 
              src="/images/baner2.jpeg" 
              alt="Women's Collection Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-start pl-12">
              <div className="text-white max-w-2xl">
                <h2 className="text-[48px] font-dm-serif mb-6 leading-tight">
                  Signature Women's <br />
                  <span className="text-[#f6d110]">Collection</span>
                </h2>
                <p className="text-[20px] mb-8 text-gray-200">
                  Discover our exclusive range of premium fragrances designed for the sophisticated woman. 
                  Each scent tells a story of luxury, elegance, and femininity.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Just Arrived - With Slider */}
        <motion.section 
          variants={fadeIn("up", 0.2)} 
          initial="hidden" 
          whileInView="show" 
          className="py-16 px-6 bg-[#F2F2F2] dark:bg-[#0d0603]"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-[50px] font-dm-serif mb-12 dark:text-white">Just Arrived</h3>
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${justArrivedIndex * 318}px)` }}
                >
                  {justArrivedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevJustArrived}
                className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextJustArrived}
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Rose Garden Banner - Updated */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F2F2F2] dark:bg-[#021914] py-16 px-6"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h3 className="text-lg text-[#79300f] font-semibold uppercase mb-3 dark:text-[#f6d110]">Limited Edition</h3>
              <h2 className="text-[42px] font-dm-serif mb-6 dark:text-white">Rose Garden Essence</h2>
              <p className="text-[18px] mb-6 text-[#5a2408] dark:text-gray-300 leading-relaxed">
                A sophisticated blend of Bulgarian roses with sweet garden notes, creating a unique fragrance 
                that captures the essence of a blooming rose garden at dawn.
              </p>
              <Button 
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Shop Rose Garden
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#f6d110]/20 to-[#79300f]/20 rounded-2xl p-8">
                <img
                  src="/images/baner2.jpeg"
                  alt="Rose Garden Essence"
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Best Sellers - With Slider */}
        <motion.section 
          variants={fadeIn("up", 0.2)} 
          initial="hidden" 
          whileInView="show" 
          className="py-16 px-6 bg-[#F2F2F2] dark:bg-[#0d0603]"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-[50px] font-dm-serif mb-12 dark:text-white">Best Sellers</h3>
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${bestSellersIndex * 318}px)` }}
                >
                  {bestSellersProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevBestSellers}
                className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextBestSellers}
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Signature Collection */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F2F2F2] dark:bg-[#0d0603] py-16 px-6"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-lg text-[#79300f] font-semibold uppercase mb-3 dark:text-[#f6d110]">Signature Collection</h3>
              <h2 className="text-[42px] font-dm-serif mb-6 dark:text-white">
                CRAFTED FOR THE <br />
                <span className="text-[#79300f] dark:text-[#f6d110]">MODERN WOMAN</span>
              </h2>
              <p className="text-[18px] mb-6 text-[#5a2408] dark:text-gray-300 leading-relaxed">
                Each fragrance in our signature collection tells a story of sophistication, grace, and elegance. 
                Meticulously crafted with the finest floral ingredients from around the world.
              </p>
              <Button 
                className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Explore Signature Collection
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#79300f]/10 to-[#5a2408]/10 rounded-2xl p-8">
                <img
                  src="/images/newimg1.PNG"
                  alt="Signature Collection"
                  className="w-full h-[400px] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Premium Collection - With Slider */}
        <motion.section 
          variants={fadeIn("up", 0.2)} 
          initial="hidden" 
          whileInView="show" 
          className="py-16 px-6 bg-gradient-to-b from-[#E8E8E8] to-[#F2F2F2] dark:from-[#1a1410] dark:to-[#0d0603]"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-[50px] font-dm-serif mb-4 dark:text-white">Huntsman Savile Row</h3>
            <p className="text-[20px] mb-12 text-[#5a2408] dark:text-[#f6d110] max-w-3xl mx-auto">
              Our most exclusive fragrances, crafted with rare and precious ingredients for the discerning woman.
            </p>
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${premiumIndex * 318}px)` }}
                >
                  {premiumProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevPremium}
                className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextPremium}
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default WomensCollection;