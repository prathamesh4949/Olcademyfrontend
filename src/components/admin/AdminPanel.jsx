import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { 
  Shield, 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  Mail,
  User,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MoreHorizontal,
  ChevronDown,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Star,
  MapPin,
  Phone,
  CreditCard,
  X,
  Package2,
  Palette
} from 'lucide-react';

const ModernAdminPanel = () => {
  const { 
    user, 
    isAdmin, 
    getAllUsers, 
    updateUserAdminStatus,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
  } = useContext(AuthContext);

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  
  // Add debug state
  const [debugInfo, setDebugInfo] = useState({});

  // Check if current user is admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-auto">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have admin privileges to access this page.</p>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left text-sm">
            <p><strong>Current User:</strong> {user?.username || 'Not logged in'}</p>
            <p><strong>Is Admin:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch data on component mount
  useEffect(() => {
    console.log('AdminPanel useEffect triggered, activeTab:', activeTab);
    fetchUsers();
    if (activeTab === 'orders' || activeTab === 'dashboard') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    console.log('Fetching users...');
    try {
      const result = await getAllUsers();
      console.log('Users fetch result:', result);
      
      if (result.success) {
        setUsers(result.users);
        setDebugInfo(prev => ({ 
          ...prev, 
          usersStatus: `✅ Loaded ${result.users.length} users`,
          lastUserFetch: new Date().toLocaleTimeString()
        }));
      } else {
        setMessage({ type: 'error', text: result.message });
        setDebugInfo(prev => ({ 
          ...prev, 
          usersStatus: `❌ Users error: ${result.message}`,
          lastUserFetch: new Date().toLocaleTimeString()
        }));
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
      setDebugInfo(prev => ({ 
        ...prev, 
        usersStatus: `❌ Users exception: ${error.message}`,
        lastUserFetch: new Date().toLocaleTimeString()
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (page = 1, status = orderFilterStatus) => {
    setOrdersLoading(true);
    console.log('Fetching orders with params:', { page, status, orderSearchTerm });
    
    try {
      const params = {
        page,
        limit: 10,
        ...(status !== 'all' && { status }),
        ...(orderSearchTerm && { email: orderSearchTerm })
      };
      
      console.log('Orders API params:', params);
      
      const result = await getAllOrders(params);
      console.log('Orders fetch result:', result);
      
      if (result.success) {
        setOrders(result.orders);
        setPagination(result.pagination);
        setDebugInfo(prev => ({ 
          ...prev, 
          ordersStatus: `✅ Loaded ${result.orders.length} orders`,
          totalOrders: result.pagination?.totalOrders || 0,
          lastOrderFetch: new Date().toLocaleTimeString(),
          orderApiResponse: JSON.stringify(result, null, 2)
        }));
      } else {
        setMessage({ type: 'error', text: result.message });
        setDebugInfo(prev => ({ 
          ...prev, 
          ordersStatus: `❌ Orders error: ${result.message}`,
          lastOrderFetch: new Date().toLocaleTimeString(),
          orderApiResponse: JSON.stringify(result, null, 2)
        }));
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
      setMessage({ type: 'error', text: 'Failed to fetch orders' });
      setDebugInfo(prev => ({ 
        ...prev, 
        ordersStatus: `❌ Orders exception: ${error.message}`,
        lastOrderFetch: new Date().toLocaleTimeString(),
        orderApiError: error.toString()
      }));
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAdminStatusToggle = async (userId, currentStatus) => {
    setUpdatingUserId(userId);
    try {
      const result = await updateUserAdminStatus(userId, !currentStatus);
      if (result.success) {
        setUsers(users.map(u => 
          u._id === userId ? { ...u, isAdmin: !currentStatus } : u
        ));
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update admin status' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleOrderStatusUpdate = async (orderNumber, newStatus) => {
    setUpdatingOrderId(orderNumber);
    try {
      const result = await updateOrderStatus(orderNumber, newStatus);
      if (result.success) {
        setOrders(orders.map(order => 
          order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
        ));
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update order status' });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderNumber) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteOrder(orderNumber);
      if (result.success) {
        setOrders(orders.filter(order => order.orderNumber !== orderNumber));
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete order' });
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Filter functions
  const filteredUsers = users.filter(user => {
    const username = user.username || '';
    const email = user.email || '';
    
    const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    switch (filterType) {
      case 'admin':
        matchesFilter = user.isAdmin;
        break;
      case 'regular':
        matchesFilter = !user.isAdmin;
        break;
      case 'verified':
        matchesFilter = user.isVerified;
        break;
      case 'unverified':
        matchesFilter = !user.isVerified;
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = orders.filter(order => {
    const customerEmail = order.customerInfo?.email || '';
    const orderNumber = order.orderNumber || '';
    const customerName = order.customerInfo?.name || '';
    
    return customerEmail.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
           orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
           customerName.toLowerCase().includes(orderSearchTerm.toLowerCase());
  });

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle2,
      processing: RefreshCw,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  // Stats calculations
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.isAdmin).length,
    verifiedUsers: users.filter(u => u.isVerified).length,
    unverifiedUsers: users.filter(u => !u.isVerified).length,
    totalOrders: pagination.totalOrders,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, isActive: true },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, isActive: true },
    { id: 'users', label: 'Users', icon: Users, isActive: true },
    { id: 'products', label: 'Products', icon: Package2, isActive: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, isActive: false },
    { id: 'inventory', label: 'Inventory', icon: Package, isActive: false },
    { id: 'marketing', label: 'Marketing', icon: Palette, isActive: false },
    { id: 'settings', label: 'Settings', icon: Settings, isActive: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-amber-900 to-amber-800 shadow-2xl z-50">
        <div className="p-6 border-b border-amber-700">
          <h1 className="text-2xl font-bold text-white">Vesarii</h1>
          <p className="text-amber-200 text-sm">Admin Panel</p>
        </div>
        
        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.isActive && setActiveTab(item.id)}
                disabled={!item.isActive}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
                  activeTab === item.id && item.isActive
                    ? 'bg-white text-amber-900 shadow-lg transform scale-105'
                    : item.isActive
                    ? 'text-amber-100 hover:bg-amber-700 hover:text-white'
                    : 'text-amber-300 opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeTab === 'dashboard' ? 'Welcome back, Admin' : activeTab}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {activeTab === 'dashboard' 
                    ? "Here's what's happening with your fragrance empire today"
                    : `Manage your ${activeTab} efficiently`
                  }
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">{user?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information Panel - REMOVE THIS IN PRODUCTION */}
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="px-8 py-3">
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-yellow-800">
                🐛 Debug Information (Click to expand)
              </summary>
              <div className="mt-2 space-y-2 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p><strong>Users Status:</strong> {debugInfo.usersStatus || 'Not fetched'}</p>
                    <p><strong>Last User Fetch:</strong> {debugInfo.lastUserFetch || 'Never'}</p>
                    <p><strong>Orders Status:</strong> {debugInfo.ordersStatus || 'Not fetched'}</p>
                    <p><strong>Last Order Fetch:</strong> {debugInfo.lastOrderFetch || 'Never'}</p>
                    <p><strong>Total Orders in DB:</strong> {debugInfo.totalOrders || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Current User:</strong> {user?.username} (Admin: {user?.isAdmin ? 'Yes' : 'No'})</p>
                    <p><strong>Active Tab:</strong> {activeTab}</p>
                    <p><strong>Orders Array Length:</strong> {orders.length}</p>
                    <p><strong>Users Array Length:</strong> {users.length}</p>
                  </div>
                </div>
                {debugInfo.orderApiResponse && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-800">Last Order API Response</summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {debugInfo.orderApiResponse}
                    </pre>
                  </details>
                )}
                {debugInfo.orderApiError && (
                  <div className="mt-2 p-2 bg-red-100 rounded">
                    <p className="text-red-800"><strong>Order API Error:</strong> {debugInfo.orderApiError}</p>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="text-emerald-600 text-sm mt-2 font-medium">From {stats.totalOrders} orders</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalOrders}</p>
                      <p className="text-blue-600 text-sm mt-2 font-medium">{stats.pendingOrders} pending</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
                      <p className="text-purple-600 text-sm mt-2 font-medium">{stats.adminUsers} admins</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Completed Orders</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completedOrders}</p>
                      <p className="text-amber-600 text-sm mt-2 font-medium">Successfully delivered</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                    Sales Analytics
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 italic">Sales Chart Visualization Area</p>
                      <p className="text-xs text-gray-400 mt-2">(Interactive chart would be implemented here)</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Recent Orders
                  </h3>
                  {ordersLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No orders found</p>
                        <button
                          onClick={() => fetchOrders()}
                          className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 inline mr-2" />
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-medium text-gray-800">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerInfo?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{formatCurrency(order.pricing?.total || 0)}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Add Product', icon: Package2, color: 'from-blue-500 to-blue-600' },
                    { label: 'Manage Inventory', icon: Package, color: 'from-emerald-500 to-emerald-600' },
                    { label: 'View Reports', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
                    { label: 'Marketing', icon: Palette, color: 'from-pink-500 to-pink-600' }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-800 text-sm">{action.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalOrders}</p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pendingOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Completed Orders</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.completedOrders}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Search and Filter for Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order number, customer name, or email..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={orderFilterStatus}
                      onChange={(e) => {
                        setOrderFilterStatus(e.target.value);
                        fetchOrders(1, e.target.value);
                      }}
                      className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => fetchOrders()}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm hover:shadow-md"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {ordersLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No orders found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Debug Status: {debugInfo.ordersStatus || 'Orders not fetched yet'}
                    </p>
                    <button
                      onClick={() => fetchOrders()}
                      className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                              <div className="text-sm text-gray-500">{order.items?.length || 0} items</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{order.customerInfo?.name}</div>
                                  <div className="text-sm text-gray-500">{order.customerInfo?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {order.items?.slice(0, 2).map((item, index) => (
                                  <div key={index} className="truncate max-w-xs">
                                    {item.name} x{item.quantity}
                                  </div>
                                ))}
                                {order.items?.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{order.items.length - 2} more items
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="relative">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusUpdate(order.orderNumber, e.target.value)}
                                  disabled={updatingOrderId === order.orderNumber}
                                  className={`text-xs font-medium rounded-full px-3 py-1 border cursor-pointer transition-all hover:shadow-md ${getStatusColor(order.status)}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                {updatingOrderId === order.orderNumber && (
                                  <Loader2 className="w-4 h-4 animate-spin absolute right-2 top-1/2 transform -translate-y-1/2" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {formatCurrency(order.pricing?.total || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleViewOrder(order)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded-lg"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.orderNumber)}
                                  className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded-lg"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          Showing page {pagination.currentPage} of {pagination.totalPages}
                          ({pagination.totalOrders} total orders)
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fetchOrders(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => fetchOrders(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Users</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Admin Users</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.adminUsers}</p>
                    </div>
                    <Shield className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Verified Users</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.verifiedUsers}</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Unverified Users</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stats.unverifiedUsers}</p>
                    </div>
                    <UserX className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by username or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admin Only</option>
                      <option value="regular">Regular Users</option>
                      <option value="verified">Verified Only</option>
                      <option value="unverified">Unverified Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{user.username || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">ID: {user._id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{user.email || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${
                                user.isVerified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'
                              }`}>
                                {user.isVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                {user.isVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${
                                user.isAdmin ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}>
                                {user.isAdmin ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleAdminStatusToggle(user._id, user.isAdmin)}
                                disabled={updatingUserId === user._id || user._id === user?.id}
                                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md ${
                                  user.isAdmin
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 disabled:opacity-50'
                                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 disabled:opacity-50'
                                }`}
                              >
                                {updatingUserId === user._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : user.isAdmin ? (
                                  <>
                                    <UserX className="w-4 h-4 mr-2" />
                                    Remove Admin
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Make Admin
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredUsers.length === 0 && (
                      <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No users found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-amber-100">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-amber-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedOrder.customerInfo?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.customerInfo?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.customerInfo?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span>{selectedOrder.customerInfo?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    Order Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {selectedOrder.paymentMethod || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Order Items
                </h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Item</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Quantity</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.price || 0)}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency((item.price || 0) * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Pricing Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.pricing?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>{formatCurrency(selectedOrder.pricing?.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{formatCurrency(selectedOrder.pricing?.shipping || 0)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">{formatCurrency(selectedOrder.pricing?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm hover:shadow-md">
                  Print Order
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium shadow-sm hover:shadow-md">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAdminPanel;