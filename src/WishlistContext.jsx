import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import WishlistService from './services/WishlistService';

const WishlistContext = createContext();
const WISHLIST_API_BASE = '/api/wishlist';
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Using centralized WishlistService for backend interactions

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

          try {
            const response = await WishlistService.getWishlist();
            if (response.success) {
              const dbItems = response.wishlistItems || [];
              console.log('Loaded wishlist from database:', dbItems.length, 'items');
              
              if (localItems.length > 0) {
                console.log('Syncing local items to database...');
                await syncWishlistToDatabase(localItems);
                
                const syncResponse = await WishlistService.getWishlist();
                if (syncResponse.success) {
                  setWishlistItems(syncResponse.wishlistItems || []);
                  console.log('Wishlist synced successfully');
                }
              } else {
                setWishlistItems(dbItems);
              }
            } else {
              setWishlistItems([]);
            }
          } catch (apiError) {
            console.warn('Wishlist API not available, using localStorage only');
            if (localItems.length > 0) {
              setWishlistItems(localItems);
            } else {
              setWishlistItems([]);
            }
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
  }, [user, token, isInitialized]);

  // Save to localStorage for all users (as fallback and for non-authenticated users)
  useEffect(() => {
    if (isInitialized && wishlistItems.length >= 0) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized]);

  // Sync localStorage wishlist to database when user logs in
  const syncWishlistToDatabase = async (localWishlistItems) => {
    if (!user || !token || localWishlistItems.length === 0) return;

    try {
      console.log('Syncing wishlist to database...');
      for (const item of localWishlistItems) {
        try {
          await WishlistService.addToWishlist({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description || '',
            category: item.category || '',
            brand: item.brand || '',
            selectedSize: item.selectedSize || null
          });
          console.log('Synced item:', item.name);
        } catch (error) {
          if (error.response?.status !== 400) {
            console.error('Error syncing item to database:', error);
          }
        }
      }
      
      // Don't clear localStorage - keep as backup
      console.log('Wishlist sync completed');
      
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

      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        selectedSize: product.selectedSize || null,
        addedAt: new Date().toISOString()
      };

      if (user && token) {
        // Try to add to database via service
        try {
          setLoading(true);

          const response = await axios.post(`${WISHLIST_API_BASE}/add`, newItem);
          if (response.data.success) {
            setWishlistItems(response.data.wishlistItems || []);
            // toast.success(`${product.name} added to wishlist`);
            return true;
          }

          const responseService = await WishlistService.addToWishlist(newItem);
          if (responseService.success) {
            setWishlistItems(responseService.wishlistItems || []);
            toast.success(`${product.name} added to wishlist`);
            return true;
          }
        } catch (apiError) {
          console.warn('Wishlist API not available, using localStorage only');
          // Fall back to localStorage
          const updatedWishlist = [...wishlistItems, newItem];
          setWishlistItems(updatedWishlist);
          // toast.success(`${product.name} added to wishlist`);
          return true;
        }
      } else {
        // Add to localStorage for non-authenticated users
        const updatedWishlist = [...wishlistItems, newItem];
        setWishlistItems(updatedWishlist);
        // toast.success(`${product.name} added to wishlist`);
        return true;
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      // Always fall back to localStorage
      try {
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description || '',
          category: product.category || '',
          brand: product.brand || '',
          selectedSize: product.selectedSize || null,
          addedAt: new Date().toISOString()
        };
        const updatedWishlist = [...wishlistItems, newItem];
        setWishlistItems(updatedWishlist);
        // toast.success(`${product.name} added to wishlist`);
        return true;
      } catch (localError) {
        console.error('Failed to add to local wishlist:', localError);
        toast.error('Failed to add item to wishlist');
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const product = wishlistItems.find(item => item.id === id);
      
      if (user && token) {
        try {
          setLoading(true);

          const response = await axios.delete(`${WISHLIST_API_BASE}/remove/${id}`);
          if (response.data.success) {
            setWishlistItems(response.data.wishlistItems || []);
            // toast.success(response.data.message);
          }

          const responseService = await WishlistService.removeFromWishlist(id);
          if (responseService.success) {
            setWishlistItems(responseService.wishlistItems || []);
            toast.success(responseService.message);
            return;
          }
        } catch (apiError) {
          console.warn('Wishlist API not available, using localStorage only');
        }
      }
      
      // Fall back to localStorage removal
      const updatedWishlist = wishlistItems.filter(item => item.id !== id);
      setWishlistItems(updatedWishlist);
      // toast.success(`${product?.name || 'Item'} removed from wishlist`);
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      if (user && token) {
        try {
          setLoading(true);
          const response = await WishlistService.clearWishlist();
          if (response.success) {
            setWishlistItems([]);
            toast.success(response.message);
            return;
          }
        } catch (apiError) {
          console.warn('Wishlist API not available, using localStorage only');
        }
      }
      
      // Fall back to localStorage clear
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Clear wishlist error:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (id) => {
    try {
      if (user && token) {
        try {
          setLoading(true);
          const response = await WishlistService.moveToCart(id);
          if (response.success) {
            setWishlistItems(response.wishlistItems || []);
            toast.success(response.message);
            return true;
          }
        } catch (apiError) {
          console.warn('Move to cart API not available');
        }
      }
      
      // For non-authenticated users or API fallback, just remove from wishlist
      const product = wishlistItems.find(item => item.id === id);
      if (product) {
        removeFromWishlist(id);
        toast.success(`${product.name} removed from wishlist. Please add to cart manually.`);
      }
      return false;
    } catch (error) {
      console.error('Move to cart error:', error);
      toast.error('Failed to move item to cart');
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
        const response = await WishlistService.getWishlist();
        if (response.success) {
          setWishlistItems(response.wishlistItems || []);
        }
      } catch (error) {
        console.error('Error refreshing wishlist:', error);
        // Keep current localStorage items if API fails
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
