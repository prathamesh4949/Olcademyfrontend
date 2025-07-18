import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage only after component mounts (client-side)
  useEffect(() => {
    const storedCart = typeof window !== "undefined" ? localStorage.getItem('cartItems') : null;
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error('Error parsing cart:', err);
        setCartItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      toast.error("Item already in cart!");
      return;
    }
    setCartItems((prev) => [...prev, product]);
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    const product = cartItems.find(item => item.id === id);
    setCartItems((prev) => prev.filter(item => item.id !== id));
    toast.success(`${product?.name || 'Item'} removed from cart`);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);