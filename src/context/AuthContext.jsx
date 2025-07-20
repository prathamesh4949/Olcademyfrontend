// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/api/constant';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set default authorization header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/check-username/${username}`);
      return response.data.available;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${USER_API_END_POINT}/signup`, {
        username,
        email,
        password
      });

      if (response.data.success) {
        // Since your backend doesn't automatically log in users on signup,
        // we should not set the user state or store tokens here
        // The user needs to verify their email first
        
        return {
          success: true,
          message: response.data.message || 'Account created successfully! Please check your email for verification.'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  };

  // Verify email function
  const verifyEmail = async (email, emailOtp) => {
    try {
      const response = await axios.post(`${USER_API_END_POINT}/signup/verify-email`, {
        email,
        emailOtp
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Email verified successfully!'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Email verification failed'
        };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: 'Email verification failed. Please try again.'
      };
    }
  };

  // Resend OTP function
  const resendOtp = async (email) => {
    try {
      const response = await axios.post(`${USER_API_END_POINT}/signup/resend-otp`, {
        email
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'OTP sent successfully!'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to resend OTP'
        };
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.'
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, {
        email,
        password
      });

      if (response.data.success) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email
        };

        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Update user state
        setUser(userData);
        
        return {
          success: true,
          message: 'Login successful!'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: 'Login failed. Please check your credentials.'
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Get token function
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    checkUsernameAvailability,
    verifyEmail,
    resendOtp,
    token: getToken(), // Add token to context value
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Add the useAuth hook that was missing
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};