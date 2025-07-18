import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    state: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  });

  const [shippingOption, setShippingOption] = useState('standard');

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: '1 business day' }
  ];

  const promoCodes = {
    'SAVE10': 10,
    'WELCOME20': 20,
    'SUMMER15': 15
  };

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const validateStep = useCallback((step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
      if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
      if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required';
      if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
      if (!customerInfo.city.trim()) newErrors.city = 'City is required';
      if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
      if (!customerInfo.country.trim()) newErrors.country = 'Country is required';
    }
    
    if (step === 2 && paymentMethod === 'credit-card') {
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [customerInfo, paymentInfo, paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in customerInfo) {
      setCustomerInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else if (name in paymentInfo) {
      setPaymentInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const calculateShipping = () => {
    return shippingOptions.find(option => option.id === shippingOption)?.price || 0;
  };

  const calculateTax = () => {
    return (calculateSubtotal() * 0.08); // 8% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + shipping + tax - discountAmount;
  };

  const handlePromoCode = () => {
    if (promoCodes[promoCode.toUpperCase()]) {
      setDiscount(promoCodes[promoCode.toUpperCase()]);
      setShowPromoSuccess(true);
      setTimeout(() => setShowPromoSuccess(false), 3000);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCartItems([]);
      
      // Show success animation
      setCurrentStep(4);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map((step) => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Shipping'}
            {step === 2 && 'Payment'}
            {step === 3 && 'Review'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderShippingForm = () => (
    <div className="form-section">
      <h3>Shipping Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="John Doe"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            placeholder="john@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        <div className="form-group full-width">
          <label>Address *</label>
          <input
            type="text"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            className={errors.address ? 'error' : ''}
            placeholder="123 Main Street"
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={customerInfo.city}
            onChange={handleInputChange}
            className={errors.city ? 'error' : ''}
            placeholder="New York"
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={customerInfo.state}
            onChange={handleInputChange}
            placeholder="NY"
          />
        </div>
        
        <div className="form-group">
          <label>Zip Code *</label>
          <input
            type="text"
            name="zipCode"
            value={customerInfo.zipCode}
            onChange={handleInputChange}
            className={errors.zipCode ? 'error' : ''}
            placeholder="10001"
          />
          {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
        </div>
        
        <div className="form-group">
          <label>Country *</label>
          <input
            type="text"
            name="country"
            value={customerInfo.country}
            onChange={handleInputChange}
            className={errors.country ? 'error' : ''}
            placeholder="United States"
          />
          {errors.country && <span className="error-message">{errors.country}</span>}
        </div>
      </div>
      
      <div className="shipping-options">
        <h4>Shipping Options</h4>
        {shippingOptions.map(option => (
          <div key={option.id} className="shipping-option">
            <input
              type="radio"
              id={option.id}
              name="shipping"
              value={option.id}
              checked={shippingOption === option.id}
              onChange={(e) => setShippingOption(e.target.value)}
            />
            <label htmlFor={option.id}>
              <div className="option-details">
                <span className="option-name">{option.name}</span>
                <span className="option-price">${option.price}</span>
              </div>
              <span className="option-days">{option.days}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="form-section">
      <h3>Payment Information</h3>
      
      <div className="payment-methods">
        <div className="payment-method">
          <input
            type="radio"
            id="credit-card"
            name="payment"
            value="credit-card"
            checked={paymentMethod === 'credit-card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="credit-card">Credit Card</label>
        </div>
        <div className="payment-method">
          <input
            type="radio"
            id="paypal"
            name="payment"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="paypal">PayPal</label>
        </div>
        <div className="payment-method">
          <input
            type="radio"
            id="apple-pay"
            name="payment"
            value="apple-pay"
            checked={paymentMethod === 'apple-pay'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="apple-pay">Apple Pay</label>
        </div>
      </div>
      
      {paymentMethod === 'credit-card' && (
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Card Number *</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              className={errors.cardNumber ? 'error' : ''}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          </div>
          
          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handleInputChange}
              className={errors.expiryDate ? 'error' : ''}
              placeholder="MM/YY"
              maxLength="5"
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>
          
          <div className="form-group">
            <label>CVV *</label>
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handleInputChange}
              className={errors.cvv ? 'error' : ''}
              placeholder="123"
              maxLength="4"
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
          
          <div className="form-group full-width">
            <label>Cardholder Name *</label>
            <input
              type="text"
              name="cardName"
              value={paymentInfo.cardName}
              onChange={handleInputChange}
              className={errors.cardName ? 'error' : ''}
              placeholder="John Doe"
            />
            {errors.cardName && <span className="error-message">{errors.cardName}</span>}
          </div>
          
          <div className="form-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="saveCard"
                checked={paymentInfo.saveCard}
                onChange={handleInputChange}
              />
              Save card for future purchases
            </label>
          </div>
        </div>
      )}
      
      {paymentMethod === 'paypal' && (
        <div className="alternative-payment">
          <p>You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}
      
      {paymentMethod === 'apple-pay' && (
        <div className="alternative-payment">
          <p>Use Touch ID or Face ID to complete your payment.</p>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="order-summary">
      <h3>Order Summary</h3>
      
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <span className="item-price">${item.price}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="promo-code">
        <div className="promo-input">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
          />
          <button onClick={handlePromoCode}>Apply</button>
        </div>
        {showPromoSuccess && (
          <div className="promo-success">
            Promo code applied! {discount}% discount
          </div>
        )}
      </div>
      
      <div className="order-totals">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="total-line">
          <span>Shipping:</span>
          <span>${calculateShipping().toFixed(2)}</span>
        </div>
        <div className="total-line">
          <span>Tax:</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="total-line discount">
            <span>Discount ({discount}%):</span>
            <span>-${((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="total-line total">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="success-message">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
      <div className="order-number">Order #12345</div>
    </div>
  );

  if (cartItems.length === 0 && currentStep !== 4) {
    return (
      <div className="checkout-container">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to proceed with checkout.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="checkout-content">
        <div className="checkout-header">
          <h1>Checkout</h1>
          {currentStep !== 4 && renderStepIndicator()}
        </div>
        
        {currentStep === 4 ? (
          renderSuccessMessage()
        ) : (
          <div className="checkout-main">
            <div className="checkout-form">
              {currentStep === 1 && renderShippingForm()}
              {currentStep === 2 && renderPaymentForm()}
              {currentStep === 3 && (
                <div className="review-section">
                  <h3>Review Your Order</h3>
                  <div className="review-details">
                    <div className="review-group">
                      <h4>Shipping Address</h4>
                      <p>{customerInfo.name}</p>
                      <p>{customerInfo.address}</p>
                      <p>{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                      <p>{customerInfo.country}</p>
                    </div>
                    <div className="review-group">
                      <h4>Payment Method</h4>
                      <p>{paymentMethod === 'credit-card' ? 'Credit Card' : 
                          paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="checkout-actions">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-secondary"
                    disabled={isProcessing}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner"></div>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className="checkout-sidebar">
              {renderOrderSummary()}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;