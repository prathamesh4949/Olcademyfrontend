import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/CartContext';

const ProductCard = ({ id, name, price, description, image }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Create product object for cart operations
  const product = {
    id: id || `product-${Date.now()}`, // Fallback ID if not provided
    name,
    price,
    description,
    image
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const success = await addToCart(product);
      // The success/error state will be handled by the context and toast
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleGoToCart = () => {
    navigate('/product-cart');
  };

  const productInCart = isInCart(product.id);

  return (
    <div className="flex flex-col items-center bg-white dark:bg-[#2c0a0a] p-6 rounded-lg shadow-lg border dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <img
        src={image}
        alt={name}
        className="w-48 h-64 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
      />
      
      <h3 className="text-lg font-semibold text-gray-800 dark:text-[#EDD1D1] mb-2 text-center line-clamp-2">
        {name}
      </h3>
      
      <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
        ${price}
      </p>
      
      <p className="text-sm text-gray-500 text-center dark:text-[#f6d110] mb-4 line-clamp-3 px-2">
        {description}
      </p>
      
      {/* Dynamic Add to Cart / Go to Cart Button */}
      {productInCart ? (
        <button
          onClick={handleGoToCart}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        >
          Go to Cart
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdding || loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        >
          {isAdding ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            'Add to Cart'
          )}
        </button>
      )}

      {/* Optional: Show visual indicator when item is in cart */}
      {productInCart && (
        <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-2 px-3 rounded-lg w-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">In Cart</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;