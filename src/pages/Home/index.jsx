import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/common/HeroSection';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Checkbox from '../../components/ui/Checkbox';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/CartContext';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
    { id: 1, name: "Aventus", price: 455, image: "/images/newimg1.PNG", hoverImage: hoverImages[0] },
    { id: 2, name: "Oud Wood", price: 455, image: "/images/newimg2.PNG", hoverImage: hoverImages[1] },
    { id: 3, name: "Creed", price: 455, image: "/images/newimg3.PNG", hoverImage: hoverImages[2] },
    { id: 7, name: "Royal Essence", price: 520, image: "/images/newimg4.PNG", hoverImage: hoverImages[3] },
    { id: 8, name: "Mystic Rose", price: 480, image: "/images/newimg5.PNG", hoverImage: hoverImages[4] },
    { id: 9, name: "Golden Amber", price: 495, image: "/images/newimg6.png", hoverImage: hoverImages[5] },
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
      alert('Thank you for subscribing!');
      setEmail('');
      setAcceptTerms(false);
    } else alert('Please enter email and accept terms.');
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

  // Updated ProductCard component to match MensCollection style
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
        <motion.div variants={fadeIn('up', 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.4 }}>
          <HeroSection />
        </motion.div>

        {/* Fragrant Favourites - Updated with new card style and slider */}
        <motion.section variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[60px] font-dm-serif mb-12">Fragrant Favourites</h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 318}px)` }}
                >
                  {cards.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Updated section with new banner images */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F2F2F2] dark:bg-[#021914] py-16 px-6"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Orange Marmalade Cologne */}
            <div className="text-center">
              <img
                src="/images/baner1.jpeg"
                alt="Orange Marmalade Cologne"
                className="w-full h-[400px] object-cover mb-4 rounded-xl"
              />
              <h3 className="text-[20px] md:text-[24px] font-alata mb-3">
                Orange Marmalade Cologne
              </h3>
              <Button variant="primary" className="bg-[#6E3B23] text-white">
                Shop Now
              </Button>
            </div>

            {/* New Mini Collection */}
            <div className="text-center">
              <img
                src="/images/baner2.jpeg"
                alt="New Mini Collection"
                className="w-full h-[400px] object-cover mb-4 rounded-xl"
              />
              <h3 className="text-[20px] md:text-[24px] font-alata mb-3">
                New Mini Collection
              </h3>
              <Button variant="primary" className="bg-[#6E3B23] text-white">
                Shop Now
              </Button>
            </div>
          </div>
        </motion.section>

        {/* The Scents of Summer - Updated with new card style and slider */}
        <motion.section variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[60px] font-dm-serif mb-12">The Scents of Summer</h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${summerCurrentIndex * 318}px)` }}
                >
                  {summerScents.map((product) => (
                    <ProductCard key={product.id} product={product} isCompact={true} />
                  ))}
                </div>
              </div>
              
              {/* Navigation buttons */}
              <button
                onClick={prevSummerSlide}
                className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextSummerSlide}
                className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white rounded-full p-3 hover:from-[#5a2408] hover:to-[#79300f] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Signature Collection - Updated with new banner image */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F2F2F2] dark:bg-[#0d0603] py-16 px-6"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-lg text-[#79300f] font-semibold uppercase mb-3 dark:text-[#f6d110]">Discover Our Signature Collection</h3>
              <p className="text-[20px] mb-6 dark:text-white">
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender.
              </p>
              <Button variant="primary">Shop Now</Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#79300f]/10 to-[#5a2408]/10 rounded-2xl p-8">
                <img
                  src="/images/newimg7.jpeg"
                  alt="VESARII Perfume"
                  className="w-full h-[350px] object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mt-16 items-center">
            <img
              src="/images/baner3.jpeg"
              alt="VESARII Perfume"
              className="rounded-lg object-cover w-full h-auto"
            />
            <div className="bg-[#F5E9DC] p-8 rounded-lg text-left dark:bg-[#291e1a]">
              <span className="text-xs uppercase text-[#79300f] tracking-widest dark:text-[#f6d110]">A Vesarii Masterpiece</span>
              <h3 className="text-[28px] font-bold mt-2 mb-4 dark:text-white">
                CRAFTED TO CAPTIVATE. <br /> WORN TO REMEMBER.
              </h3>
              <p className="text-[18px] dark:text-white">
                Meet VESARII Ember Nocturne — a perfume forged in twilight, kissed by wild lavender.
              </p>
              <Button className="mt-4">Find out more</Button>
            </div>
          </div>
        </motion.section>

        {/* Newsletter / Join Exclusive Circle */}
        <motion.section
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          className="bg-[#F2F2F2] dark:bg-[#0d0603] py-20 px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[40px] font-dm-serif mb-4 dark:text-white">Join Exclusive Circle</h2>
            <p className="text-[18px] mb-6 dark:text-white">
              Subscribe to our newsletter for early access to limited edition releases, private events,
              and the secrets behind our scent creations.
            </p>

            <div className="flex items-center gap-4 justify-center mb-4">
              <input type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-white text-[#79300f] placeholder-gray-300 px-4 py-1 w-2/3 outline-none h-12 rounded border  border-[#79300f]' />

              <Button
              className='rounded h-12 text-center'
              onClick={handleSubscribe}>Subscribe</Button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className='h-5 w-5'
              />
              <span className="text-sm dark:text-white">
                By checking the box, I accept the terms and conditions.
              </span>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;