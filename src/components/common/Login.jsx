import axios from 'axios';
import React, { useState, useContext } from 'react';
import { USER_API_END_POINT } from '@/api/constant';
import { AuthContext } from '@/context/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const Login = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { login, user } = useContext(AuthContext);

  const changeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!input.email || !input.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(input.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await login(input.email, input.password);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(() => {
          onClose();
          setInput({ email: "", password: "" });
          setMessage({ type: '', text: '' });
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
    setInput({ email: "", password: "" });
    setMessage({ type: '', text: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#79300f] to-[#b14527] text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-white/90">Login to your Vesarii account</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Admin Status Display (if user is logged in and is admin) */}
          {user?.isAdmin && (
            <div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Admin Access Active</span>
            </div>
          )}

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
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#79300f] to-[#b14527] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Logging In...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
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
  );
};

export default Login;