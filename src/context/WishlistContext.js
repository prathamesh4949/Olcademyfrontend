import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { 
  getWishlistApi, 
  addToWishlistApi, 
  removeFromWishlistApi, 
  clearWishlistApi,
  moveToCartApi 
} from '../api/wishlistApi.js';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      // Load from localStorage if not authenticated
      loadLocalWishlist();
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlistApi();
      setWishlistItems(response.wishlistItems || []);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      // Fallback to local storage
      loadLocalWishlist();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalWishlist = () => {
    try {
      const storedWishlist = typeof window !== "undefined" ? localStorage.getItem('wishlistItems') : null;
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (err) {
      console.error('Error parsing local wishlist:', err);
      setWishlistItems([]);
    }
    setIsInitialized(true);
  };

  // Save to localStorage when updated (for non-authenticated users)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized, isAuthenticated]);

  const addToWishlist = async (item) => {
    try {
      // Check if item already exists
      const exists = wishlistItems.find(p => p.id === item.id);
      if (exists) {
        toast.error("Item already in wishlist!");
        return false;
      }

      if (isAuthenticated) {
        // Add to backend
        const response = await addToWishlistApi(item);
        setWishlistItems(response.wishlistItems || []);
        toast.success(response.message || `${item.name} added to wishlist`);
      } else {
        // Add to local storage
        setWishlistItems((prev) => [...prev, item]);
        toast.success(`${item.name} added to wishlist`);
      }
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error(error.message || 'Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const product = wishlistItems.find(item => item.id === id);
      
      if (isAuthenticated) {
        // Remove from backend
        const response = await removeFromWishlistApi(id);
        setWishlistItems(response.wishlistItems || []);
        toast.success(response.message || `${product?.name || 'Item'} removed from wishlist`);
      } else {
        // Remove from local storage
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        toast.success(`${product?.name || 'Item'} removed from wishlist`);
      }
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error(error.message || 'Failed to remove from wishlist');
      return false;
    }
  };

  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        // Clear from backend
        await clearWishlistApi();
        setWishlistItems([]);
        toast.success('Wishlist cleared successfully');
      } else {
        // Clear local storage
        setWishlistItems([]);
        toast.success('Wishlist cleared successfully');
      }
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error(error.message || 'Failed to clear wishlist');
      return false;
    }
  };

  const moveToCart = async (id, selectedSize, quantity = 1) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to move items to cart');
        return false;
      }

      const response = await moveToCartApi(id, selectedSize, quantity);
      setWishlistItems(response.wishlistItems || []);
      toast.success(response.message || 'Item moved to cart');
      return true;
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error(error.message || 'Failed to move to cart');
      return false;
    }
  };

  const toggleWishlist = (item) => {
    const exists = wishlistItems.find((p) => p.id === item.id);
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  const getWishlistCount = () => wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        refreshWishlist: loadWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};