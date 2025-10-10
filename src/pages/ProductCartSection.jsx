import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/CartContext';
import { toast } from 'react-hot-toast';

const ProductCartSection = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [showCart, setShowCart] = useState(isOpen);

  const { cartItems, removeFromCart, updateQuantity, clearCart, loading, isInitialized, refreshCart } = useCart();

  useEffect(() => {
    if (isInitialized && cartItems.length > 0) refreshCart();
  }, [isInitialized]);

  // Handle smooth mount/unmount
  useEffect(() => {
    if (isOpen) {
      setShowCart(true);
    } else {
      const timer = setTimeout(() => setShowCart(false), 300); // matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return '0.00';
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1 || isUpdatingQuantity) return;
    const item = cartItems.find(cartItem => cartItem.id === id);
    if (!item) return;
    const availableStock = item.availableStock || 0;
    if (availableStock === 0) {
      toast.error('This product is currently out of stock');
      return;
    }
    if (newQuantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }
    setIsUpdatingQuantity(true);
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleCheckout = () => {
    const outOfStockItems = cartItems.filter(item => item.outOfStock || item.exceedsStock);
    if (outOfStockItems.length > 0) {
      toast.error('Please remove out of stock items before checkout');
      return;
    }
    navigate('/checkout');
    onClose();
  };

  const handleContinueShopping = () => {
    navigate('/');
    onClose();
  };

  const handleProductClick = (item) => {
    if (!item || !item.id) return;
    if (
      item.source === 'scent' ||
      item.collection === 'trending' ||
      item.collection === 'best-seller' ||
      item.collection === 'signature' ||
      item.collection === 'limited-edition'
    ) {
      navigate(`/scent/${item.id}`);
    } else if (item.source === 'product') {
      navigate(`/product/${item.id}`);
    } else if (item.scentFamily || item.intensity || item.concentration || item.brand) {
      navigate(`/scent/${item.id}`);
    } else {
      navigate(`/product/${item.id}`);
    }
    onClose();
  };

  if (!showCart) return null;

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-[#F9F7F6] z-[1100] flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5A2408]" />
            <p className="text-base font-medium">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1100] flex pointer-events-auto">
      {/* Overlay */}
      <div
        className={`flex-1 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-label="Close cart"
        tabIndex={0}
        role="button"
      />

      {/* Sliding Cart */}
      <aside
        className={`relative h-full w-full max-w-[410px] bg-[#F9F7F6] shadow-xl flex flex-col pointer-events-auto outline-none transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center px-4 pb-5 pt-7 border-b border-[#EAE1DC]">
          <h2 className="uppercase font-semibold text-3xl tracking-wider text-[#5A2408] leading-none font-playfair">
            CART
          </h2>
          {!!cartItems?.length && (
            <button
              onClick={clearCart}
              disabled={loading}
              className="ml-28 md:ml-20 text-[#5A2408] border border-[#5A2408] rounded-full px-4 py-1 text-sm font-medium hover:bg-[#EAE1DC] transition"
            >
              {loading ? 'Clearing...' : 'Clear Cart'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5">
          {!cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full pt-7">
              <svg className="h-14 w-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h12.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              <p className="mt-4 text-base font-semibold text-[#5A2408] uppercase tracking-wider">
                Your cart is empty.
              </p>
              <button
                onClick={handleContinueShopping}
                className="mt-6 bg-[#431A06] hover:bg-[#5A2408] text-white text-sm font-semibold px-6 py-2 rounded shadow transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="pt-2 pb-8">
                <div className="flex items-stretch p-3 rounded-md hover:bg-[#efecece9] transition-colors duration-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[50px] object-contain rounded-md mr-5 cursor-pointer mt-2 self-stretch"
                    onClick={() => handleProductClick(item)}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span
                        className="text-sm font-semibold text-[#3A3A3A] tracking-wide uppercase cursor-pointer font-playfair"
                        onClick={() => handleProductClick(item)}
                      >
                        {item.name}
                      </span>
                      <div className="mt-1 text-[13px] font-playfair text-[#3A3A3A]">
                        Size: {item.selectedSize || '100ml'}
                      </div>
                    </div>

                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex rounded-[6px] ml-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || loading || isUpdatingQuantity}
                          className="px-5 py-0.5 text-[#3A3A3A] text-lg font-medium bg-transparent"
                          style={{ minWidth: 28 }}
                        >
                          –
                        </button>
                        <span
                          className="px-5 py-0.5 text-base text-[#5A2408]"
                          style={{ minWidth: 24, textAlign: 'center' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={loading || isUpdatingQuantity}
                          className="px-5 py-0.5 text-[#3A3A3A] text-lg font-medium bg-transparent"
                          style={{ minWidth: 28 }}
                        >
                          +
                        </button>
                      </div>
                      <span
                        className="ml-4 text-[16px] font-medium text-[#484848]"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        MRP: ${item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 pb-5 px-7 bg-[#F9F7F6]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[16px] font-manrope font-medium text-[#3A3A3A]">SUBTOTAL</span>
            <span className="text-[16px] font-manrope font-medium text-[#3A3A3A]">
              MRP: ${calculateTotal()}
            </span>
          </div>
          <div className="text-black text-[11px] mx-4 mb-4">
            Shipping, taxes, and discount codes calculated at checkout.
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading || isUpdatingQuantity || cartItems.some((item) => item.outOfStock || item.exceedsStock)}
            className="w-full bg-[#551e03] hover:bg-[#72300d] text-white text-[15px] font-playfair font-bold uppercase py-3 rounded transition duration-200 tracking-wide"
          >
            CHECK OUT
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ProductCartSection;
