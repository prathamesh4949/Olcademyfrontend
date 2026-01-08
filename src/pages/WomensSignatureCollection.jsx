import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import ScentService from '../services/scentService';
import ProductCartSection from '../pages/ProductCartSection';

import {
  ShoppingCart,
  Heart,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const WomensSignatureCollection = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [scents, setScents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Sidebar cart (same as MensSignatureCollection)
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const fetchWomensSignatureScents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: currentPage, limit: itemsPerPage, isActive: true };
      const response = await ScentService.getWomensSignatureScents(params);

      if (response?.success) {
        setScents(response.data || []);
        if (response.pagination) setTotalPages(response.pagination.totalPages);
      } else {
        setError(response?.message || 'Failed to fetch women signature scents');
        setScents([]);
      }
    } catch (err) {
      setError('Failed to load womens signature scents');
      setScents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchWomensSignatureScents();
  }, [fetchWomensSignatureScents]);

 
  const ProductCard = memo(({ scent }) => {
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    if (!scent) return null;

    const selectedSize = scent.sizes?.[0]?.size ?? "";
    const productInCart = isInCart(String(scent._id), String(selectedSize));

    const handleWishlistToggle = (e) => {
      e.stopPropagation();
      toggleWishlist({
        id: String(scent._id),
        name: scent.name,
        price: scent.price,
        image: scent.images?.[0] || '/images/default-scent.png',
        description: scent.description || '',
        selectedSize: null
      });
      addNotification(`${scent.name} wishlist toggled`, "success");
    };

    const handleAddToCart = async (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      setIsAddingToCart(true);

      const cartItem = {
        id: String(scent._id),
        name: scent.name,
        price: Number(scent.price),
        image: scent.images?.[0] || '/images/default-scent.png',
        quantity: 1,
        selectedSize: selectedSize,
        personalization: null,
        brand: scent.brand || '',
        sku: scent.sku || ''
      };

      try {
        const success = await addToCart(cartItem);
        addNotification(
          success ? `Added ${scent.name} to cart!` : 'Failed to add item',
          success ? "success" : "error"
        );
      } catch {
        addNotification("Something went wrong.", "error");
      } finally {
        setIsAddingToCart(false);
      }
    };

    const getStars = (rating = 0) => (
      <div className="flex items-center justify-center gap-1 mb-1">
        {[...Array(5)].map((_, idx) =>
          <Star
            key={idx}
            size={16}
            style={{
              color: idx < Math.floor(rating) ? "#5A2408" : "#cfc6be",
              opacity: idx < Math.floor(rating) ? 1 : 0.3
            }}
            fill={idx < Math.floor(rating) ? "#5A2408" : "transparent"}
          />
        )}
      </div>
    );

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 cursor-pointer shadow-md hover:shadow-xl w-full max-w-[331px] min-h-[528px] flex flex-col justify-between"
        onClick={() => navigate(`/scent/${scent._id}`)}
      >
        {/* IMAGE */}
        <div className="relative bg-white flex items-center justify-center p-3">
          <img
            src={scent.images?.[0] || "/images/default-scent.png"}
            className="object-contain w-full h-full max-w-[248px] max-h-[248px]"
          />

          <motion.button
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.15 }}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5"
          >
            <Heart
              size={14}
              className={isInWishlist(scent._id) ? 'fill-red-600 text-red-600' : 'text-gray-700'}
            />
          </motion.button>
        </div>

        {/* TEXT */}
        <div className="px-4 pt-3 pb-1 flex flex-col gap-3 text-center">
          <h3 className="font-bold text-lg" style={{ color: '#5A2408' }}>{scent.name}</h3>
          {getStars(scent.rating)}
          <p className="line-clamp-2 text-sm">{scent.description}</p>
          <p className="font-bold text-lg" style={{ color: '#431A06' }}>
            ${Number(scent.price).toFixed(2)}
          </p>
        </div>

        {/* ADD / VIEW CART BUTTON */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (productInCart) {
              setIsCartOpen(true); // opens sidebar
            } else {
              handleAddToCart(e);
            }
          }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-center gap-2 text-white font-bold uppercase w-full h-[54px]"
          style={{ backgroundColor: "#431A06", letterSpacing: "0.05em" }}
        >
          <ShoppingCart size={20} />
          {isAddingToCart ? "Adding..." : productInCart ? "View Cart" : "Add to Cart"}
        </motion.button>
      </motion.div>
    );
  });

  const NotificationSystem = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`p-4 rounded-xl text-white shadow-lg 
              ${note.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <div className="flex items-center gap-3">
              {note.type === "success" ? <CheckCircle /> : <AlertCircle />}
              <span>{note.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-F8F6F3">
      <Header />
      <NotificationSystem />

      {/* SIDE CART */}
      <ProductCartSection isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="flex-1">
        {/* BANNER SECTION */}
         <section className="relative overflow-hidden w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
                  <div className="relative w-full h-[400px] md:h-[400px] lg:h-[400px] flex items-center justify-center">
                    <img
                      src="/images/unisex.png"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-6">
                        <Star className="w-20 h-20 mx-auto text-purple-400 mb-6" />
                        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wider">
                          Women's Signature Collection
                        </h1>
                      </div>
                    </div>
                  </div>
                </section>
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-32">
                <div className="animate-spin h-32 w-32 border-b-2 border-purple-500 rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertCircle className="mx-auto mb-4 text-red-500" size={40} />
                <button onClick={fetchWomensSignatureScents} className="px-6 py-3 bg-purple-600 text-white rounded-xl">
                  Try Again
                </button>
              </div>
            ) : scents.length === 0 ? (
              <h3 className="text-center py-20 text-xl">No signature scents found</h3>
            ) : (
              <>
                <div className="text-center mb-6 text-gray-400">
                  Showing {scents.length} items
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {scents.map((scent) => (
                    <ProductCard key={scent._id} scent={scent} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WomensSignatureCollection;
