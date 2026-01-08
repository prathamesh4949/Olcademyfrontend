// Create this file: components/common/WishlistButton.js

import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useWishlist } from '@/WishlistContext';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const WishlistButton = ({ 
  product, 
  className = "", 
  size = 20, 
  showText = false,
  onSuccess = null,
  onError = null 
}) => {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuth(); // Check if user is logged in

  // Check if product is in wishlist using the correct ID field
  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    // Validate required fields
    if (!productId || !product.name || !product.price) {
      const error = 'Product information is incomplete';
      toast.error(error);
      if (onError) onError(error);
      return;
    }

    try {
      // Transform product object to match WishlistContext expectations
      const wishlistProduct = {
        id: productId.toString(), // Ensure string format
        name: product.name,
        price: Number(product.price), // Ensure number format
        image: product.images && product.images.length > 0 
          ? product.images[0] 
          : product.image || '/images/default-gift.png',
        description: product.description || '',
        category: product.category || '',
        selectedSize: product.selectedSize || null
      };

      console.log('Adding to wishlist:', wishlistProduct);
      
      const wasInWishlist = inWishlist;

      if (isAuthenticated) {
        // User is logged in, update MongoDB
        toggleWishlist(wishlistProduct);
        const message = wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!';
        toast.success(message);
        
        if (onSuccess) onSuccess(message, !wasInWishlist);
      } else {
        // User is not logged in, update localStorage
        const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const exists = localWishlist.find(item => item.id === productId);

        if (exists) {
          const updatedWishlist = localWishlist.filter(item => item.id !== productId);
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
          toast.success('Removed from wishlist');
        } else {
          localWishlist.push(wishlistProduct);
          localStorage.setItem('wishlist', JSON.stringify(localWishlist));
          toast.success('Added to wishlist!');
        }
      }
      
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      const errorMsg = 'Failed to update wishlist';
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWishlistClick}
      disabled={loading}
      className={`transition-all duration-200 hover:scale-110 disabled:opacity-50 ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <div className="flex items-center space-x-2">
        <FiHeart
          size={size}
          className={`${
            inWishlist 
              ? 'text-red-500 fill-current' 
              : 'text-gray-400 hover:text-red-500'
          } transition-colors duration-200`}
          fill={inWishlist ? 'currentColor' : 'none'}
        />
        {showText && (
          <span className="text-sm font-medium">
            {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </span>
        )}
      </div>
    </motion.button>
  );
};

// Wishlist Counter Component for Header
export const WishlistCounter = ({ className = "" }) => {
  const { getWishlistCount } = useWishlist();
  const count = getWishlistCount();

  if (count === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <FiHeart size={24} className="text-gray-600 dark:text-gray-300" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
        {count}
      </span>
    </div>
  );
};

// Quick Add to Wishlist function (utility)
export const addToWishlistHelper = async (product, { toggleWishlist, isInWishlist }) => {
  try {
    const productId = product._id || product.id;
    
    if (!productId || !product.name || !product.price) {
      throw new Error('Product information is incomplete');
    }

    const wishlistProduct = {
      id: productId.toString(),
      name: product.name,
      price: Number(product.price),
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : product.image || '/images/default-gift.png',
      description: product.description || '',
      category: product.category || '',
      selectedSize: product.selectedSize || null
    };

    const wasInWishlist = isInWishlist(productId);
    await toggleWishlist(wishlistProduct);
    
    return {
      success: true,
      message: wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
      wasInWishlist,
      isNowInWishlist: !wasInWishlist
    };
    
  } catch (error) {
    console.error('Add to wishlist helper error:', error);
    return {
      success: false,
      message: error.message || 'Failed to update wishlist',
      error
    };
  }
};

export default WishlistButton;