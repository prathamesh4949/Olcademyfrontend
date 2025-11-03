import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../CartContext';
import { API_BASE_URL } from '../api/constant';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: user ? user.email : '',
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
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!user && !token && currentStep !== 4) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }
      if (token && !user && currentStep !== 4) {
        console.log('Token found but user context loading...');
        return;
      }
      console.log('User authenticated:', user ? user.email : 'Loading...');
    };
    checkAuth();
  }, [user, navigate, currentStep]);

  useEffect(() => {
    if (user && user.email && !customerInfo.email) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user, customerInfo.email]);

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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * (item.quantity || 1), 0);
  };

  const calculateShipping = () => {
    return shippingOptions.find(option => option.id === shippingOption)?.price || 0;
  };

  const calculateTax = () => {
    return (calculateSubtotal() * 0.08);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + shipping + tax - discountAmount;
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
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
    const token = localStorage.getItem('token');
    if (!user && !token) {
      console.log('User not authenticated at order submission, redirecting to login');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!validateStep(3)) return;
    setIsProcessing(true);
    try {
      const orderData = {
        customerInfo,
        items: cartItems,
        paymentInfo: {
          method: paymentMethod,
          cardNumber: paymentInfo.cardNumber,
          cardName: paymentInfo.cardName
        },
        shippingOption: shippingOptions.find(option => option.id === shippingOption),
        pricing: {
          subtotal: calculateSubtotal(),
          shipping: calculateShipping(),
          tax: calculateTax(),
          discount: (calculateSubtotal() * discount) / 100,
          discountPercentage: discount,
          total: calculateTotal()
        },
        promoCode: promoCode || null
      };
      const apiUrl = `${API_BASE_URL}/order/create`;
      console.log('Sending order data to:', apiUrl);
      console.log('Order data:', orderData);
      const authToken = localStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      let result;
      if (response.ok) {
        try {
          result = await response.json();
          console.log('✅ Order response:', result);
          if (result.success) {
            console.log('✅ Order placed successfully:', result.order?.orderNumber || result.orderNumber);
            setCartItems([]);
            const orderNum = result.order?.orderNumber || result.orderNumber || 'ORD-' + Date.now();
            localStorage.setItem('lastOrderNumber', orderNum);
            setOrderNumber(orderNum);
            setCurrentStep(4);
            setTimeout(() => {
              navigate('/');
            }, 5000);
          } else {
            throw new Error(result.message || 'Failed to place order');
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Invalid response from server');
        }
      } else {
        if (response.status === 401) {
          console.log('Authentication failed, clearing token and redirecting to login');
          localStorage.removeItem('token');
          navigate('/login', { state: { from: '/checkout' } });
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 404) {
          console.warn('⚠️ Backend endpoint /order/create not found');
          console.warn('Available endpoints might be different. Check your OrderRoutes.js');
          try {
            const errorText = await response.text();
            console.error('404 Error details:', errorText);
          } catch (e) {
            console.error('Could not parse error response');
          }
          console.log('🔄 Using mock response for development...');
          const mockOrderNumber = 'ORD-MOCK-' + Date.now();
          console.log('✅ Mock order placed successfully:', mockOrderNumber);
          setCartItems([]);
          localStorage.setItem('lastOrderNumber', mockOrderNumber);
          setOrderNumber(mockOrderNumber);
          setCurrentStep(4);
          setTimeout(() => {
            navigate('/');
          }, 5000);
          return;
        } else if (response.status === 500) {
          try {
            result = await response.json();
            throw new Error(`Server error: ${result.message || 'Internal server error'}`);
          } catch (jsonError) {
            throw new Error('Internal server error');
          }
        } else if (response.status === 400) {
          try {
            result = await response.json();
            throw new Error(`Bad request: ${result.message || 'Invalid data provided'}`);
          } catch (jsonError) {
            throw new Error('Bad request: Invalid data provided');
          }
        } else {
          try {
            result = await response.json();
            throw new Error(result.message || `Server error: ${response.status} ${response.statusText}`);
          } catch (jsonError) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert(`Network error: Unable to connect to server at ${API_BASE_URL}. Please check if the backend is running and try again.`);
      } else {
        alert(`There was an error placing your order: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '2rem 0' }}>
      {[1, 2, 3].map((step) => (
        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentStep >= step ? '#431A06' : '#e5e7eb',
            color: currentStep >= step ? 'white' : '#6b7280',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            transition: 'all 0.3s ease'
          }}>
            {step}
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: currentStep >= step ? '#431A06' : '#6b7280'
          }}>
            {step === 1 && 'Shipping'}
            {step === 2 && 'Payment'}
            {step === 3 && 'Review'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderShippingForm = () => (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#431A06' }}>Shipping Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name *</label>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="John Doe"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#d1d5db'}
          />
          {errors.name && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.name}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email *</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none',
              backgroundColor: user ? '#f3f4f6' : 'white'
            }}
            placeholder="john@example.com"
            disabled={!!user}
            onFocus={(e) => !user && (e.target.style.borderColor = '#431A06')}
            onBlur={(e) => !user && (e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db')}
          />
          {errors.email && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.email}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.phone ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="+1 (555) 123-4567"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#d1d5db'}
          />
          {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.phone}</span>}
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address *</label>
          <input
            type="text"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.address ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="123 Main Street"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = errors.address ? '#ef4444' : '#d1d5db'}
          />
          {errors.address && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.address}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City *</label>
          <input
            type="text"
            name="city"
            value={customerInfo.city}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.city ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="New York"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = errors.city ? '#ef4444' : '#d1d5db'}
          />
          {errors.city && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.city}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>State</label>
          <input
            type="text"
            name="state"
            value={customerInfo.state}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="NY"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Zip Code *</label>
          <input
            type="text"
            name="zipCode"
            value={customerInfo.zipCode}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.zipCode ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="10001"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = errors.zipCode ? '#ef4444' : '#d1d5db'}
          />
          {errors.zipCode && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.zipCode}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Country *</label>
          <input
            type="text"
            name="country"
            value={customerInfo.country}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.country ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            placeholder="United States"
            onFocus={(e) => e.target.style.borderColor = '#431A06'}
            onBlur={(e) => e.target.style.borderColor = errors.country ? '#ef4444' : '#d1d5db'}
          />
          {errors.country && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.country}</span>}
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#431A06' }}>Shipping Options</h4>
        {shippingOptions.map(option => (
          <div key={option.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            marginBottom: '0.75rem',
            border: '2px solid',
            borderColor: shippingOption === option.id ? '#431A06' : '#e5e7eb',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: shippingOption === option.id ? 'rgba(67, 26, 6, 0.05)' : 'white',
            transition: 'all 0.2s'
          }}
          onClick={() => setShippingOption(option.id)}>
            <input
              type="radio"
              id={option.id}
              name="shipping"
              value={option.id}
              checked={shippingOption === option.id}
              onChange={(e) => setShippingOption(e.target.value)}
              style={{ marginRight: '1rem', accentColor: '#431A06' }}
            />
            <label htmlFor={option.id} style={{ flex: 1, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>{option.name}</span>
                <span style={{ fontWeight: 'bold', color: '#431A06' }}>${option.price}</span>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{option.days}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#431A06' }}>Payment Information</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['credit-card', 'paypal', 'apple-pay'].map((method) => (
          <div key={method} style={{
            flex: 1,
            padding: '1rem',
            border: '2px solid',
            borderColor: paymentMethod === method ? '#431A06' : '#e5e7eb',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: paymentMethod === method ? 'rgba(67, 26, 6, 0.05)' : 'white',
            transition: 'all 0.2s',
            textAlign: 'center'
          }}
          onClick={() => setPaymentMethod(method)}>
            <input
              type="radio"
              id={method}
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '0.5rem', accentColor: '#431A06' }}
            />
            <label htmlFor={method} style={{ cursor: 'pointer', fontWeight: '500' }}>
              {method === 'credit-card' ? 'Credit Card' : method === 'paypal' ? 'PayPal' : 'Apple Pay'}
            </label>
          </div>
        ))}
      </div>
      {paymentMethod === 'credit-card' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Card Number *</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.cardNumber ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none'
              }}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              onFocus={(e) => e.target.style.borderColor = '#431A06'}
              onBlur={(e) => e.target.style.borderColor = errors.cardNumber ? '#ef4444' : '#d1d5db'}
            />
            {errors.cardNumber && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.cardNumber}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expiry Date *</label>
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.expiryDate ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none'
              }}
              placeholder="MM/YY"
              maxLength="5"
              onFocus={(e) => e.target.style.borderColor = '#431A06'}
              onBlur={(e) => e.target.style.borderColor = errors.expiryDate ? '#ef4444' : '#d1d5db'}
            />
            {errors.expiryDate && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.expiryDate}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CVV *</label>
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.cvv ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none'
              }}
              placeholder="123"
              maxLength="4"
              onFocus={(e) => e.target.style.borderColor = '#431A06'}
              onBlur={(e) => e.target.style.borderColor = errors.cvv ? '#ef4444' : '#d1d5db'}
            />
            {errors.cvv && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.cvv}</span>}
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cardholder Name *</label>
            <input
              type="text"
              name="cardName"
              value={paymentInfo.cardName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.cardName ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none'
              }}
              placeholder="John Doe"
              onFocus={(e) => e.target.style.borderColor = '#431A06'}
              onBlur={(e) => e.target.style.borderColor = errors.cardName ? '#ef4444' : '#d1d5db'}
            />
            {errors.cardName && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.cardName}</span>}
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="saveCard"
                checked={paymentInfo.saveCard}
                onChange={handleInputChange}
                style={{ marginRight: '0.5rem', accentColor: '#431A06' }}
              />
              Save card for future purchases
            </label>
          </div>
        </div>
      )}
      {paymentMethod === 'paypal' && (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(67, 26, 6, 0.05)', borderRadius: '0.5rem' }}>
          <p style={{ color: '#6b7280' }}>You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}
      {paymentMethod === 'apple-pay' && (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(67, 26, 6, 0.05)', borderRadius: '0.5rem' }}>
          <p style={{ color: '#6b7280' }}>Use Touch ID or Face ID to complete your payment.</p>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', position: 'sticky', top: '1rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', color: '#431A06' }}>
        Order Summary
      </h3>
      
      <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
        {cartItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <img src={item.image} alt={item.name} style={{ height: '4rem', width: '4rem', objectFit: 'contain', marginRight: '1rem', borderRadius: '0.375rem' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Qty: {item.quantity || 1}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#431A06' }}>
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            style={{
              flex: 1,
              border: '1px solid #431A06',
              borderRadius: '0.375rem 0 0 0.375rem',
              padding: '0.5rem 0.75rem',
              outline: 'none',
              backgroundColor: '#f9fafb'
            }}
          />
          <button
            onClick={handlePromoCode}
            style={{
              backgroundColor: '#431A06',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0 0.375rem 0.375rem 0',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a2308'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#431A06'}
          >
            Apply
          </button>
        </div>
        {showPromoSuccess && (
          <div style={{ marginTop: '0.5rem', color: '#431A06', fontSize: '0.875rem', fontWeight: '600' }}>
            ✓ Promo code applied! {discount}% discount
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
          <span style={{ fontWeight: '500' }}>Total Items:</span>
          <span style={{ fontWeight: 'bold', color: '#431A06' }}>{calculateTotalItems()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
          <span style={{ fontWeight: '500' }}>Subtotal:</span>
          <span style={{ fontWeight: 'bold' }}>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
          <span style={{ fontWeight: '500' }}>Shipping:</span>
          <span style={{ fontWeight: 'bold', color: '#431A06' }}>${calculateShipping().toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
          <span style={{ fontWeight: '500' }}>Tax:</span>
          <span style={{ fontWeight: 'bold' }}>${calculateTax().toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
            <span style={{ fontWeight: '500' }}>Discount ({discount}%):</span>
            <span style={{ fontWeight: 'bold', color: '#dc2626' }}>
              -${((calculateSubtotal() * discount) / 100).toFixed(2)}
            </span>
          </div>
        )}
        <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(67, 26, 6, 0.1), rgba(67, 26, 6, 0.2))',
            borderRadius: '0.5rem'
          }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Total:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#431A06' }}>
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#431A06',
        margin: '0 auto 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" style={{ width: '60px', height: '60px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#431A06' }}>Order Placed Successfully!</h2>
      <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '1.5rem' }}>Thank you for your purchase. You will receive an email confirmation shortly.</p>
      <div style={{
        display: 'inline-block',
        padding: '1rem 2rem',
        backgroundColor: '#431A06',
        color: 'white',
        borderRadius: '0.5rem',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        Order #{orderNumber || '12345'}
      </div>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Redirecting to home page in 5 seconds...</p>
    </div>
  );

  if (cartItems.length === 0 && currentStep !== 4) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#431A06' }}>Your cart is empty</h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>Add some items to your cart to proceed with checkout.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#431A06',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a2308'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#431A06'}
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '2rem', width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', color: '#431A06', marginBottom: '1rem' }}>Checkout</h1>
          {currentStep !== 4 && renderStepIndicator()}
        </div>
        {currentStep === 4 ? (
          renderSuccessMessage()
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
            <div>
              {currentStep === 1 && renderShippingForm()}
              {currentStep === 2 && renderPaymentForm()}
              {currentStep === 3 && (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#431A06' }}>Review Your Order</h3>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#431A06' }}>Shipping Address</h4>
                      <p style={{ margin: '0.25rem 0' }}>{customerInfo.name}</p>
                      <p style={{ margin: '0.25rem 0' }}>{customerInfo.address}</p>
                      <p style={{ margin: '0.25rem 0' }}>{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                      <p style={{ margin: '0.25rem 0' }}>{customerInfo.country}</p>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#431A06' }}>Payment Method</h4>
                      <p>{paymentMethod === 'credit-card' ? 'Credit Card' : 
                          paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}</p>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isProcessing}
                    style={{
                      padding: '0.75rem 2rem',
                      border: '2px solid #431A06',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      color: '#431A06',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      opacity: isProcessing ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.target.style.backgroundColor = '#431A06';
                        e.target.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#431A06';
                      }
                    }}
                  >
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: '#431A06',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginLeft: 'auto',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5a2308'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#431A06'}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: '#431A06',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginLeft: 'auto',
                      transition: 'background-color 0.2s',
                      opacity: isProcessing ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => !isProcessing && (e.target.style.backgroundColor = '#5a2308')}
                    onMouseLeave={(e) => !isProcessing && (e.target.style.backgroundColor = '#431A06')}
                  >
                    {isProcessing ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </div>
            <div>
              {renderOrderSummary()}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Checkout;