// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { USER_API_END_POINT, ORDER_API_END_POINT } from '@/api/constant'; // Import both endpoints

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
          email: response.data.user.email,
          isAdmin: response.data.user.isAdmin
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

  // Get user profile function
  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/profile`);
      
      if (response.data.success) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          isAdmin: response.data.user.isAdmin,
          isVerified: response.data.user.isVerified
        };
        
        // Update user state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return {
          success: true,
          user: userData
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get user profile'
        };
      }
    } catch (error) {
      console.error('Get user profile error:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user profile'
      };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  // Get token function
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // User management functions
  const getAllUsers = async () => {
    try {
      if (!isAdmin()) {
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      const response = await axios.get(`${USER_API_END_POINT}/admin/users`);
      
      if (response.data.success) {
        return {
          success: true,
          users: response.data.users
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get users'
        };
      }
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get users'
      };
    }
  };

  const updateUserAdminStatus = async (userId, isAdminStatus) => {
    try {
      if (!isAdmin()) {
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      const response = await axios.patch(`${USER_API_END_POINT}/admin/users/${userId}/admin-status`, {
        isAdmin: isAdminStatus
      });
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.user,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to update user admin status'
        };
      }
    } catch (error) {
      console.error('Update user admin status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user admin status'
      };
    }
  };

  // FIXED: Order management functions with correct endpoint
  const getAllOrders = async (params = {}) => {
    try {
      console.log('getAllOrders called with params:', params);
      
      if (!isAdmin()) {
        console.log('User is not admin:', user);
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      // Build query string from params
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `${ORDER_API_END_POINT}${queryString ? `?${queryString}` : ''}`; // Now using correct endpoint
      
      console.log('Making request to:', url);
      console.log('Authorization header:', axios.defaults.headers.common['Authorization']);
      
      const response = await axios.get(url);
      
      console.log('Orders API response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          orders: response.data.orders,
          pagination: response.data.pagination,
          stats: response.data.stats
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get orders'
        };
      }
    } catch (error) {
      console.error('Get all orders error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request URL:', error.config?.url);
      
      return {
        success: false,
        message: error.response?.data?.message || `Failed to get orders: ${error.message}`
      };
    }
  };

  const getOrderByNumber = async (orderNumber) => {
    try {
      console.log('getOrderByNumber called with:', orderNumber);
      
      if (!isAdmin()) {
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      const response = await axios.get(`${ORDER_API_END_POINT}/${orderNumber}`);
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Order not found'
        };
      }
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get order'
      };
    }
  };

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      console.log('updateOrderStatus called with:', orderNumber, status);
      
      if (!isAdmin()) {
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      const response = await axios.put(`${ORDER_API_END_POINT}/${orderNumber}/status`, {
        status
      });
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order,
          message: response.data.message || 'Order status updated successfully'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to update order status'
        };
      }
    } catch (error) {
      console.error('Update order status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  };

  const deleteOrder = async (orderNumber) => {
    try {
      console.log('deleteOrder called with:', orderNumber);
      
      if (!isAdmin()) {
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      const response = await axios.delete(`${ORDER_API_END_POINT}/${orderNumber}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Order deleted successfully',
          deletedOrder: response.data.deletedOrder
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to delete order'
        };
      }
    } catch (error) {
      console.error('Delete order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete order'
      };
    }
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
    getUserProfile,
    isAdmin,
    getAllUsers,
    updateUserAdminStatus,
    // Order management functions
    getAllOrders,
    getOrderByNumber,
    updateOrderStatus,
    deleteOrder,
    token: getToken(),
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};