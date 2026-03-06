import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, ORDER_API_END_POINT } from "../api/constant";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
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
  Sparkles,
} from "lucide-react";

// ─── Inline Orders — 100% copy of Orders.jsx render logic, no changes ─────────
const InlineOrders = ({ userEmail, token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalOrders: 0, hasNext: false, hasPrev: false,
  });

  const fetchOrders = async (page = 1, limit = 10) => {
    if (!userEmail) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${ORDER_API_END_POINT}/email/${userEmail}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (userEmail) fetchOrders(1); }, [userEmail]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) fetchOrders(newPage);
  };

  // ── Exact same helpers as Orders.jsx ──
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return { color: "from-emerald-500 to-green-600", textColor: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200", icon: CheckCircle, badge: "Delivered" };
      case "cancelled": case "refunded": return { color: "from-red-500 to-rose-600", textColor: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: XCircle, badge: "Cancelled" };
      case "shipped": return { color: "from-[#79300f] to-[#5a2408]", textColor: "text-[#79300f]", bgColor: "bg-[#F5E9DC]/50 border-[#79300f]/20", icon: Truck, badge: "Shipped" };
      case "processing": return { color: "from-amber-500 to-orange-600", textColor: "text-amber-700", bgColor: "bg-amber-50 border-amber-200", icon: Clock, badge: "Processing" };
      default: return { color: "from-[#79300f] to-[#5a2408]", textColor: "text-[#79300f]", bgColor: "bg-[#F5E9DC]/50 border-[#79300f]/20", icon: Package, badge: "Pending" };
    }
  };

  const handleViewDetails = (order) => { setSelectedOrder(order); setShowOrderDetails(true); };

  const handleDownloadInvoice = async (orderNumber) => {
    try {
      const res = await fetch(`${ORDER_API_END_POINT}/${orderNumber}/invoice`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to download invoice");
      const disposition = res.headers.get("Content-Disposition");
      const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] || `invoice-${orderNumber}.pdf`;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); window.URL.revokeObjectURL(url);
    } catch { alert("Error downloading invoice"); }
  };

  // ── Exact same JSX as Orders.jsx return, just without Header/Footer ──
  // Loading state
  if (loading) return (
    <div className="min-h-[200px] bg-[#F5F5F5] flex flex-col font-sans text-[#3b220c]">
      <div className="flex-1 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg p-8 shadow-lg">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#79300f]/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#79300f] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
            Loading your orders...
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (error) return (
    <div className="font-sans text-[#3b220c] py-6 px-6">
      <p className="text-red-600 font-semibold">{error}</p>
    </div>
  );

  // ── Exact Orders.jsx return JSX (Header/Footer removed, wrapper div classes kept) ──
  return (
    <div className="bg-[#F5F5F5] flex flex-col font-sans text-[#3b220c]">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 pb-16 pt-6">

          {/* Stats Section — tile grid layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-3 gap-3 mb-12"
          >
            {/* Total Orders tile */}
            <div className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#79300f]/5 to-[#5a2408]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="p-3 bg-gradient-to-r from-[#79300f] to-[#5a2408] rounded-lg shadow-lg relative z-10">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">{pagination.totalOrders}</p>
                <p className="text-[#5a2408] font-medium text-xs leading-tight">Total Orders</p>
              </div>
            </div>

            {/* Delivered tile */}
            <div className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg relative z-10">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {orders.filter((order) => order.status === "delivered").length}
                </p>
                <p className="text-[#5a2408] font-medium text-xs leading-tight">Delivered</p>
              </div>
            </div>

            {/* In Progress tile */}
            <div className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg relative z-10">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {orders.filter((order) => ["processing", "shipped"].includes(order.status)).length}
                </p>
                <p className="text-[#5a2408] font-medium text-xs leading-tight">In Progress</p>
              </div>
            </div>
          </motion.div>

          {/* Orders List — exact Orders.jsx */}
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
                    className="group bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#79300f]/5 to-[#5a2408]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="bg-gradient-to-r from-[#F5E9DC]/80 to-[#E7DDC6]/80 p-8 border-b border-[#79300f]/20 relative z-10">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-lg shadow-lg bg-gradient-to-r ${statusInfo.color}`}>
                            <StatusIcon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#79300f] mb-2">Order #{order.orderNumber}</h3>
                            <p className="text-[#5a2408] text-lg">Placed on {formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className={`px-4 py-2 rounded-full border-2 font-bold flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                            <StatusIcon className="w-4 h-4" />{statusInfo.badge}
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">
                              ${order.pricing.total.toFixed(2)}
                            </p>
                            <p className="text-[#5a2408]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-[#F5E9DC]/80 p-4 rounded-lg border border-[#79300f]/20">
                            <div className="relative">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#79300f] truncate text-lg">{item.name}</p>
                              <p className="text-[#5a2408]">Qty: {item.quantity} • ${item.price}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center bg-[#F5E9DC]/80 p-4 rounded-lg border border-[#79300f]/20">
                            <span className="font-bold text-[#79300f] text-lg">+{order.items.length - 3} more items</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="flex-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] hover:from-[#5a2408] hover:to-[#79300f] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
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

          {/* Pagination — exact Orders.jsx */}
          {!loading && !error && orders.length > 0 && pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-between items-center gap-8 mt-16 p-8 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg shadow-lg"
            >
              <div className="text-[#5a2408] text-lg">
                Showing {(pagination.currentPage - 1) * 10 + 1} to {Math.min(pagination.currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} orders
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrev}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 text-[#79300f] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 font-medium">
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button key={pageNum} onClick={() => handlePageChange(pageNum)}
                      className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 ${pageNum === pagination.currentPage ? "bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white shadow-lg" : "bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 text-[#79300f] hover:shadow-lg"}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 text-[#79300f] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 font-medium">
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Order Details Modal — exact Orders.jsx */}
          <AnimatePresence>
            {showOrderDetails && selectedOrder && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                onClick={() => setShowOrderDetails(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                >
                  <div className="bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white p-8 rounded-t-lg relative">
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Order Details</h2>
                        <p className="text-white/90 text-lg">#{selectedOrder.orderNumber}</p>
                      </div>
                      <button onClick={() => setShowOrderDetails(false)} className="p-3 hover:bg-white/20 rounded-lg transition-colors">
                        <span className="text-3xl">×</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-[#79300f] mb-4">Order Date</h3>
                          <p className="text-[#5a2408] text-lg">{formatDate(selectedOrder.createdAt)}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-[#79300f] mb-4">Total Amount</h3>
                          <p className="text-4xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">${selectedOrder.pricing.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#79300f] mb-4">Items</h3>
                          <p className="text-[#5a2408] text-lg">{selectedOrder.items.length} item{selectedOrder.items.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-[#79300f] mb-6">Order Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-6 p-6 bg-[#F5E9DC]/80 border border-[#79300f]/20 rounded-lg hover:bg-[#E7DDC6]/80 transition-colors duration-200">
                            <div className="relative">
                              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg shadow-lg" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-[#79300f] mb-2">{item.name}</h4>
                              <p className="text-[#5a2408] text-lg">${item.price.toFixed(2)} × {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#F5E9DC]/80 to-[#E7DDC6]/80 border border-[#79300f]/20 p-8 rounded-lg mb-8">
                      <h3 className="text-2xl font-bold text-[#79300f] mb-6">Order Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[#5a2408] text-lg">Subtotal</span>
                          <span className="text-xl font-bold text-[#79300f]">${selectedOrder.pricing.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[#5a2408] text-lg">Shipping</span>
                          <span className="text-xl font-bold text-[#79300f]">${selectedOrder.pricing.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[#5a2408] text-lg">Tax</span>
                          <span className="text-xl font-bold text-[#79300f]">${selectedOrder.pricing.tax.toFixed(2)}</span>
                        </div>
                        {selectedOrder.pricing.discount > 0 && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-emerald-600 text-lg">Discount</span>
                            <span className="text-xl font-bold text-emerald-600">-${selectedOrder.pricing.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-t border-[#79300f]/20 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-[#79300f]">Total</span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-[#79300f] to-[#5a2408] bg-clip-text text-transparent">${selectedOrder.pricing.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        className="flex-1 max-w-xs bg-gradient-to-br from-[#F5E9DC] to-[#E7DDC6] border border-[#79300f]/20 text-[#79300f] font-bold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                        onClick={() => handleDownloadInvoice(selectedOrder.orderNumber)}
                      >
                        <Download className="w-10 h-5" /> Download Invoice
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

// ─── Main UserProfile ────────────────────────────────────────────────────────
const UserProfile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userEmail = userData?.email || authUser?.email;

  const sidebarLinks = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "My Orders" },
  ];

  useEffect(() => {
    if (authUser) setFormData({ username: authUser.username || authUser.name || "", email: authUser.email || "" });
  }, [authUser]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    axios.get(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUserData(res.data.user);
        setFormData({ username: res.data.user.username || "", email: res.data.user.email || "" });
      })
      .catch((err) => {
        if (err.response?.status === 401) { localStorage.removeItem("token"); navigate("/login"); }
        else setError("Profile load error");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_BASE_URL}/user/profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setUserData(res.data.user);
      setIsEditing(false);
    } catch { setError("Profile update failed"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setShowLogoutModal(false);
    navigate("/login");
  };

  const renderProfile = () => (
    <div className="relative w-full md:w-[740px] bg-[#F9F7F6] p-6 md:p-10 shadow-[0_10px_32px_#e3dbc9be] border border-[#7D7D7D] rounded-md mt-6 md:mt-10">
      <h2 className="text-[20px] md:text-[26px] font-Playfair font-bold uppercase text-[#341405] mb-6 md:mb-8 border-b border-[#7D7D7D] pb-3 tracking-[0.05em]">Personal Info</h2>
      <div className="mt-4">
        <label className="block text-[20px] md:text-[26px] font-Playfair font-bold uppercase text-[#341405] mb-3 tracking-[0.05em]">Name</label>
        {isEditing ? (
          <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="h-[52px] md:h-[67px] w-full bg-white border border-[#7D7D7D] text-[16px] md:text-[20px] text-[#341405] px-3 rounded-md" />
        ) : (
          <div className="h-[52px] md:h-[67px] bg-[#F9F7F6] border-b border-[#7D7D7D] flex items-center text-[16px] md:text-[20px] text-[#341405] px-2">
            {userData?.username || authUser?.username || authUser?.name || ""}
          </div>
        )}
      </div>
      <div className="mt-6 md:mt-8">
        <label className="block text-[20px] md:text-[26px] font-Playfair font-bold uppercase text-[#341405] mb-3 tracking-[0.05em]">Contact</label>
        {isEditing ? (
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-[52px] md:h-[67px] w-full bg-white border border-[#7D7D7D] text-[16px] md:text-[20px] text-[#341405] px-3 rounded-md" />
        ) : (
          <div className="h-[52px] md:h-[67px] bg-[#F9F7F6] border-b border-[#7D7D7D] flex items-center text-[16px] md:text-[20px] text-[#341405] px-2 overflow-hidden">
            <span className="break-all">{userData?.email || authUser?.email || ""}</span>
          </div>
        )}
      </div>
      {isEditing && (
        <div className="flex justify-end mt-8 md:mt-10">
          <button onClick={handleSave} className="bg-[#482910] text-white px-6 md:px-8 py-3 rounded-md font-semibold tracking-wider text-sm md:text-base">SAVE CHANGES</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#faf7f2] font-[Georgia] text-[#482910]">

      {/* ── SIDEBAR ── */}
      <aside className="w-full md:w-[260px] bg-white border-b md:border-b-0 md:border-r border-[#eae5dc] flex flex-col">

        {/* ── MOBILE ONLY ── */}
        <div className="md:hidden">
          {/* Banner */}
          <div className="bg-gradient-to-br from-[#3a1f09] to-[#6b3a1f] px-5 pt-7 pb-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9903a] to-[#8b5a2b] flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-[#c9903a]/60 ring-offset-2 ring-offset-[#3a1f09]">
                  {(userData?.username || authUser?.username || authUser?.name || "U")[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#3a1f09]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">Welcome back</p>
                <h2 className="text-white text-lg font-semibold leading-tight truncate">
                  {userData?.username || authUser?.username || authUser?.name || "Guest"}
                </h2>
                <p className="text-[#c9903a] text-xs truncate mt-0.5">{userData?.email || authUser?.email || ""}</p>
              </div>
              {(userData || authUser) && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setIsEditing(!isEditing)}
                    className="border border-[#c9903a]/70 text-[#c9903a] text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm hover:bg-[#c9903a] hover:text-white transition-all duration-200">
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button onClick={() => setShowLogoutModal(true)}
                    className="border border-white/20 text-white/60 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-semibold hover:bg-white/10 transition-all duration-200">
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-white border-b border-[#eae5dc] px-1">
            {sidebarLinks.map((link) => (
              <button key={link.id}
                onClick={() => {
                  if (link.id === "orders") { setOrdersOpen((prev) => !prev); setActiveTab("orders"); }
                  else { setOrdersOpen(false); setActiveTab(link.id); }
                }}
                className={`flex-1 py-3 text-[13px] font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  activeTab === link.id ? "text-[#482910] border-b-[2.5px] border-[#482910]" : "text-[#9b8070] hover:text-[#482910]"
                }`}>
                {link.label}
                {link.id === "orders" && (
                  <motion.span animate={{ rotate: ordersOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="inline-flex">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </button>
            ))}
          </div>

          {/* ── THE TOGGLE — only new code ── */}
          <AnimatePresence initial={false}>
            {ordersOpen && (
              <motion.div
                key="orders-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <InlineOrders userEmail={userEmail} token={token} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── DESKTOP SIDEBAR — untouched ── */}
        <div className="hidden md:flex flex-col">
          <div className="flex flex-col items-center px-0 pt-10 pb-0 gap-0 w-[88%] mx-auto">
            <div className="w-[80px] h-[80px] rounded-full bg-[#482910] text-white flex items-center justify-center font-semibold text-[2.6rem] mb-4">
              {(userData?.username || authUser?.username || "U")[0].toUpperCase()}
            </div>
            <div className="font-semibold text-[1.14rem] text-[#482910] mb-9 text-center">
              {userData ? userData.username : "Login"}
            </div>
            {userData && (
              <button onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-[#482910] text-white py-3 rounded-sm font-semibold mb-9 tracking-wider text-sm">
                {isEditing ? "CANCEL EDIT" : "EDIT PROFILE"}
              </button>
            )}
          </div>
          <nav className="flex flex-col w-full mt-7">
            {sidebarLinks.map((link) => (
              <button key={link.id}
                onClick={() => { if (link.id === "orders") navigate("/orders"); else setActiveTab(link.id); }}
                className={`py-3 px-4 font-medium text-[1.01rem] tracking-tight text-left ${activeTab === link.id ? "bg-[#f8f6f2] border-l-[3.5px] border-[#482910]" : "hover:bg-[#f8f6f2]"}`}>
                {link.label}
              </button>
            ))}
          </nav>
          <hr className="border-t border-[#eae5dc] w-[87%] my-6 mx-auto" />
          {userData ? (
            <button onClick={() => setShowLogoutModal(true)} className="text-[#ad8571] font-semibold text-[1.03rem] self-start ml-[8%] mb-4">LOG OUT</button>
          ) : (
            <button onClick={() => navigate("/login")} className="text-[#482910] font-semibold text-[1.03rem] self-start ml-[8%] mb-4">LOGIN</button>
          )}
        </div>
      </aside>

      {/* ── MAIN PANEL — untouched ── */}
      <main className="flex-1 bg-[#faf7f2] py-6 md:py-14 flex flex-col items-center min-h-screen px-4 md:px-0">
        {loading && <div className="mb-5">Loading...</div>}
        {error && <div className="text-red-600 font-semibold mb-5">{error}</div>}
        {activeTab === "profile" && renderProfile()}
      </main>

      {/* ── LOGOUT MODAL — untouched ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[350px] p-6 text-center">
            <h2 className="text-[18px] md:text-[20px] font-semibold mb-4 text-[#341405]">Are you sure you want to Logout?</h2>
            <div className="flex justify-around mt-6">
              <button onClick={() => setShowLogoutModal(false)} className="px-5 py-2 rounded-md bg-gray-300 text-[#341405] font-medium hover:bg-gray-400">Cancel</button>
              <button onClick={handleLogout} className="px-5 py-2 rounded-md bg-[#482910] text-white font-semibold hover:bg-[#341405]">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
