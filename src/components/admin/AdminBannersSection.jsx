import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Upload,
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Grid,
  List,
  ToggleLeft,
  ToggleRight,
  MousePointer,
  BarChart3,
  Package2,
  Star,
  Monitor
} from 'lucide-react';

import BannerService from '@/services/bannerService';

const AdminBannersSection = () => {
  // State management
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, current: 1 });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  
  // Form states
  const [bannerForm, setBannerForm] = useState({
    type: 'hero',
    category: 'home',
    title: '',
    titleHighlight: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    backgroundColor: '#F2F2F2',
    textColor: '#FFFFFF',
    highlightColor: '#f6d110',
    position: 'left',
    isActive: true,
    order: 1,
    altText: '',
    backgroundImage: null,
    image: null,
    keepExistingImages: true
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [operationLoading, setOperationLoading] = useState(false);

  // Banner types and categories
  const bannerTypes = [
    { value: 'hero', label: 'Hero Banner' },
    { value: 'product_highlight', label: 'Product Highlight' },
    { value: 'collection_highlight', label: 'Collection Highlight' },
    { value: 'gift_highlight', label: 'Gift Highlight' }
  ];

  const categories = [
    { value: 'home', label: 'Home' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'gift', label: 'Gift' }
  ];

  const positions = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'center', label: 'Center' }
  ];

  // Fetch banners
  const fetchBanners = async (page = 1, resetPagination = false) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: 50,
        sort: sortBy,
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(filterType !== 'all' && { type: filterType }),
        ...(filterStatus !== 'all' && { isActive: filterStatus === 'active' })
      };

      console.log('Fetching banners with params:', params);
      
      const result = await BannerService.getAllBanners(params);
      console.log('Banners fetch result:', result);
      
      if (result.success) {
        setBanners(result.data || []);
        setPagination(result.pagination || { total: result.data?.length || 0, totalPages: 1, current: 1 });
        if (resetPagination) setCurrentPage(1);
        showMessage('success', `Loaded ${result.data?.length || 0} banners`);
      } else {
        setBanners([]);
        showMessage('error', result.message || 'Failed to fetch banners');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
      showMessage('error', 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setBannerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create banner
  const handleCreateBanner = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    
    try {
      const result = await BannerService.createBanner(bannerForm);
      
      if (result.success) {
        setShowCreateModal(false);
        resetForm();
        fetchBanners();
        showMessage('success', 'Banner created successfully!');
      } else {
        showMessage('error', result.message || 'Failed to create banner');
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      showMessage('error', 'Failed to create banner');
    } finally {
      setOperationLoading(false);
    }
  };

  // Update banner
  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (!selectedBanner) return;
    
    setOperationLoading(true);
    
    try {
      const result = await BannerService.updateBanner(selectedBanner._id, bannerForm);
      
      if (result.success) {
        setShowEditModal(false);
        setSelectedBanner(null);
        resetForm();
        fetchBanners();
        showMessage('success', 'Banner updated successfully!');
      } else {
        showMessage('error', result.message || 'Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      showMessage('error', 'Failed to update banner');
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete banner
  const handleDeleteBanner = async (bannerId, bannerTitle) => {
    if (!confirm(`Are you sure you want to delete "${bannerTitle}"? This action cannot be undone.`)) {
      return;
    }
    
    setOperationLoading(true);
    
    try {
      const result = await BannerService.deleteBanner(bannerId);
      
      if (result.success) {
        fetchBanners();
        showMessage('success', 'Banner deleted successfully!');
      } else {
        showMessage('error', result.message || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      showMessage('error', 'Failed to delete banner');
    } finally {
      setOperationLoading(false);
    }
  };

  // Toggle banner status
  const handleToggleStatus = async (bannerId) => {
    setOperationLoading(true);
    
    try {
      const result = await BannerService.toggleBannerStatus(bannerId);
      
      if (result.success) {
        fetchBanners();
        showMessage('success', result.message);
      } else {
        showMessage('error', result.message || 'Failed to toggle banner status');
      }
    } catch (error) {
      console.error('Error toggling banner status:', error);
      showMessage('error', 'Failed to toggle banner status');
    } finally {
      setOperationLoading(false);
    }
  };

  // Open edit modal
  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setBannerForm({
      type: banner.type || 'hero',
      category: banner.category || 'home',
      title: banner.title || '',
      titleHighlight: banner.titleHighlight || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      backgroundColor: banner.backgroundColor || '#F2F2F2',
      textColor: banner.textColor || '#FFFFFF',
      highlightColor: banner.highlightColor || '#f6d110',
      position: banner.position || 'left',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      order: banner.order || 1,
      altText: banner.altText || '',
      backgroundImage: null,
      image: null,
      keepExistingImages: true
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setBannerForm({
      type: 'hero',
      category: 'home',
      title: '',
      titleHighlight: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      backgroundColor: '#F2F2F2',
      textColor: '#FFFFFF',
      highlightColor: '#f6d110',
      position: 'left',
      isActive: true,
      order: 1,
      altText: '',
      backgroundImage: null,
      image: null,
      keepExistingImages: true
    });
  };

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = {
    total: banners.length,
    active: banners.filter(b => b.isActive).length,
    inactive: banners.filter(b => !b.isActive).length,
    hero: banners.filter(b => b.type === 'hero').length,
    highlights: banners.filter(b => b.type !== 'hero').length,
    totalClicks: banners.reduce((sum, b) => sum + (b.clickCount || 0), 0),
    totalImpressions: banners.reduce((sum, b) => sum + (b.impressionCount || 0), 0)
  };

  // Load initial data
  useEffect(() => {
    fetchBanners();
  }, [sortBy, filterCategory, filterType, filterStatus]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search is handled by filteredBanners
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Banner Card Component
  const BannerCard = ({ banner }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all border">
      <div className="relative mb-4">
        <div className="bg-white rounded-xl p-4 h-48 flex items-center justify-center overflow-hidden">
          {banner.backgroundImage || banner.image ? (
            <img
              src={banner.backgroundImage || banner.image}
              alt={banner.altText || banner.title}
              className="max-h-full max-w-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/images/default-banner.png';
              }}
            />
          ) : (
            <div 
              className="w-full h-full rounded-lg flex items-center justify-center"
              style={{ backgroundColor: banner.backgroundColor }}
            >
              <Monitor className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <button
            onClick={() => handleToggleStatus(banner._id)}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
              banner.isActive 
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {banner.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
            {banner.isActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full capitalize">
            {banner.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg truncate">{banner.title}</h3>
          <p className="text-sm text-gray-600 capitalize">{banner.category} • Order: {banner.order}</p>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{banner.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MousePointer className="w-3 h-3" />
              {banner.clickCount || 0} clicks
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {banner.impressionCount || 0} views
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => {
              setSelectedBanner(banner);
              setShowViewModal(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => handleEditBanner(banner)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteBanner(banner._id, banner.title)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Banner List Item Component
  const BannerListItem = ({ banner }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden">
            {banner.backgroundImage || banner.image ? (
              <img
                src={banner.backgroundImage || banner.image}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/default-banner.png';
                }}
              />
            ) : (
              <div 
                className="w-full h-full rounded-lg flex items-center justify-center"
                style={{ backgroundColor: banner.backgroundColor }}
              >
                <Monitor className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{banner.title}</h3>
              {banner.titleHighlight && (
                <p className="text-sm font-medium text-amber-600">{banner.titleHighlight}</p>
              )}
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{banner.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500 capitalize">{banner.category}</span>
                <span className="text-sm text-gray-500 capitalize">{banner.type.replace('_', ' ')}</span>
                <span className="text-sm text-gray-500">Order: {banner.order}</span>
                <span className="text-sm text-gray-500">{banner.clickCount || 0} clicks</span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleStatus(banner._id)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    banner.isActive 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {banner.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                  {banner.isActive ? 'Active' : 'Inactive'}
                </button>

                <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full text-center capitalize">
                  {banner.type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedBanner(banner);
                    setShowViewModal(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditBanner(banner)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner._id, banner.title)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${
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

      {/* Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Banners</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Monitor className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Hero Banners</p>
              <p className="text-2xl font-bold text-gray-800">{stats.hero}</p>
            </div>
            <Star className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Highlights</p>
              <p className="text-2xl font-bold text-gray-800">{stats.highlights}</p>
            </div>
            <Package2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Inactive</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClicks}</p>
            </div>
            <MousePointer className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Impressions</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalImpressions}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filters */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              {bannerTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
              <option value="order">Order Low-High</option>
              <option value="-order">Order High-Low</option>
              <option value="category">Category A-Z</option>
            </select>
          </div>

          <div className="flex gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => fetchBanners()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Banner
            </button>
          </div>
        </div>
      </div>

      {/* Banners Grid/List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading banners...</p>
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No banners found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or create a new banner</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Your First Banner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4 text-sm text-gray-600">
            Displaying {filteredBanners.length} of {banners.length} banners
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBanners.map((banner) => (
                <BannerCard key={banner._id} banner={banner} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBanners.map((banner) => (
                <BannerListItem key={banner._id} banner={banner} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.current} of {pagination.totalPages}
              ({pagination.total} total banners)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  fetchBanners(newPage);
                }}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      fetchBanners(page);
                    }}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      page === currentPage
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, pagination.totalPages);
                  setCurrentPage(newPage);
                  fetchBanners(newPage);
                }}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Banner Modal */}
      {showCreateModal && (
        <BannerModal
          title="Create New Banner"
          banner={bannerForm}
          onSubmit={handleCreateBanner}
          onChange={handleFormChange}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          loading={operationLoading}
          bannerTypes={bannerTypes}
          categories={categories}
          positions={positions}
          fetchBanners={fetchBanners}
        />
      )}

      {/* Edit Banner Modal */}
      {showEditModal && selectedBanner && (
        <BannerModal
          title="Edit Banner"
          banner={bannerForm}
          existingBanner={selectedBanner}
          onSubmit={handleUpdateBanner}
          onChange={handleFormChange}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBanner(null);
            resetForm();
          }}
          loading={operationLoading}
          bannerTypes={bannerTypes}
          categories={categories}
          positions={positions}
          isEdit={true}
          fetchBanners={fetchBanners}
        />
      )}

      {/* View Banner Modal */}
      {showViewModal && selectedBanner && (
        <BannerViewModal
          banner={selectedBanner}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBanner(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEditBanner(selectedBanner);
          }}
          onDelete={() => {
            setShowViewModal(false);
            handleDeleteBanner(selectedBanner._id, selectedBanner.title);
          }}
          onToggleStatus={() => handleToggleStatus(selectedBanner._id)}
        />
      )}
    </div>
  );
};

// Banner Modal Component
const BannerModal = ({ 
  title, 
  banner, 
  existingBanner = null,
  onSubmit, 
  onChange, 
  onClose, 
  loading, 
  bannerTypes, 
  categories, 
  positions,
  isEdit = false,
  fetchBanners
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'styling', label: 'Styling' },
    { id: 'media', label: 'Images' }
  ];

  const handleDeleteImage = async (type) => {
    if (!existingBanner) return;
    try {
      const result = await BannerService.deleteBannerImage(existingBanner._id, type);
      if (result.success) {
        fetchBanners();
        alert(`${type} image deleted successfully. Please reopen the modal to see changes.`);
      } else {
        alert(result.message || `Failed to delete ${type} image`);
      }
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error);
      alert(`Failed to delete ${type} image`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-amber-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-amber-500 text-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={onSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={banner.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter banner title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Highlight
                  </label>
                  <input
                    type="text"
                    value={banner.titleHighlight}
                    onChange={(e) => onChange('titleHighlight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter highlighted part of title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Type *
                  </label>
                  <select
                    required
                    value={banner.type}
                    onChange={(e) => onChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {bannerTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={banner.category}
                    onChange={(e) => onChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={banner.position}
                    onChange={(e) => onChange('position', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {positions.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={banner.order}
                    onChange={(e) => onChange('order', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter display order"
                  />
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={banner.isActive}
                    onChange={(e) => onChange('isActive', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(e) => onChange('subtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter banner subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={banner.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                    placeholder="Enter banner description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text *
                    </label>
                    <input
                      type="text"
                      required
                      value={banner.buttonText}
                      onChange={(e) => onChange('buttonText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter button text"
                    />
                  </div>

                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Button Link *
  </label>
  <input
    type="text"
    required
    value={banner.buttonLink}
    onChange={(e) => onChange('buttonLink', e.target.value)}
    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
    placeholder="Enter button link (e.g., https://... or /products)"
  />
</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={banner.altText}
                    onChange={(e) => onChange('altText', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter alt text for accessibility"
                  />
                </div>
              </div>
            )}

            {activeTab === 'styling' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={banner.backgroundColor}
                      onChange={(e) => onChange('backgroundColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-200"
                    />
                    <input
                      type="text"
                      value={banner.backgroundColor}
                      onChange={(e) => onChange('backgroundColor', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="#F2F2F2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={banner.textColor}
                      onChange={(e) => onChange('textColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-200"
                    />
                    <input
                      type="text"
                      value={banner.textColor}
                      onChange={(e) => onChange('textColor', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highlight Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={banner.highlightColor}
                      onChange={(e) => onChange('highlightColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-200"
                    />
                    <input
                      type="text"
                      value={banner.highlightColor}
                      onChange={(e) => onChange('highlightColor', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="#f6d110"
                    />
                  </div>
                </div>

                {/* Color Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div 
                    className="w-full h-24 rounded-xl border border-gray-200 p-4 flex items-center justify-center"
                    style={{ backgroundColor: banner.backgroundColor }}
                  >
                    <div className="text-center">
                      <h4 style={{ color: banner.textColor }} className="font-semibold">
                        {banner.title || 'Banner Title'}
                      </h4>
                      {banner.titleHighlight && (
                        <span 
                          style={{ color: banner.highlightColor }} 
                          className="font-bold"
                        >
                          {banner.titleHighlight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image (for Hero banners)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange('backgroundImage', e.target.files[0])}
                      className="hidden"
                      id="background-image-upload"
                    />
                    <label htmlFor="background-image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        Click to upload background image
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB (Recommended: 1920x1080px)
                      </p>
                    </label>
                  </div>
                  {isEdit && existingBanner?.backgroundImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Current Background Image
                      </label>
                      <div className="relative group w-full max-w-md">
                        <img
                          src={existingBanner.backgroundImage}
                          alt="Background"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-banner.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteImage('background')}
                            className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Collection Image (for Highlight banners)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange('image', e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        Click to upload product/collection image
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB (Recommended: 800x600px)
                      </p>
                    </label>
                  </div>
                  {isEdit && existingBanner?.image && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Current Product/Collection Image
                      </label>
                      <div className="relative group w-full max-w-md">
                        <img
                          src={existingBanner.image}
                          alt="Product/Collection"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-banner.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteImage('image')}
                            className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isEdit && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={banner.keepExistingImages}
                      onChange={(e) => onChange('keepExistingImages', e.target.checked)}
                      className="w-4 h-4"
                      id="keep-images"
                    />
                    <label htmlFor="keep-images" className="text-sm font-medium text-gray-700">
                      Keep existing images if no new images are uploaded
                    </label>
                  </div>
                )}

                {/* Image Guidelines */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Image Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Hero banners: Use background images (1920x1080px recommended)</li>
                    <li>• Highlight banners: Use product/collection images (800x600px recommended)</li>
                    <li>• Ensure good contrast with text colors</li>
                    <li>• Use high-quality, optimized images</li>
                    <li>• Consider mobile responsiveness</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Banner' : 'Create Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Banner View Modal Component
const BannerViewModal = ({ banner, onClose, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{banner.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-amber-800 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Banner Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Banner Preview</h3>
            <div 
              className="rounded-xl p-8 min-h-[200px] flex items-center justify-center"
              style={{ backgroundColor: banner.backgroundColor }}
            >
              <div className={`text-${banner.position} max-w-md`}>
                <h2 style={{ color: banner.textColor }} className="text-3xl font-bold mb-2">
                  {banner.title}
                  {banner.titleHighlight && (
                    <span style={{ color: banner.highlightColor }} className="ml-2">
                      {banner.titleHighlight}
                    </span>
                  )}
                </h2>
                {banner.subtitle && (
                  <p style={{ color: banner.textColor }} className="text-lg mb-4 opacity-90">
                    {banner.subtitle}
                  </p>
                )}
                <p style={{ color: banner.textColor }} className="mb-6 opacity-80">
                  {banner.description}
                </p>
                <button 
                  className="px-6 py-3 bg-white text-gray-800 rounded-lg font-medium hover:shadow-lg transition-all"
                  style={{ color: '#374151' }}
                >
                  {banner.buttonText}
                </button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{banner.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium capitalize">{banner.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium capitalize">{banner.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Display Order</p>
                <p className="font-medium">{banner.order}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  banner.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Details</h3>
            <div className="space-y-4">
              {banner.subtitle && (
                <div>
                  <p className="text-sm text-gray-600">Subtitle</p>
                  <p className="font-medium">{banner.subtitle}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-700 leading-relaxed">{banner.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Button Text</p>
                  <p className="font-medium">{banner.buttonText}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Button Link</p>
                  <a 
                    href={banner.buttonLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800 break-all"
                  >
                    {banner.buttonLink}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Styling Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Styling</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-2">Background Color</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: banner.backgroundColor }}
                  />
                  <span className="text-sm font-mono">{banner.backgroundColor}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-2">Text Color</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: banner.textColor }}
                  />
                  <span className="text-sm font-mono">{banner.textColor}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-2">Highlight Color</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: banner.highlightColor }}
                  />
                  <span className="text-sm font-mono">{banner.highlightColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          {(banner.backgroundImage || banner.image) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banner.backgroundImage && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Background Image</h4>
                    <img
                      src={banner.backgroundImage}
                      alt={banner.altText || "Background"}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/images/default-banner.png';
                      }}
                    />
                  </div>
                )}
                {banner.image && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Product/Collection Image</h4>
                    <img
                      src={banner.image}
                      alt={banner.altText || "Product/Collection"}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/images/default-banner.png';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-800">Total Clicks</h4>
                <p className="text-2xl font-bold text-blue-700">{banner.clickCount || 0}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <h4 className="font-medium text-emerald-800">Total Impressions</h4>
                <p className="text-2xl font-bold text-emerald-700">{banner.impressionCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Banner Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-600">Created</h4>
                <p className="text-gray-800">{new Date(banner.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Updated</h4>
                <p className="text-gray-800">{new Date(banner.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Alt Text</h4>
                <p className="text-gray-800">{banner.altText || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">ID</h4>
                <p className="text-gray-800 font-mono text-xs truncate">{banner._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={onToggleStatus}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              banner.isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            {banner.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Edit className="w-5 h-5 inline mr-2" />
            Edit Banner
          </button>
          <button
            onClick={onDelete}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-5 h-5 inline mr-2" />
            Delete Banner
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBannersSection;