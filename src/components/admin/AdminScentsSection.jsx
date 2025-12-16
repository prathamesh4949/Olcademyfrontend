import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit, Trash2, Eye, Search, Upload, X, Save, Loader2, AlertCircle, CheckCircle, Image as ImageIcon, DollarSign, Package, RefreshCw, Grid, List, ToggleLeft, ToggleRight, Zap, Heart, Sparkles } from 'lucide-react';
import ScentService from '@/services/scentService';

const AdminScentsSection = () => {
  // State management
  const [scents, setScents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCollection, setFilterCollection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, current: 1 });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedScent, setSelectedScent] = useState(null);

  // Form states
  const [scentForm, setScentForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'women',
    collection: 'trending',
    featured: false,
    isFeatured: false,
    isActive: true,
    isNew: false,
    brand: '',
    stock: '',
    sku: '',
    rating: '',
    reviewCount: '',
    tags: [],
    images: null,
    hoverImage: null,
    sizes: [{ size: '50ml', price: '', available: true, stock: '' }],
    fragrance_notes: { top: [], middle: [], base: [] },
    scentFamily: 'floral',
    intensity: 'moderate',
    longevity: '4-6 hours',
    sillage: 'moderate',
    season: [],
    occasion: [],
    personalization: { available: false, max_characters: 15, price: 0 },
    ingredients: [],
    volume: '',
    concentration: 'eau de parfum',
    inStock: true,
    salePercentage: 0,
    keepExistingImages: true
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [operationLoading, setOperationLoading] = useState(false);

  // Categories and collections
  const categories = [
    { value: 'women', label: 'Women' },
    { value: 'men', label: 'Men' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'home', label: 'Home' },
    { value: 'gift', label: 'Gift' }
  ];

  const collections = {
    home: ['trending', 'best-seller'],
    men: ['mens-signature', 'orange-marmalade'],
    women: ['rose-garden-essence', 'signature'],
    unisex: ['gender-free', 'limitless'],
    summer: ['trending', 'best-seller'],
    gift: ['perfect-discover-gifts', 'perfect-gifts-premium', 'perfect-gifts-luxury', 'home-decor-gifts']
  };

  const allCollections = [
    'trending',
    'best-seller',
    'signature',
    'limited-edition',
    'mens-signature',
    'orange-marmalade',
    'rose-garden-essence',
    'gender-free',
    'limitless',
    'perfect-discover-gifts',
    'perfect-gifts-premium',
    'perfect-gifts-luxury',
    'home-decor-gifts'
  ];

  const scentFamilies = ['floral', 'woody', 'citrus', 'oriental', 'fresh', 'spicy', 'fruity'];
  const intensities = ['light', 'moderate', 'strong'];
  const longevities = ['2-4 hours', '4-6 hours', '6-8 hours', '8+ hours'];
  const sillages = ['intimate', 'moderate', 'strong', 'enormous'];
  const concentrations = ['parfum', 'eau de parfum', 'eau de toilette', 'eau de cologne', 'eau fraiche'];
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const occasions = ['casual', 'formal', 'romantic', 'office', 'party', 'evening'];

  // Get filtered collections based on category
  const getFilteredCollections = (category) => {
    if (category === 'all') return allCollections;
    return collections[category] || [];
  };

  // Fetch scents
  const fetchScents = async (page = 1, resetPagination = false) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 1000,
        sortBy: sortBy.replace('-', ''),
        sortOrder: sortBy.startsWith('-') ? 'desc' : 'asc',
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(filterCollection !== 'all' && { collection: filterCollection }),
        ...(filterStatus !== 'all' && { isActive: filterStatus === 'active' })
      };

      const result = await ScentService.getAllScents(params);

      if (result.success) {
        setScents(result.data || []);
        setPagination(result.pagination || { total: result.data?.length || 0, totalPages: 1, current: 1 });
        if (resetPagination) setCurrentPage(1);
        showMessage('success', `Loaded ${result.data?.length || 0} scents`);
      } else {
        setScents([]);
        showMessage('error', result.message || 'Failed to fetch scents');
      }
    } catch (error) {
      console.error('Error fetching scents:', error);
      setScents([]);
      showMessage('error', 'Failed to fetch scents');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleFormChange = (field, value) => {
    setScentForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // If category changes, reset collection to first available for that category
      if (field === 'category') {
        const availableCollections = getFilteredCollections(value);
        updated.collection = availableCollections[0] || '';
      }
      
      return updated;
    });
  };

  const handlePersonalizationChange = (subField, value) => {
    setScentForm(prev => ({ ...prev, personalization: { ...prev.personalization, [subField]: value } }));
  };

  const handleArrayChange = (field, value) => {
    setScentForm(prev => ({ ...prev, [field]: Array.isArray(value) ? value : value.split(',').map(item => item.trim()).filter(item => item) }));
  };

  const handleSizesChange = (index, field, value) => {
    setScentForm(prev => ({ ...prev, sizes: prev.sizes.map((size, i) => i === index ? { ...size, [field]: value } : size ) }));
  };

  const addSize = () => {
    setScentForm(prev => ({ ...prev, sizes: [...prev.sizes, { size: '', price: '', available: true, stock: '' }] }));
  };

  const removeSize = (index) => {
    setScentForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const handleFragranceNotesChange = (type, value) => {
    setScentForm(prev => ({ ...prev, fragrance_notes: { ...prev.fragrance_notes, [type]: Array.isArray(value) ? value : value.split(',').map(item => item.trim()).filter(item => item) } }));
  };

  const handleCreateScent = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    try {
      const result = await ScentService.createScent(scentForm);
      if (result.success) {
        setShowCreateModal(false);
        resetForm();
        fetchScents();
        showMessage('success', 'Scent created successfully!');
      } else {
        showMessage('error', result.message || 'Failed to create scent');
      }
    } catch (error) {
      console.error('Error creating scent:', error);
      showMessage('error', 'Failed to create scent');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateScent = async (e) => {
    e.preventDefault();
    if (!selectedScent) return;
    setOperationLoading(true);
    try {
      const result = await ScentService.updateScent(selectedScent._id, scentForm);
      if (result.success) {
        setShowEditModal(false);
        setSelectedScent(null);
        resetForm();
        fetchScents();
        showMessage('success', 'Scent updated successfully!');
      } else {
        showMessage('error', result.message || 'Failed to update scent');
      }
    } catch (error) {
      console.error('Error updating scent:', error);
      showMessage('error', 'Failed to update scent');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteScent = async (scentId, scentName) => {
    if (!confirm(`Are you sure you want to delete "${scentName}"? This action cannot be undone.`)) {
      return;
    }
    setOperationLoading(true);
    try {
      const result = await ScentService.deleteScent(scentId);
      if (result.success) {
        fetchScents();
        showMessage('success', 'Scent deleted successfully!');
      } else {
        showMessage('error', result.message || 'Failed to delete scent');
      }
    } catch (error) {
      console.error('Error deleting scent:', error);
      showMessage('error', 'Failed to delete scent');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleToggleStatus = async (scentId) => {
    setOperationLoading(true);
    try {
      const result = await ScentService.deactivateScent(scentId);
      if (result.success) {
        fetchScents();
        showMessage('success', result.message || 'Scent status updated');
      } else {
        showMessage('error', result.message || 'Failed to toggle scent status');
      }
    } catch (error) {
      console.error('Error toggling scent status:', error);
      showMessage('error', 'Failed to toggle scent status');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditScent = (scent) => {
    setSelectedScent(scent);
    setScentForm({
      name: scent.name || '',
      description: scent.description || '',
      price: scent.price || '',
      originalPrice: scent.originalPrice || '',
      category: scent.category || 'women',
      collection: scent.collection || 'trending',
      featured: scent.featured || false,
      isFeatured: scent.isFeatured || false,
      isActive: scent.isActive || true,
      isNew: scent.isNew || false,
      brand: scent.brand || '',
      stock: scent.stock || '',
      sku: scent.sku || '',
      rating: scent.rating || '',
      reviewCount: scent.reviewCount || '',
      tags: scent.tags || [],
      images: null,
      hoverImage: null,
      sizes: scent.sizes || [{ size: '50ml', price: '', available: true, stock: '' }],
      fragrance_notes: scent.fragrance_notes || { top: [], middle: [], base: [] },
      scentFamily: scent.scentFamily || 'floral',
      intensity: scent.intensity || 'moderate',
      longevity: scent.longevity || '4-6 hours',
      sillage: scent.sillage || 'moderate',
      season: scent.season || [],
      occasion: scent.occasion || [],
      personalization: scent.personalization || { available: false, max_characters: 15, price: 0 },
      ingredients: scent.ingredients || [],
      volume: scent.volume || '',
      concentration: scent.concentration || 'eau de parfum',
      inStock: scent.inStock || true,
      salePercentage: scent.salePercentage || 0,
      keepExistingImages: true
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setScentForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'women',
      collection: 'trending',
      featured: false,
      isFeatured: false,
      isActive: true,
      isNew: false,
      brand: '',
      stock: '',
      sku: '',
      rating: '',
      reviewCount: '',
      tags: [],
      images: null,
      hoverImage: null,
      sizes: [{ size: '50ml', price: '', available: true, stock: '' }],
      fragrance_notes: { top: [], middle: [], base: [] },
      scentFamily: 'floral',
      intensity: 'moderate',
      longevity: '4-6 hours',
      sillage: 'moderate',
      season: [],
      occasion: [],
      personalization: { available: false, max_characters: 15, price: 0 },
      ingredients: [],
      volume: '',
      concentration: 'eau de parfum',
      inStock: true,
      salePercentage: 0,
      keepExistingImages: true
    });
  };

  const filteredScents = scents.filter(scent => {
    const matchesSearch = scent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scent.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scent.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: scents.length,
    active: scents.filter(s => s.isActive).length,
    inactive: scents.filter(s => !s.isActive).length,
    featured: scents.filter(s => s.featured || s.isFeatured).length,
    lowStock: scents.filter(s => s.stock < 10).length,
    totalValue: scents.reduce((sum, s) => sum + (s.price * s.stock || 0), 0)
  };

  useEffect(() => {
    fetchScents();
  }, [sortBy, filterCategory, filterCollection, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        // Filter locally
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle filter category change
  const handleFilterCategoryChange = (category) => {
    setFilterCategory(category);
    // Reset collection filter when category changes
    if (category !== 'all') {
      const availableCollections = getFilteredCollections(category);
      if (!availableCollections.includes(filterCollection)) {
        setFilterCollection('all');
      }
    }
  };

  const ScentCard = ({ scent }) => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-lg transition-all border">
      <div className="relative mb-4">
        <div className="bg-white rounded-xl p-4 h-48 flex items-center justify-center">
          {scent.images && scent.images.length > 0 ? (
            <img src={scent.images[0]} alt={scent.name} className="max-h-full max-w-full object-contain" onError={(e) => { e.target.src = '/images/default-perfume.png'; }} />
          ) : (
            <Sparkles className="w-16 h-16 text-purple-300" />
          )}
        </div>
        <div className="absolute top-2 left-2">
          <button
            onClick={() => handleToggleStatus(scent._id)}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
              scent.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {scent.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
            {scent.isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
        {(scent.featured || scent.isFeatured) && (
          <div className="absolute top-2 right-2">
            <span className="bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium rounded-full">
              <Star className="w-3 h-3 inline mr-1" /> Featured
            </span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg truncate">{scent.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{scent.category} • {scent.collection}</p>
          <p className="text-sm text-purple-600 capitalize">{scent.scentFamily} • {scent.intensity}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-purple-600">${scent.price}</p>
            <p className="text-sm text-gray-500">Stock: {scent.stock}</p>
          </div>
          {scent.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{scent.rating}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => { setSelectedScent(scent); setShowViewModal(true); }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" /> View
          </button>
          <button
            onClick={() => handleEditScent(scent)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => handleDeleteScent(scent._id, scent.name)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ScentListItem = ({ scent }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
            {scent.images && scent.images.length > 0 ? (
              <img src={scent.images[0]} alt={scent.name} className="w-full h-full object-contain rounded-lg" onError={(e) => { e.target.src = '/images/default-perfume.png'; }} />
            ) : (
              <Sparkles className="w-8 h-8 text-purple-300" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{scent.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{scent.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500 capitalize">{scent.category}</span>
                <span className="text-sm text-gray-500 capitalize">{scent.collection}</span>
                <span className="text-sm text-purple-500 capitalize">{scent.scentFamily}</span>
                <span className="text-sm text-gray-500">Stock: {scent.stock}</span>
                {scent.brand && (
                  <span className="text-sm text-gray-500">{scent.brand}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">${scent.price}</p>
                {scent.rating && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{scent.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleStatus(scent._id)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    scent.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {scent.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                  {scent.isActive ? 'Active' : 'Inactive'}
                </button>
                {(scent.featured || scent.isFeatured) && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium rounded-full text-center">
                    <Star className="w-3 h-3 inline mr-1" /> Featured
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setSelectedScent(scent); setShowViewModal(true); }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => handleEditScent(scent)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteScent(scent._id, scent.name)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
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
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Scents</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Sparkles className="w-8 h-8 text-purple-500" />
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
              <p className="text-sm text-gray-600 font-medium">Featured</p>
              <p className="text-2xl font-bold text-gray-800">{stats.featured}</p>
            </div>
            <Star className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-gray-800">{stats.lowStock}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Inactive</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
            </div>
            <Package className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Value</p>
              <p className="text-xl font-bold text-gray-800">${stats.totalValue.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search scents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => handleFilterCategoryChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Collections</option>
              {getFilteredCollections(filterCategory).map(col => (
                <option key={col} value={col}>{col.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="price">Price Low-High</option>
              <option value="-price">Price High-Low</option>
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => fetchScents()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" /> Add Scent
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading scents...</p>
        </div>
      ) : filteredScents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No scents found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or create a new scent</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" /> Add Your First Scent
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4 text-sm text-gray-600">
            Displaying {filteredScents.length} of {scents.length} scents
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredScents.map((scent) => (
                <ScentCard key={scent._id} scent={scent} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredScents.map((scent) => (
                <ScentListItem key={scent._id} scent={scent} />
              ))}
            </div>
          )}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.current} of {pagination.totalPages} ({pagination.total} total scents)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  fetchScents(newPage);
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
                      fetchScents(page);
                    }}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      page === currentPage ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-300 hover:bg-gray-50'
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
                  fetchScents(newPage);
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

      {showCreateModal && (
        <ScentModal
          title="Create New Scent"
          scent={scentForm}
          onSubmit={handleCreateScent}
          onChange={handleFormChange}
          onPersonalizationChange={handlePersonalizationChange}
          onArrayChange={handleArrayChange}
          onSizesChange={handleSizesChange}
          onFragranceNotesChange={handleFragranceNotesChange}
          onClose={() => { setShowCreateModal(false); resetForm(); }}
          loading={operationLoading}
          categories={categories}
          collections={collections}
          allCollections={allCollections}
          scentFamilies={scentFamilies}
          intensities={intensities}
          longevities={longevities}
          sillages={sillages}
          concentrations={concentrations}
          seasons={seasons}
          occasions={occasions}
          addSize={addSize}
          removeSize={removeSize}
          fetchScents={fetchScents}
          getFilteredCollections={getFilteredCollections}
        />
      )}

      {showEditModal && selectedScent && (
        <ScentModal
          title="Edit Scent"
          scent={scentForm}
          existingScent={selectedScent}
          onSubmit={handleUpdateScent}
          onChange={handleFormChange}
          onPersonalizationChange={handlePersonalizationChange}
          onArrayChange={handleArrayChange}
          onSizesChange={handleSizesChange}
          onFragranceNotesChange={handleFragranceNotesChange}
          onClose={() => { setShowEditModal(false); setSelectedScent(null); resetForm(); }}
          loading={operationLoading}
          categories={categories}
          collections={collections}
          allCollections={allCollections}
          scentFamilies={scentFamilies}
          intensities={intensities}
          longevities={longevities}
          sillages={sillages}
          concentrations={concentrations}
          seasons={seasons}
          occasions={occasions}
          addSize={addSize}
          removeSize={removeSize}
          isEdit={true}
          fetchScents={fetchScents}
          getFilteredCollections={getFilteredCollections}
        />
      )}

      {showViewModal && selectedScent && (
        <ScentViewModal
          scent={selectedScent}
          onClose={() => { setShowViewModal(false); setSelectedScent(null); }}
          onEdit={() => { setShowViewModal(false); handleEditScent(selectedScent); }}
          onDelete={() => { setShowViewModal(false); handleDeleteScent(selectedScent._id, selectedScent.name); }}
          onToggleStatus={() => handleToggleStatus(selectedScent._id)}
        />
      )}
    </div>
  );
};

const ScentModal = ({ title, scent, existingScent = null, onSubmit, onChange, onPersonalizationChange, onArrayChange, onSizesChange, onFragranceNotesChange, onClose, loading, categories, collections, allCollections, scentFamilies, intensities, longevities, sillages, concentrations, seasons, occasions, addSize, removeSize, isEdit = false, fetchScents, getFilteredCollections }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [deletedImageIndices, setDeletedImageIndices] = useState(new Set());
  const [deletedHover, setDeletedHover] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [hoverPreview, setHoverPreview] = useState(null);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing & Stock' },
    { id: 'details', label: 'Scent Details' },
    { id: 'fragrance', label: 'Fragrance Notes' },
    { id: 'media', label: 'Images' }
  ];

  const handleDeleteImage = (index) => {
    setDeletedImageIndices(prev => new Set([...prev, index]));
  };

  const handleDeleteHoverImage = () => {
    setDeletedHover(true);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Store the FileList object
      onChange('images', files);
      
      // Create previews for new images
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const handleHoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange('hoverImage', file);
      setHoverPreview(URL.createObjectURL(file));
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      if (hoverPreview) URL.revokeObjectURL(hoverPreview);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-purple-800 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!isEdit) {
            onSubmit(e);
            return;
          }

          try {
            // Delete marked images first
            for (const index of deletedImageIndices) {
              await ScentService.deleteScentImage(existingScent._id, index);
            }

            if (deletedHover) {
              await ScentService.deleteScentHoverImage(existingScent._id);
            }

            onSubmit(e);
          } catch (error) {
            console.error('Failed to delete images:', error);
            alert('Failed to delete images. Proceeding with update anyway.');
            onSubmit(e);
          }
        }} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scent Name *</label>
                  <input
                    type="text"
                    required
                    value={scent.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter scent name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                  <input
                    type="text"
                    required
                    value={scent.sku}
                    onChange={(e) => onChange('sku', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter unique SKU"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={scent.brand}
                    onChange={(e) => onChange('brand', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={scent.category}
                    onChange={(e) => onChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collection *</label>
                  <select
                    required
                    value={scent.collection}
                    onChange={(e) => onChange('collection', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {getFilteredCollections(scent.category).map(col => (
                      <option key={col} value={col}>{col.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scent Family</label>
                  <select
                    value={scent.scentFamily}
                    onChange={(e) => onChange('scentFamily', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {scentFamilies.map(family => (
                      <option key={family} value={family}>{family.charAt(0).toUpperCase() + family.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-6 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={scent.featured} onChange={(e) => onChange('featured', e.target.checked)} className="w-4 h-4" />
                    <label className="text-sm font-medium text-gray-700">Featured</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={scent.isFeatured} onChange={(e) => onChange('isFeatured', e.target.checked)} className="w-4 h-4" />
                    <label className="text-sm font-medium text-gray-700">Is Featured</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={scent.isActive} onChange={(e) => onChange('isActive', e.target.checked)} className="w-4 h-4" />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={scent.isNew} onChange={(e) => onChange('isNew', e.target.checked)} className="w-4 h-4" />
                    <label className="text-sm font-medium text-gray-700">New</label>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'pricing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Price *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={scent.price}
                    onChange={(e) => onChange('price', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter base price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={scent.originalPrice}
                    onChange={(e) => onChange('originalPrice', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter original price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={scent.stock}
                    onChange={(e) => onChange('stock', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter base stock"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scent.salePercentage}
                    onChange={(e) => onChange('salePercentage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter sale percentage"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                  {scent.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => onSizesChange(index, 'size', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="Size (e.g., 50ml)"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={size.price}
                        onChange={(e) => onSizesChange(index, 'price', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="Price"
                      />
                      <input
                        type="number"
                        min="0"
                        value={size.stock}
                        onChange={(e) => onSizesChange(index, 'stock', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="Stock"
                      />
                      <select
                        value={size.available ? 'true' : 'false'}
                        onChange={(e) => onSizesChange(index, 'available', e.target.value === 'true')}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                      <button type="button" onClick={() => removeSize(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSize} className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                    Add Size
                  </button>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={scent.personalization.available} onChange={(e) => onPersonalizationChange('available', e.target.checked)} className="w-4 h-4" />
                    <label className="text-sm font-medium text-gray-700">Personalization Available</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Characters</label>
                    <input
                      type="number"
                      min="0"
                      value={scent.personalization.max_characters}
                      onChange={(e) => onPersonalizationChange('max_characters', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Enter max characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personalization Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={scent.personalization.price}
                      onChange={(e) => onPersonalizationChange('price', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Enter personalization price"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows={6}
                    value={scent.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    placeholder="Enter scent description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                  <select
                    value={scent.intensity}
                    onChange={(e) => onChange('intensity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {intensities.map(intensity => (
                      <option key={intensity} value={intensity}>{intensity.charAt(0).toUpperCase() + intensity.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longevity</label>
                  <select
                    value={scent.longevity}
                    onChange={(e) => onChange('longevity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {longevities.map(longevity => (
                      <option key={longevity} value={longevity}>{longevity}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sillage</label>
                  <select
                    value={scent.sillage}
                    onChange={(e) => onChange('sillage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {sillages.map(sillage => (
                      <option key={sillage} value={sillage}>{sillage.charAt(0).toUpperCase() + sillage.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Concentration</label>
                  <select
                    value={scent.concentration}
                    onChange={(e) => onChange('concentration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {concentrations.map(concentration => (
                      <option key={concentration} value={concentration}>{concentration.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                  <input
                    type="text"
                    value={scent.volume}
                    onChange={(e) => onChange('volume', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter volume (e.g., 100ml)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={scent.rating}
                    onChange={(e) => onChange('rating', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter rating (0-5)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Count</label>
                  <input
                    type="number"
                    min="0"
                    value={scent.reviewCount}
                    onChange={(e) => onChange('reviewCount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter review count"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={scent.tags.join(', ')}
                    onChange={(e) => onArrayChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seasons</label>
                  <select
                    multiple
                    value={scent.season}
                    onChange={(e) => onArrayChange('season', Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {seasons.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasions</label>
                  <select
                    multiple
                    value={scent.occasion}
                    onChange={(e) => onArrayChange('occasion', Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {occasions.map(o => (
                      <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                  <textarea
                    rows={4}
                    value={scent.ingredients.join(', ')}
                    onChange={(e) => onArrayChange('ingredients', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    placeholder="Enter ingredients separated by commas"
                  />
                </div>
              </div>
            )}
            {activeTab === 'fragrance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Top Notes</label>
                  <input
                    type="text"
                    value={Array.isArray(scent.fragrance_notes.top) ? scent.fragrance_notes.top.join(', ') : ''}
                    onChange={(e) => onFragranceNotesChange('top', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter top notes separated by commas (e.g., Bergamot, Lemon, Orange)"
                  />
                  <p className="text-sm text-gray-500 mt-1">The initial scent that hits first</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Notes (Heart)</label>
                  <input
                    type="text"
                    value={Array.isArray(scent.fragrance_notes.middle) ? scent.fragrance_notes.middle.join(', ') : ''}
                    onChange={(e) => onFragranceNotesChange('middle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter heart notes separated by commas (e.g., Rose, Jasmine, Lavender)"
                  />
                  <p className="text-sm text-gray-500 mt-1">The core of the fragrance</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Notes</label>
                  <input
                    type="text"
                    value={Array.isArray(scent.fragrance_notes.base) ? scent.fragrance_notes.base.join(', ') : ''}
                    onChange={(e) => onFragranceNotesChange('base', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter base notes separated by commas (e.g., Sandalwood, Vanilla, Musk)"
                  />
                  <p className="text-sm text-gray-500 mt-1">The lasting foundation of the scent</p>
                </div>
                <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="font-semibold text-gray-800 mb-4 text-center">Fragrance Pyramid Preview</h4>
                  <div className="space-y-3">
                    <div className="bg-purple-100 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-purple-800 mb-1">Top Notes</div>
                      <div className="text-xs text-purple-600">
                        {scent.fragrance_notes.top?.length > 0 ? scent.fragrance_notes.top.join(' • ') : 'Not specified'}
                      </div>
                    </div>
                    <div className="bg-pink-100 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-pink-800 mb-1">Heart Notes</div>
                      <div className="text-xs text-pink-600">
                        {scent.fragrance_notes.middle?.length > 0 ? scent.fragrance_notes.middle.join(' • ') : 'Not specified'}
                      </div>
                    </div>
                    <div className="bg-indigo-100 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-indigo-800 mb-1">Base Notes</div>
                      <div className="text-xs text-indigo-600">
                        {scent.fragrance_notes.base?.length > 0 ? scent.fragrance_notes.base.join(' • ') : 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scent Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="images-upload" />
                    <label htmlFor="images-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each (Max 5 images)</p>
                    </label>
                  </div>
                  {isEdit && (
                    <div className="flex items-center gap-2 mt-4">
                      <input type="checkbox" checked={scent.keepExistingImages} onChange={(e) => onChange('keepExistingImages', e.target.checked)} className="w-4 h-4" id="keep-images" />
                      <label htmlFor="keep-images" className="text-sm font-medium text-gray-700">Append new images to existing ones (uncheck to replace)</label>
                    </div>
                  )}
                </div>
                {isEdit && scent.keepExistingImages && existingScent && existingScent.images && existingScent.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Current Images</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingScent.images.map((image, index) => {
                        if (deletedImageIndices.has(index)) return null;
                        return (
                          <div key={index} className="relative group">
                            <img src={image} alt={`Scent image ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" onError={(e) => { e.target.src = '/images/default-perfume.png'; }} />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                              <button type="button" onClick={() => handleDeleteImage(index)} className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm text-purple-600 mt-2">💡 Tip: Click the trash icon to mark images for deletion</p>
                  </div>
                )}
                {imagePreviews.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {scent.keepExistingImages ? 'New Images to Add' : 'New Images (Will Replace All)'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img src={preview} alt={`New image ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">New</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hover Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                    <input type="file" accept="image/*" onChange={handleHoverImageChange} className="hidden" id="hover-image-upload" />
                    <label htmlFor="hover-image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">Click to upload hover image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB (Single image, different from main image)</p>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">This image will be shown on hover in scent cards (optional)</p>
                </div>
                {isEdit && existingScent && existingScent.hoverImage && !deletedHover && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Current Hover Image</label>
                    <div className="relative group w-48">
                      <img src={existingScent.hoverImage} alt="Hover image" className="w-full h-32 object-cover rounded-lg border border-gray-200" onError={(e) => { e.target.src = '/images/default-perfume.png'; }} />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                        <button type="button" onClick={handleDeleteHoverImage} className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-purple-600 mt-2">💡 Tip: Click the trash icon to mark for deletion</p>
                  </div>
                )}
                {hoverPreview && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      New Hover Image {existingScent?.hoverImage && !deletedHover ? '(Will Replace)' : ''}
                    </label>
                    <div className="relative w-48">
                      <img src={hoverPreview} alt="New hover image" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">New</div>
                    </div>
                  </div>
                )}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Image Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use high-quality images (minimum 800x800 pixels)</li>
                    <li>• First image will be used as the main scent image</li>
                    <li>• Show scent bottle from different angles</li>
                    <li>• Use clean, professional backgrounds</li>
                    <li>• Ensure good lighting and sharp focus</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Scent' : 'Create Scent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ScentViewModal = ({ scent, onClose, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{scent.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-purple-800 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium capitalize">{scent.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Collection</p>
                <p className="font-medium capitalize">{scent.collection}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand</p>
                <p className="font-medium">{scent.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scent Family</p>
                <p className="font-medium capitalize">{scent.scentFamily || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-medium">{scent.rating || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Intensity</p>
                <p className="font-medium capitalize">{scent.intensity || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{scent.description || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-medium text-purple-800">Base Price</h4>
                <p className="text-purple-700">${scent.price}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-medium text-green-800">Stock</h4>
                <p className="text-green-700">{scent.stock}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-800">Featured</h4>
                <p className="text-blue-700">{(scent.featured || scent.isFeatured) ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <h4 className="font-medium text-amber-800">Sale %</h4>
                <p className="text-amber-700">{scent.salePercentage || 0}%</p>
              </div>
            </div>
          </div>

          {scent.sizes && scent.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scent.sizes.map((size, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium">{size.size}</h4>
                    <p>Price: ${size.price}</p>
                    <p>Stock: {size.stock}</p>
                    <p>Available: {size.available ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scent.fragrance_notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fragrance Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Top Notes</h4>
                  <p className="text-purple-700">{scent.fragrance_notes.top?.join(', ') || 'N/A'}</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4">
                  <h4 className="font-medium text-pink-800">Middle Notes</h4>
                  <p className="text-pink-700">{scent.fragrance_notes.middle?.join(', ') || 'N/A'}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <h4 className="font-medium text-indigo-800">Base Notes</h4>
                  <p className="text-indigo-700">{scent.fragrance_notes.base?.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Scent Characteristics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 rounded-xl p-4">
                <h4 className="font-medium text-yellow-800">Longevity</h4>
                <p className="text-yellow-700">{scent.longevity || 'N/A'}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-medium text-green-800">Sillage</h4>
                <p className="text-green-700 capitalize">{scent.sillage || 'N/A'}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-800">Concentration</h4>
                <p className="text-blue-700 uppercase">{scent.concentration || 'N/A'}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-medium text-red-800">Volume</h4>
                <p className="text-red-700">{scent.volume || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Seasons</h4>
              <div className="flex flex-wrap gap-2">
                {scent.season?.map((season, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize">
                    {season}
                  </span>
                ))}
                {(!scent.season || scent.season.length === 0) && (
                  <span className="text-gray-500 text-sm">No seasons specified</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Occasions</h4>
              <div className="flex flex-wrap gap-2">
                {scent.occasion?.map((occasion, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                    {occasion}
                  </span>
                ))}
                {(!scent.occasion || scent.occasion.length === 0) && (
                  <span className="text-gray-500 text-sm">No occasions specified</span>
                )}
              </div>
            </div>
          </div>

          {scent.personalization && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalization</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Available</h4>
                  <p className="text-purple-700">{scent.personalization.available ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Max Characters</h4>
                  <p className="text-purple-700">{scent.personalization.max_characters}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Additional Price</h4>
                  <p className="text-purple-700">${scent.personalization.price}</p>
                </div>
              </div>
            </div>
          )}

          {scent.ingredients && scent.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{scent.ingredients.join(', ')}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Scent Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-600">SKU</h4>
                <p className="text-gray-800 font-mono">{scent.sku || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Created</h4>
                <p className="text-gray-800">{new Date(scent.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Updated</h4>
                <p className="text-gray-800">{new Date(scent.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">ID</h4>
                <p className="text-gray-800 font-mono text-xs truncate">{scent._id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
            Close
          </button>
          <button
            onClick={onToggleStatus}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              scent.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            {scent.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Edit className="w-5 h-5 inline mr-2" /> Edit Scent
          </button>
          <button
            onClick={onDelete}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-5 h-5 inline mr-2" /> Delete Scent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminScentsSection;