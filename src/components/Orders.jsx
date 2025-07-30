import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ORDER_API_END_POINT } from '../api/constant';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag, Eye, Download, MapPin, Sparkles } from 'lucide-react';
import Header from './common/Header'; // Import Header component
import Footer from './common/Footer'; // Import Footer component

const Orders = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch orders for the logged-in user
  const fetchOrders = async (page = 1, limit = 10) => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${ORDER_API_END_POINT}/email/${user.email}`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount and when user or page changes
  useEffect(() => {
    if (user?.email && !authLoading) {
      fetchOrders(pagination.currentPage);
    }
  }, [user, authLoading]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format status
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color and icon - matching the theme
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          color: 'from-emerald-500 to-green-600',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50 border-emerald-200',
          icon: CheckCircle,
          badge: 'Delivered'
        };
      case 'cancelled':
      case 'refunded':
        return {
          color: 'from-red-500 to-rose-600',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50 border-red-200',
          icon: XCircle,
          badge: 'Cancelled'
        };
      case 'shipped':
        return {
          color: 'from-blue-500 to-indigo-600',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50 border-blue-200',
          icon: Truck,
          badge: 'Shipped'
        };
      case 'processing':
        return {
          color: 'from-amber-500 to-orange-600',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50 border-amber-200',
          icon: Clock,
          badge: 'Processing'
        };
      default:
        return {
          color: 'from-blue-500 to-indigo-600',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50 border-blue-200',
          icon: Package,
          badge: 'Pending'
        };
    }
  };

  // Handle order details view
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Animation variants matching the theme
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Loading your orders...
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl max-w-lg relative overflow-hidden"
          >
            {/* Background sparkle */}
            <div className="absolute top-6 right-6 opacity-20">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            
            <div className="text-8xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Sign In Required
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Please log in to view your order history and track your purchases with our premium fragrance collection.
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Sign In to Continue
              </span>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
      <Header />
      <div className="flex-1">
        {/* Hero Section */}
        <motion.section
          variants={fadeInVariant}
          initial="hidden"
          animate="show"
          className="py-20 px-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-purple-100/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10" />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                My Orders
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Track and manage your premium fragrance purchases. Experience luxury delivered to your doorstep.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          {/* Stats Section */}
          <motion.div
            variants={fadeInVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {pagination.totalOrders}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {orders.filter(order => order.status === 'delivered').length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Delivered</p>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {orders.filter(order => ['processing', 'shipped'].includes(order.status)).length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">In Progress</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Loading your orders...
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 text-center mb-8 shadow-xl"
            >
              <div className="text-6xl mb-6">⚠️</div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h3>
              <p className="text-red-500 mb-6 text-lg">{error}</p>
              <button
                onClick={() => fetchOrders(pagination.currentPage)}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-9xl mb-8">🛍️</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                No Orders Yet
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto leading-relaxed">
                Ready to place your first order? Discover our exquisite collection of premium fragrances!
              </p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span-cart className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  Start Shopping
                </span-cart>
              </Link>
            </motion.div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-8">
              {orders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={order.orderNumber}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    
                    {/* Sparkle decoration */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>

                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm p-8 border-b border-white/20 relative z-10">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className={`p-4 bg-gradient-to-r ${statusInfo.color} rounded-2xl shadow-lg`}>
                            <StatusIcon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className={`px-4 py-2 rounded-full border-2 font-bold ${statusInfo.bgColor} ${statusInfo.textColor} flex items-center gap-2`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.badge}
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              ${order.pricing.total.toFixed(2)}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-8 relative z-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-4 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-xl shadow-md"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                {item.name}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity} • ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center bg-gradient-to-r from-blue-100/80 to-indigo-100/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            <span className="font-bold text-blue-600 text-lg">
                              +{order.items.length - 3} more items
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <Eye className="w-5 h-5" />
                          View Details
                        </button>
                        <button className="flex-1 bg-white/90 backdrop-blur-sm border border-white/20 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3">
                          <MapPin className="w-5 h-5" />
                          Track Package
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && orders.length > 0 && pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-between items-center gap-8 mt-16 p-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg"
            >
              <div className="text-gray-600 dark:text-gray-300 text-lg">
                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} orders
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm border border-white/20 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-12 h-12 rounded-2xl font-bold transition-all duration-200 ${
                          pageNum === pagination.currentPage
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/90 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm border border-white/20 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowOrderDetails(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-t-3xl relative">
                  <div className="absolute top-4 right-4 opacity-20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Order Details</h2>
                      <p className="text-white/90 text-lg">#{selectedOrder.orderNumber}</p>
                    </div>
                    <button
                      onClick={() => setShowOrderDetails(false)}
                      className="p-3 hover:bg-white/20 rounded-2xl transition-colors"
                    >
                      <span className="text-3xl">×</span>
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  {/* Order Status and Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Date</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Total Amount</h3>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ${selectedOrder.pricing.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Items</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {selectedOrder.items.length} item{selectedOrder.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-6 p-6 bg-gray-50/80 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-gray-100/80 transition-colors duration-200">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm border border-white/20 p-8 rounded-3xl mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 text-lg">Subtotal</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${selectedOrder.pricing.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 text-lg">Shipping</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${selectedOrder.pricing.shipping.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 text-lg">Tax</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${selectedOrder.pricing.tax.toFixed(2)}
                        </span>
                      </div>
                      {selectedOrder.pricing.discount > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-emerald-600 dark:text-emerald-400 text-lg">Discount</span>
                          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            -${selectedOrder.pricing.discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">Total</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ${selectedOrder.pricing.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3">
                      <MapPin className="w-5 h-5" />
                      Track Package
                    </button>
                    <button className="flex-1 bg-white/90 backdrop-blur-sm border border-white/20 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3">
                      <Download className="w-5 h-5" />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;