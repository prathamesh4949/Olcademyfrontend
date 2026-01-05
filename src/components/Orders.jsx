import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ORDER_API_END_POINT } from '../api/constant';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Eye,
  Download,
  MapPin,
  Sparkles,
} from 'lucide-react';
import Header from './common/Header';
import Footer from './common/Footer';

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

  const fetchOrders = async (page = 1, limit = 10) => {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${ORDER_API_END_POINT}/email/${user.email}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  useEffect(() => {
    if (user?.email && !authLoading) {
      fetchOrders(pagination.currentPage);
    }
  }, [user, authLoading]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          color: 'from-emerald-500 to-green-600',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50 border-emerald-200',
          icon: CheckCircle,
          badge: 'Delivered',
        };
      case 'cancelled':
      case 'refunded':
        return {
          color: 'from-red-500 to-rose-600',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50 border-red-200',
          icon: XCircle,
          badge: 'Cancelled',
        };
      case 'shipped':
        return {
          color: 'from-[#79300f] to-[#5a2408]',
          textColor: 'text-[#79300f]',
          bgColor: 'bg-[#F5E9DC]/50 border-[#79300f]/20',
          icon: Truck,
          badge: 'Shipped',
        };
      case 'processing':
        return {
          color: 'from-amber-500 to-orange-600',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50 border-amber-200',
          icon: Clock,
          badge: 'Processing',
        };
      default:
        return {
          color: 'from-[#79300f] to-[#5a2408]',
          textColor: 'text-[#79300f]',
          bgColor: 'bg-[#F5E9DC]/50 border-[#79300f]/20',
          icon: Package,
          badge: 'Pending',
        };
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleDownloadInvoice = async (orderNumber) => {
    try {
      const res = await fetch(`${ORDER_API_END_POINT}/${orderNumber}/invoice`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Failed to download invoice');
      const disposition = res.headers.get('Content-Disposition');
      const filename =
        disposition?.match(/filename="?([^"]+)"?/)?.[1] || `invoice-${orderNumber}.pdf`;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Error downloading invoice');
    }
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#220104] flex flex-col font-sans text-[#3b220c] dark:text-[#f6d110]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg p-8 shadow-lg"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#79300f]/20 dark:border-[#f6d110]/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-[#79300f] dark:border-[#f6d110] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37]">
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
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#220104] flex flex-col font-sans text-[#3b220c] dark:text-[#f6d110]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg shadow-lg max-w-lg relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 opacity-20">
              <Sparkles className="w-8 h-8 text-[#79300f] dark:text-[#f6d110]" />
            </div>
            <div className="text-8xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37] mb-4">
              Sign In Required
            </h2>
            <p className="text-lg text-[#5a2408] dark:text-[#d4af37] mb-8 leading-relaxed">
              Please log in to view your order history and track your purchases with our premium
              fragrance collection.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] dark:from-[#f6d110] dark:to-[#d4af37] dark:hover:from-[#d4af37] dark:hover:to-[#f6d110] text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Sign In to Continue
              </span>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#220104] flex flex-col font-sans text-[#3b220c] dark:text-[#f6d110]">
      <Header />
      <div className="flex-1">
        <motion.section
          variants={fadeInVariant}
          initial="hidden"
          animate="show"
          className="py-20 px-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5E9DC]/30 to-[#E7DDC6]/30 dark:from-[#3d1a0a]/30 dark:to-[#2c0f06]/30"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37] mb-4">
                My Orders
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] dark:from-[#f6d110] dark:to-[#d4af37] mx-auto rounded-full mb-4"></div>
              <p className="text-lg text-[#5a2408] dark:text-[#d4af37] leading-relaxed max-w-2xl mx-auto">
                Track and manage your premium fragrance purchases. Experience luxury delivered to
                your doorstep.
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
            <div className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#79300f]/5 to-[#5a2408]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 dark:from-[#f6d110]/5 dark:to-[#d4af37]/5"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gradient-to-r from-[#79300f] to-[#5a2408] dark:from-[#f6d110] dark:to-[#d4af37] rounded-lg shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37]">
                    {pagination.totalOrders}
                  </p>
                  <p className="text-[#5a2408] dark:text-[#d4af37] font-medium">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {orders.filter((order) => order.status === 'delivered').length}
                  </p>
                  <p className="text-[#5a2408] dark:text-[#d4af37] font-medium">Delivered</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {
                      orders.filter((order) => ['processing', 'shipped'].includes(order.status))
                        .length
                    }
                  </p>
                  <p className="text-[#5a2408] dark:text-[#d4af37] font-medium">In Progress</p>
                </div>
              </div>
            </div>
          </motion.div>

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
                    className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#79300f]/5 to-[#5a2408]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 dark:from-[#f6d110]/5 dark:to-[#d4af37]/5"></div>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Sparkles className="w-6 h-6 text-[#79300f] dark:text-[#f6d110]" />
                    </div>
                    <div className="bg-gradient-to-r from-[#F5E9DC]/80 to-[#E7DDC6]/80 dark:from-[#3d1a0a]/80 dark:to-[#2c0f06]/80 p-8 border-b border-[#79300f]/20 dark:border-[#f6d110]/20 relative z-10">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div
                            className={`p-4 rounded-lg shadow-lg bg-gradient-to-r ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110] mb-2">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div
                            className={`px-4 py-2 rounded-full border-2 font-bold flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.textColor}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.badge}
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37]">
                              ${order.pricing.total.toFixed(2)}
                            </p>
                            <p className="text-[#5a2408] dark:text-[#d4af37]">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-[#F5E9DC]/80 dark:bg-[#3d1a0a]/80 p-4 rounded-lg border border-[#79300f]/20 dark:border-[#f6d110]/20"
                          >
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg shadow-md"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#79300f] dark:text-[#f6d110] truncate text-lg">
                                {item.name}
                              </p>
                              <p className="text-[#5a2408] dark:text-[#d4af37]">
                                Qty: {item.quantity} • ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center bg-[#F5E9DC]/80 dark:bg-[#3d1a0a]/80 p-4 rounded-lg border border-[#79300f]/20 dark:border-[#d4af110]/20">
                            <span className="font-bold text-[#79300f] dark:text-[#f6d110] text-lg">
                              +{order.items.length - 3} more items
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="flex-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] dark:from-[#f6d110] dark:to-[#d4af37] dark:hover:from-[#d4af37] dark:hover:to-[#f6d110] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <Eye className="w-5 h-5" /> View Details
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
              className="flex flex-col sm:flex-row justify-between items-center gap-8 mt-16 p-8 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg shadow-lg"
            >
              <div className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                Showing {(pagination.currentPage - 1) * 10 + 1} to{' '}
                {Math.min(pagination.currentPage * 10, pagination.totalOrders)} of{' '}
                {pagination.totalOrders} orders
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#d4af110]/30 text-[#79300f] dark:text-[#d4af110] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 ${pageNum === pagination.currentPage ? 'bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white shadow-lg dark:from-[#f6d110] dark:to-[#d4af37]' : 'bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#d4af110]/30 text-[#79300f] dark:text-[#d4af110] hover:shadow-lg'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#d4af110]/30 text-[#79300f] dark:text-[#d4af110] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

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
                  className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                >
                  <div className="bg-gradient-to-r from-[#79300f] to-[#5a2408] dark:from-[#f6d110] dark:to-[#d4af37] text-white p-8 rounded-t-lg relative">
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
                        className="p-3 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <span className="text-3xl">×</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-[#79300f] dark:text-[#f6d110] mb-4">
                            Order Date
                          </h3>
                          <p className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                            {formatDate(selectedOrder.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-[#79300f] dark:text-[#f6d110] mb-4">
                            Total Amount
                          </h3>
                          <p className="text-4xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37]">
                            ${selectedOrder.pricing.total.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#79300f] dark:text-[#f6d110] mb-4">
                            Items
                          </h3>
                          <p className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                            {selectedOrder.items.length} item
                            {selectedOrder.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110] mb-6">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-6 p-6 bg-[#F5E9DC]/80 dark:bg-[#3d1a0a]/80 border border-[#79300f]/20 dark:border-[#f6d110]/20 rounded-lg hover:bg-[#E7DDC6]/80 dark:hover:bg-[#2c0f06]/80 transition-colors duration-200"
                          >
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg shadow-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-[#79300f] dark:text-[#f6d110] mb-2">
                                {item.name}
                              </h4>
                              <p className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#F5E9DC]/80 to-[#E7DDC6]/80 dark:from-[#3d1a0a]/80 dark:to-[#2c0f06]/80 border border-[#79300f]/20 dark:border-[#f6d110]/20 p-8 rounded-lg mb-8">
                      <h3 className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110] mb-6">
                        Order Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                            Subtotal
                          </span>
                          <span className="text-xl font-bold text-[#79300f] dark:text-[#f6d110]">
                            ${selectedOrder.pricing.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[#5a2408] dark:text-[#d4af37] text-lg">
                            Shipping
                          </span>
                          <span className="text-xl font-bold text-[#79300f] dark:text-[#f6d110]">
                            ${selectedOrder.pricing.shipping.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[#5a2408] dark:text-[#d4af37] text-lg">Tax</span>
                          <span className="text-xl font-bold text-[#79300f] dark:text-[#f6d110]">
                            ${selectedOrder.pricing.tax.toFixed(2)}
                          </span>
                        </div>
                        {selectedOrder.pricing.discount > 0 && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-emerald-600 dark:text-emerald-400 text-lg">
                              Discount
                            </span>
                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              -${selectedOrder.pricing.discount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-[#79300f]/20 dark:border-[#f6d110]/20 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-[#79300f] dark:text-[#f6d110]">
                              Total
                            </span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent dark:from-[#f6d110] dark:to-[#d4af37]">
                              ${selectedOrder.pricing.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <div className="flex justify-center">
                      <button
                        className="flex-1 max-w-xs bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] dark:from-[#3d1a0a] dark:to-[#2c0f06] border border-[#79300f]/20 dark:border-[#f6d110]/30 text-[#79300f] dark:text-[#f6d110] font-bold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                        onClick={() => handleDownloadInvoice(selectedOrder.orderNumber)}
                      >
                        <Download className="w-10 h-5" />
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
