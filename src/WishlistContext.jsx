import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = typeof window !== "undefined" ? localStorage.getItem('wishlistItems') : null;
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (err) {
        console.error('Error parsing wishlist:', err);
        setWishlistItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when updated
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = (item) => {
    const exists = wishlistItems.find(p => p.id === item.id);
    if (exists) {
      toast.error("Item already in wishlist!");
      return;
    }
    setWishlistItems((prev) => [...prev, item]);
    toast.success(`${item.name} added to wishlist`);
  };

  const removeFromWishlist = (id) => {
    const product = wishlistItems.find(item => item.id === id);
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(`${product?.name || 'Item'} removed from wishlist`);
  };

  const toggleWishlist = (item) => {
    wishlistItems.find((p) => p.id === item.id)
      ? removeFromWishlist(item.id)
      : addToWishlist(item);
  };

  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
