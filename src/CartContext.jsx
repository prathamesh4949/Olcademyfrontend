import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './context/AuthContext'; // Updated import path
import axios from 'axios';
import { USER_API_END_POINT } from '@/api/constant';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth(); // Get user and token from AuthContext

  // API base URL for cart
  const CART_API_BASE = `${USER_API_END_POINT.replace('/user', '/cart')}`;

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
  }, [user?.id]); // Track user ID changes

  // Load cart from database when user is authenticated or from localStorage when not
  useEffect(() => {
    const loadCart = async () => {
      if (isInitialized) return; // Prevent multiple initializations

      try {
        setLoading(true);
        console.log('Initializing cart...');

        if (user && token) {
          console.log('Loading cart for authenticated user:', user.email);
          
          // First, get any existing cart from localStorage to sync
          const storedCart = typeof window !== "undefined" ? localStorage.getItem('cartItems') : null;
          let localItems = [];
          if (storedCart) {
            try {
              localItems = JSON.parse(storedCart);
              console.log('Found local cart items to sync:', localItems.length);
            } catch (err) {
              console.error('Error parsing stored cart:', err);
            }
          }

          // Load cart from database
          const response = await axios.get(CART_API_BASE);
          if (response.data.success) {
            const dbItems = response.data.cartItems || [];
            console.log('Loaded cart from database:', dbItems.length, 'items');
            
            // If we have local items, sync them to database
            if (localItems.length > 0) {
              console.log('Syncing local items to database...');
              await syncCartToDatabase(localItems);
              
              // Reload cart after sync
              const syncResponse = await axios.get(CART_API_BASE);
              if (syncResponse.data.success) {
                setCartItems(syncResponse.data.cartItems || []);
                console.log('Cart synced successfully');
              }
            } else {
              setCartItems(dbItems);
            }
          } else {
            setCartItems([]);
          }
        } else {
          // Load from localStorage for non-authenticated users
          console.log('Loading cart from localStorage for non-authenticated user');
          const storedCart = typeof window !== "undefined" ? localStorage.getItem('cartItems') : null;
          if (storedCart) {
            try {
              const localItems = JSON.parse(storedCart);
              setCartItems(localItems);
              console.log('Loaded cart from localStorage:', localItems.length, 'items');
            } catch (err) {
              console.error('Error parsing cart:', err);
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to localStorage if API fails
        const storedCart = typeof window !== "undefined" ? localStorage.getItem('cartItems') : null;
        if (storedCart) {
          try {
            const fallbackItems = JSON.parse(storedCart);
            setCartItems(fallbackItems);
            console.log('Using localStorage fallback:', fallbackItems.length, 'items');
          } catch (err) {
            console.error('Error parsing stored cart:', err);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadCart();
  }, [user, token, isInitialized, CART_API_BASE]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (isInitialized && !user && cartItems.length >= 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized, user]);

  // Sync localStorage cart to database when user logs in
  const syncCartToDatabase = async (localCartItems) => {
    if (!user || !token || localCartItems.length === 0) return;

    try {
      console.log('Syncing cart to database...');
      // Add each item from localStorage to database
      for (const item of localCartItems) {
        try {
          await axios.post(`${CART_API_BASE}/add`, item);
          console.log('Synced item:', item.name);
        } catch (error) {
          // Item might already exist, continue with next item
          if (error.response?.status !== 400) {
            console.error('Error syncing item to database:', error);
          }
        }
      }
      
      // Clear localStorage after successful sync
      localStorage.removeItem('cartItems');
      console.log('Cart sync completed, localStorage cleared');
      
    } catch (error) {
      console.error('Error syncing cart to database:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      // Check if product already exists in cart
      const exists = cartItems.find(item => item.id === product.id);
      if (exists) {
        toast.error(`${product.name} is already in your cart!`);
        return false; // Return false to indicate failure
      }

      if (user && token) {
        // Add to database
        setLoading(true);
        const response = await axios.post(`${CART_API_BASE}/add`, product);
        if (response.data.success) {
          setCartItems(response.data.cartItems || []);
          toast.success(`${product.name} added to cart`);
          return true; // Return true to indicate success
        }
      } else {
        // Add to localStorage for non-authenticated users
        const newItem = { ...product, quantity: 1 }; // Ensure quantity is set
        const updatedCart = [...cartItems, newItem];
        setCartItems(updatedCart);
        toast.success(`${product.name} added to cart`);
        return true; // Return true to indicate success
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add item to cart');
      }
      return false; // Return false to indicate failure
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    try {
      if (user && token) {
        // Remove from database
        setLoading(true);
        const response = await axios.delete(`${CART_API_BASE}/remove/${id}`);
        if (response.data.success) {
          setCartItems(response.data.cartItems || []);
          toast.success(response.data.message);
        }
      } else {
        // Remove from localStorage for non-authenticated users
        const product = cartItems.find(item => item.id === id);
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        toast.success(`${product?.name || 'Item'} removed from cart`);
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to remove item from cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (user && token) {
        // Clear database cart
        setLoading(true);
        const response = await axios.delete(`${CART_API_BASE}/clear`);
        if (response.data.success) {
          setCartItems([]);
          toast.success(response.data.message);
        }
      } else {
        // Clear localStorage cart for non-authenticated users
        setCartItems([]);
        toast.success('Cart cleared');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to clear cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    
    try {
      if (user && token) {
        // Update in database
        setLoading(true);
        const response = await axios.put(`${CART_API_BASE}/update/${id}`, { quantity });
        if (response.data.success) {
          setCartItems(response.data.cartItems || []);
          // Don't show toast for every quantity update to avoid spam
        }
      } else {
        // Update in localStorage for non-authenticated users
        const updatedCart = cartItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update quantity');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Check if item exists in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      updateQuantity,
      getCartCount,
      isInCart,
      loading,
      isInitialized
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};