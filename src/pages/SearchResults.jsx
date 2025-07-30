import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { fadeIn } from '../variants';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { FiHeart, FiFilter, FiX } from 'react-icons/fi';
import { searchProducts } from '../data/productData';

const SearchResults = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'name'
  });

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
    performSearch(query);
  }, [location.search]);

  // Perform search
  const performSearch = async (query) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = searchProducts(query, filters);
      setSearchResults(results);
      setFilteredResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...searchResults];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= filters.priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredResults(filtered);
  }, [searchResults, filters]);

  // Handle new search
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Update filters
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: 0, max: 1000 },
      sortBy: 'name'
    });
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        variants={fadeIn('up', 0.2)}
        initial="hidden"
        animate="show"
        className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left relative border border-[#D4C5A9] group hover:scale-105"
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
            className="h-[200px] w-full object-contain transition-all duration-300 group-hover:scale-105" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              product.category === 'men' ? 'bg-blue-100 text-blue-800' :
              product.category === 'women' ? 'bg-pink-100 text-pink-800' :
              product.category === 'unisex' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {product.category.toUpperCase()}
            </span>
            {product.collection && (
              <span className="px-2 py-1 text-xs rounded-full bg-[#79300f]/10 text-[#79300f] font-medium">
                {product.collection.replace('-', ' ').toUpperCase()}
              </span>
            )}
          </div>
          
          <h3 className="text-[20px] font-alata text-[#5a2408] font-bold">{product.name}</h3>
          <p className="text-[12px] text-[#8b4513] italic leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <p className="text-[20px] font-bold text-[#79300f]">${product.price}</p>
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
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#79300f] dark:bg-[#0d0603] dark:text-[#f6d110]">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <h1 className="text-[48px] font-dm-serif mb-4 dark:text-white">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perfumes..."
              className="flex-1 px-4 py-3 rounded-xl border border-[#D4C5A9] bg-white dark:bg-[#1a1410] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#79300f]"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white px-8 py-3 rounded-xl"
            >
              Search
            </Button>
          </form>

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-[#5a2408] dark:text-[#f6d110]">
              {isLoading ? 'Searching...' : 
               searchQuery ? `Found ${filteredResults.length} results for "${searchQuery}"` :
               `Showing all ${filteredResults.length} products`
              }
            </p>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1410] rounded-lg border border-[#D4C5A9] hover:shadow-md transition-all duration-200"
            >
              <FiFilter size={16} />
              Filters
            </button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.div
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            animate="show"
            className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white dark:bg-[#1a1410] p-6 rounded-2xl shadow-lg border border-[#D4C5A9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[20px] dark:text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#79300f] hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block font-semibold mb-2 dark:text-white">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4C5A9] bg-white dark:bg-[#0d0603] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#79300f]"
                >
                  <option value="">All Categories</option>
                  <option value="men">Men's</option>
                  <option value="women">Women's</option>
                  <option value="unisex">Unisex</option>
                  <option value="home">Featured</option>
                  <option value="summer">Summer Collection</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block font-semibold mb-2 dark:text-white">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange.max}
                    onChange={(e) => updateFilter('priceRange', {
                      ...filters.priceRange,
                      max: parseInt(e.target.value)
                    })}
                    className="w-full accent-[#79300f]"
                  />
                  <div className="flex justify-between text-sm text-[#5a2408] dark:text-[#f6d110]">
                    <span>${filters.priceRange.min}</span>
                    <span>${filters.priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="block font-semibold mb-2 dark:text-white">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D4C5A9] bg-white dark:bg-[#0d0603] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#79300f]"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#79300f]"></div>
              </div>
            ) : filteredResults.length === 0 ? (
              <motion.div
                variants={fadeIn('up', 0.2)}
                initial="hidden"
                animate="show"
                className="text-center py-16"
              >
                <div className="mb-4">
                  <FiX size={64} className="mx-auto text-gray-400" />
                </div>
                <h3 className="text-[24px] font-bold mb-2 dark:text-white">No Results Found</h3>
                <p className="text-[#5a2408] dark:text-[#f6d110] mb-6">
                  {searchQuery 
                    ? `Sorry, we couldn't find any products matching "${searchQuery}"`
                    : "No products match your current filters"
                  }
                </p>
                <div className="space-x-4">
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/search');
                    }}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
                
                {/* Suggestions */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4 dark:text-white">You might like:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link to="/mens-collection" className="px-4 py-2 bg-[#79300f]/10 text-[#79300f] rounded-full hover:bg-[#79300f]/20 transition-colors">Men's Collection</Link>
                    <Link to="/womens-collection" className="px-4 py-2 bg-[#79300f]/10 text-[#79300f] rounded-full hover:bg-[#79300f]/20 transition-colors">Women's Collection</Link>
                    <Link to="/unisex-collection" className="px-4 py-2 bg-[#79300f]/10 text-[#79300f] rounded-full hover:bg-[#79300f]/20 transition-colors">Unisex Collection</Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={fadeIn('up', 0.2)}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        {showFilters && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilters(false)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;