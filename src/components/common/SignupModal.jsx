// components/SignupModal.jsx
import React, { useState, useContext } from 'react';
import perfumeImage from '../../../public/images/Rectangle 58.png';
import { AuthContext } from '@/context/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const SignupModal = ({ isOpen, onClose, openLogin, openVerify, setEmail }) => {
  if (!isOpen) return null;

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [checkingUsername, setCheckingUsername] = useState(false);

  const { register, checkUsernameAvailability } = useContext(AuthContext);

  const changeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleUsernameBlur = async () => {
    if (input.username && input.username.length >= 3) {
      setCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameAvailability(input.username);
        if (!isAvailable) {
          setMessage({ type: 'error', text: 'Username is already taken. Please choose another one.' });
        }
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setCheckingUsername(false);
      }
    }
  };

  const validateForm = () => {
    if (!input.username || !input.email || !input.password || !input.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return false;
    }

    if (input.username.length < 3) {
      setMessage({ type: 'error', text: 'Username must be at least 3 characters long' });
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(input.username)) {
      setMessage({ type: 'error', text: 'Username can only contain letters, numbers, and underscores' });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(input.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    if (input.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }

    if (input.password !== input.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await register(input.username, input.email, input.password);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setEmail(input.email);
        setTimeout(() => {
          // Open verify OTP modal after successful registration
          handleClose();
          openVerify();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInput({ username: "", email: "", password: "", confirmPassword: "" });
    setMessage({ type: '', text: '' });
    onClose();
  };

  const handleOpenLogin = () => {
    handleClose();
    openLogin();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10010 }}>
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex shadow-2xl">
        {/* Left Side Image */}
        <div className="hidden md:block md:w-1/2 h-full relative">
          <img
            src={perfumeImage}
            alt="Perfume"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#f8f5f1] to-white p-8 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#79300f] mb-2">Vesarii</h2>
            <h3 className="text-xl font-semibold text-[#79300f] mb-2">Join Our Scented World</h3>
            <p className="text-sm text-gray-600">
              Enjoy early access to new collections, exclusive offers, and a welcome treat of 10% off your first order.
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={changeInputHandler}
                  onBlur={handleUsernameBlur}
                  placeholder="Choose a unique username"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79300f] focus:border-transparent outline-none transition-all"
                  disabled={loading || checkingUsername}
                />
                {checkingUsername && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeInputHandler}
                placeholder="Enter your email"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79300f] focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={changeInputHandler}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79300f] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={input.confirmPassword}
                  onChange={changeInputHandler}
                  placeholder="Confirm your password"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79300f] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || checkingUsername}
              className="w-full h-12 bg-gradient-to-r from-[#79300f] to-[#b14527] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-3">
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <button 
                onClick={handleOpenLogin}
                className="text-[#79300f] font-semibold hover:text-[#b14527] transition-colors"
                disabled={loading}
              >
                Login
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;