import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { USER_API_END_POINT } from '@/api/constant';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // API base URL for wishlist
  const WISHLIST_API_BASE = `${USER_API_END_POINT.replace('/user', '/wishlist')}`;

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Reset initialization when user changes (login/logout)
  useEffect(() => {
    setIsInitialized(false);
  }, [user?.id]);

  // Load wishlist from database when user is authenticated or from localStorage when not
  useEffect(() => {
    const loadWishlist = async () => {
      if (isInitialized) return;

      try {
        setLoading(true);
        console.log('Initializing wishlist...');

        if (user && token) {
          console.log('Loading wishlist for authenticated user:', user.email);
          
          const storedWishlist = typeof window !== "undefined" ? localStorage.getItem('wishlistItems') : null;
          let localItems = [];
          if (storedWishlist) {
            try {
              localItems = JSON.parse(storedWishlist);
              console.log('Found local wishlist items to sync:', localItems.length);
            } catch (err) {
              console.error('Error parsing stored wishlist:', err);
            }
          }

          const response = await axios.get(WISHLIST_API_BASE);
          if (response.data.success) {
            const dbItems = response.data.wishlistItems || [];
            console.log('Loaded wishlist from database:', dbItems.length, 'items');
            
            if (localItems.length > 0) {
              console.log('Syncing local items to database...');
              await syncWishlistToDatabase(localItems);
              
              const syncResponse = await axios.get(WISHLIST_API_BASE);
              if (syncResponse.data.success) {
                setWishlistItems(syncResponse.data.wishlistItems || []);
                console.log('Wishlist synced successfully');
              }
            } else {
              setWishlistItems(dbItems);
            }
          } else {
            setWishlistItems([]);
          }
        } else {
          console.log('Loading wishlist from localStorage for non-authenticated user');
          const storedWishlist = typeof window !== "undefined" ? localStorage.getItem('wishlistItems') : null;
          if (storedWishlist) {
            try {
              const localItems = JSON.parse(storedWishlist);
              setWishlistItems(localItems);
              console.log('Loaded wishlist from localStorage:', localItems.length, 'items');
            } catch (err) {
              console.error('Error parsing wishlist:', err);
              setWishlistItems([]);
            }
          } else {
            setWishlistItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        const storedWishlist = typeof window !== "undefined" ? localStorage.getItem('wishlistItems') : null;
        if (storedWishlist) {
          try {
            const fallbackItems = JSON.parse(storedWishlist);
            setWishlistItems(fallbackItems);
            console.log('Using localStorage fallback:', fallbackItems.length, 'items');
          } catch (err) {
            console.error('Error parsing stored wishlist:', err);
            setWishlistItems([]);
          }
        } else {
          setWishlistItems([]);
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadWishlist();
  }, [user, token, isInitialized, WISHLIST_API_BASE]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (isInitialized && !user && wishlistItems.length >= 0) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized, user]);

  // Sync localStorage wishlist to database when user logs in
  const syncWishlistToDatabase = async (localWishlistItems) => {
    if (!user || !token || localWishlistItems.length === 0) return;

    try {
      console.log('Syncing wishlist to database...');
      for (const item of localWishlistItems) {
        try {
          await axios.post(`${WISHLIST_API_BASE}/add`, {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description || '',
            category: item.category || '',
            selectedSize: item.selectedSize || null
          });
          console.log('Synced item:', item.name);
        } catch (error) {
          if (error.response?.status !== 400) {
            console.error('Error syncing item to database:', error);
          }
        }
      }
      
      localStorage.removeItem('wishlistItems');
      console.log('Wishlist sync completed, localStorage cleared');
      
    } catch (error) {
      console.error('Error syncing wishlist to database:', error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      // Validate required fields
      if (!product.id || !product.name || !product.price || !product.image) {
        throw new Error('All required product fields (id, name, price, image) must be provided');
      }

      // Check if product already exists in wishlist
      const exists = wishlistItems.find(item => 
        item.id === product.id && item.selectedSize === (product.selectedSize || null)
      );
      if (exists) {
        toast.error(`${product.name} is already in your wishlist!`);
        return false;
      }

      if (user && token) {
        // Add to database
        setLoading(true);
        const response = await axios.post(`${WISHLIST_API_BASE}/add`, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description || '',
          category: product.category || '',
          selectedSize: product.selectedSize || null
        });
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems || []);
          toast.success(`${product.name} added to wishlist`);
          return true;
        }
      } else {
        // Add to localStorage for non-authenticated users
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description || '',
          category: product.category || '',
          selectedSize: product.selectedSize || null,
          addedAt: new Date().toISOString()
        };
        const updatedWishlist = [...wishlistItems, newItem];
        setWishlistItems(updatedWishlist);
        toast.success(`${product.name} added to wishlist`);
        return true;
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add item to wishlist');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      if (user && token) {
        setLoading(true);
        const response = await axios.delete(`${WISHLIST_API_BASE}/remove/${id}`);
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems || []);
          toast.success(response.data.message);
        }
      } else {
        const product = wishlistItems.find(item => item.id === id);
        const updatedWishlist = wishlistItems.filter(item => item.id !== id);
        setWishlistItems(updatedWishlist);
        toast.success(`${product?.name || 'Item'} removed from wishlist`);
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to remove item from wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      if (user && token) {
        setLoading(true);
        const response = await axios.delete(`${WISHLIST_API_BASE}/clear`);
        if (response.data.success) {
          setWishlistItems([]);
          toast.success(response.data.message);
        }
      } else {
        setWishlistItems([]);
        toast.success('Wishlist cleared');
      }
    } catch (error) {
      console.error('Clear wishlist error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to clear wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (id) => {
    try {
      if (user && token) {
        setLoading(true);
        const response = await axios.post(`${WISHLIST_API_BASE}/move-to-cart/${id}`);
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems || []);
          toast.success(response.data.message);
          return true;
        }
      } else {
        // For non-authenticated users, we can't move to cart directly
        // Just remove from wishlist and let user add to cart manually
        const product = wishlistItems.find(item => item.id === id);
        if (product) {
          removeFromWishlist(id);
          toast.success(`${product.name} removed from wishlist. Please add to cart manually.`);
        }
        return false;
      }
    } catch (error) {
      console.error('Move to cart error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to move item to cart');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (item) => {
    const exists = wishlistItems.find((p) => 
      p.id === item.id && p.selectedSize === (item.selectedSize || null)
    );
    
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const isInWishlist = (id, selectedSize = null) => {
    return wishlistItems.some((item) => 
      item.id === id && item.selectedSize === selectedSize
    );
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Refresh wishlist to get updated information
  const refreshWishlist = async () => {
    if (user && token) {
      try {
        setLoading(true);
        const response = await axios.get(WISHLIST_API_BASE);
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems || []);
        }
      } catch (error) {
        console.error('Error refreshing wishlist:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        refreshWishlist,
        loading,
        isInitialized
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