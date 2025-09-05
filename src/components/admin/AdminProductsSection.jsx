import React, { useState, useEffect } from 'react';
import { 
  Package2,
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
  Image as ImageIcon,
  Star,
  DollarSign,
  Package,
  RefreshCw,
  Grid,
  List,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

import ProductService from '@/services/productService'; // Adjust path based on your project structure

const AdminProductsSection = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, current: 1 });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'men',
    productCollection: 'just-arrived',
    featured: false,
    isActive: true,
    brand: '',
    stock: '',
    sku: '',
    rating: '',
    tags: [],
    images: null,
    hoverImage: null,
    sizes: [{ size: '50ml', price: '', stock: '', available: true }],
    fragrance_notes: { top: [], middle: [], base: [] },
    personalization: { available: false, max_characters: 15, price: 0 },
    ingredients: '',
    volume: '',
    concentration: '',
    longevity: '',
    sillage: '',
    season: [],
    occasion: [],
    keepExistingImages: true // New field for update mode
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [operationLoading, setOperationLoading] = useState(false);

  // Categories and collections
  const categories = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'gifts', label: 'Gifts' }
  ];

  const collections = {
    men: ['just-arrived', 'best-sellers', 'huntsman-savile-row'],
    women: ['just-arrived', 'best-sellers', 'huntsman-savile-row'],
    unisex: ['just-arrived', 'best-sellers', 'huntsman-savile-row'],
    gifts: ['for-her', 'for-him', 'by-price-under-50', 'by-price-under-100', 'by-price-under-200', 'home-gift', 'birthday-gift', 'wedding-gift']
  };

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const occasions = ['Daily', 'Evening', 'Office', 'Date Night', 'Special Events', 'Casual'];

  // Fetch products
  const fetchProducts = async (page = 1, resetPagination = false) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: 1000, // Set high limit to fetch all products
        sort: sortBy,
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(filterStatus !== 'all' && { isActive: filterStatus === 'active' })
      };

      console.log('Fetching products with params:', params);
      
      const result = await ProductService.getAllProducts(params);
      console.log('Products fetch result:', {
        success: result.success,
        dataLength: result.data?.length || 0,
        data: result.data,
        pagination: result.pagination
      });
      
      if (result.success) {
        setProducts(result.data || []);
        setPagination(result.pagination || { total: result.data?.length || 0, totalPages: 1, current: 1 });
        if (resetPagination) setCurrentPage(1);
        showMessage('success', `Loaded ${result.data?.length || 0} products`);
      } else {
        setProducts([]);
        showMessage('error', result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      showMessage('error', 'Failed to fetch products');
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
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested personalization changes
  const handlePersonalizationChange = (subField, value) => {
    setProductForm(prev => ({
      ...prev,
      personalization: {
        ...prev.personalization,
        [subField]: value
      }
    }));
  };

  // Handle array field changes
  const handleArrayChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  // Handle sizes change
  const handleSizesChange = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }));
  };

  const addSize = () => {
    setProductForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', price: '', stock: '', available: true }]
    }));
  };

  const removeSize = (index) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  // Handle fragrance notes change
  const handleFragranceNotesChange = (type, value) => {
    setProductForm(prev => ({
      ...prev,
      fragrance_notes: {
        ...prev.fragrance_notes,
        [type]: Array.isArray(value) ? value : value.split(',').map(item => item.trim()).filter(item => item)
      }
    }));
  };

  // Create product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    
    try {
      const result = await ProductService.createProduct(productForm);
      
      if (result.success) {
        setShowCreateModal(false);
        resetForm();
        fetchProducts();
        showMessage('success', 'Product created successfully!');
      } else {
        showMessage('error', result.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showMessage('error', 'Failed to create product');
    } finally {
      setOperationLoading(false);
    }
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    setOperationLoading(true);
    
    try {
      const result = await ProductService.updateProduct(selectedProduct._id, productForm);
      
      if (result.success) {
        setShowEditModal(false);
        setSelectedProduct(null);
        resetForm();
        fetchProducts();
        showMessage('success', 'Product updated successfully!');
      } else {
        showMessage('error', result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showMessage('error', 'Failed to update product');
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }
    
    setOperationLoading(true);
    
    try {
      const result = await ProductService.deleteProduct(productId);
      
      if (result.success) {
        fetchProducts();
        showMessage('success', 'Product deleted successfully!');
      } else {
        showMessage('error', result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showMessage('error', 'Failed to delete product');
    } finally {
      setOperationLoading(false);
    }
  };

  // Toggle product status
  const handleToggleStatus = async (productId) => {
    setOperationLoading(true);
    
    try {
      const result = await ProductService.toggleProductStatus(productId);
      
      if (result.success) {
        fetchProducts();
        showMessage('success', result.message);
      } else {
        showMessage('error', result.message || 'Failed to toggle product status');
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      showMessage('error', 'Failed to toggle product status');
    } finally {
      setOperationLoading(false);
    }
  };

  // Open edit modal
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'men',
      productCollection: product.productCollection || 'just-arrived',
      featured: product.featured || false,
      isActive: product.isActive || true,
      brand: product.brand || '',
      stock: product.stock || '',
      sku: product.sku || '',
      rating: product.rating || '',
      tags: product.tags || [],
      images: null, // Reset images for editing
      hoverImage: null, // Reset hoverImage for editing
      sizes: product.sizes || [{ size: '50ml', price: '', stock: '', available: true }],
      fragrance_notes: product.fragrance_notes || { top: [], middle: [], base: [] },
      personalization: product.personalization || { available: false, max_characters: 15, price: 0 },
      ingredients: product.ingredients || '',
      volume: product.volume || '',
      concentration: product.concentration || '',
      longevity: product.longevity || '',
      sillage: product.sillage || '',
      season: product.season || [],
      occasion: product.occasion || [],
      keepExistingImages: true // Default to append for edit
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'men',
      productCollection: 'just-arrived',
      featured: false,
      isActive: true,
      brand: '',
      stock: '',
      sku: '',
      rating: '',
      tags: [],
      images: null,
      hoverImage: null,
      sizes: [{ size: '50ml', price: '', stock: '', available: true }],
      fragrance_notes: { top: [], middle: [], base: [] },
      personalization: { available: false, max_characters: 15, price: 0 },
      ingredients: '',
      volume: '',
      concentration: '',
      longevity: '',
      sillage: '',
      season: [],
      occasion: [],
      keepExistingImages: true
    });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    featured: products.filter(p => p.featured).length,
    lowStock: products.filter(p => p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0)
  };

  // Load initial data
  useEffect(() => {
    fetchProducts();
  }, [sortBy, filterCategory, filterStatus]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        // Filter locally for now, could implement server-side search
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Define ProductCard and ProductListItem
  const ProductCard = ({ product }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all border">
      <div className="relative mb-4">
        <div className="bg-white rounded-xl p-4 h-48 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.src = '/images/default-perfume.png';
              }}
            />
          ) : (
            <ImageIcon className="w-16 h-16 text-gray-300" />
          )}
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <button
            onClick={() => handleToggleStatus(product._id)}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
              product.isActive 
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {product.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
            {product.isActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium rounded-full">
              <Star className="w-3 h-3 inline mr-1" />
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{product.category} • {product.productCollection}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-amber-600">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setShowViewModal(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => handleEditProduct(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(product._id, product.name)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/default-perfume.png';
                }}
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-300" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                <span className="text-sm text-gray-500 capitalize">{product.productCollection}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                {product.brand && (
                  <span className="text-sm text-gray-500">{product.brand}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">${product.price}</p>
                {product.rating && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleStatus(product._id)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    product.isActive 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {product.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>

                {product.featured && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium rounded-full text-center">
                    <Star className="w-3 h-3 inline mr-1" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowViewModal(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id, product.name)}
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

      {/* Products Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Package2 className="w-8 h-8 text-blue-500" />
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

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
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
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="price">Price Low-High</option>
              <option value="-price">Price High-Low</option>
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
              onClick={() => fetchProducts()}
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
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No products found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or create a new product</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4 text-sm text-gray-600">
            Displaying {filteredProducts.length} of {products.length} products
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem key={product._id} product={product} />
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
              ({pagination.total} total products)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  fetchProducts(newPage);
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
                      fetchProducts(page);
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
                  fetchProducts(newPage);
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

      {/* Create Product Modal */}
      {showCreateModal && (
        <ProductModal
          title="Create New Product"
          product={productForm}
          onSubmit={handleCreateProduct}
          onChange={handleFormChange}
          onPersonalizationChange={handlePersonalizationChange}
          onArrayChange={handleArrayChange}
          onSizesChange={handleSizesChange}
          onFragranceNotesChange={handleFragranceNotesChange}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          loading={operationLoading}
          categories={categories}
          collections={collections}
          seasons={seasons}
          occasions={occasions}
          addSize={addSize}
          removeSize={removeSize}
          fetchProducts={fetchProducts}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <ProductModal
          title="Edit Product"
          product={productForm}
          existingProduct={selectedProduct}
          onSubmit={handleUpdateProduct}
          onChange={handleFormChange}
          onPersonalizationChange={handlePersonalizationChange}
          onArrayChange={handleArrayChange}
          onSizesChange={handleSizesChange}
          onFragranceNotesChange={handleFragranceNotesChange}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
            resetForm();
          }}
          loading={operationLoading}
          categories={categories}
          collections={collections}
          seasons={seasons}
          occasions={occasions}
          addSize={addSize}
          removeSize={removeSize}
          isEdit={true}
          fetchProducts={fetchProducts}
        />
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          onClose={() => {
            setShowViewModal(false);
            setSelectedProduct(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEditProduct(selectedProduct);
          }}
          onDelete={() => {
            setShowViewModal(false);
            handleDeleteProduct(selectedProduct._id, selectedProduct.name);
          }}
          onToggleStatus={() => handleToggleStatus(selectedProduct._id)}
        />
      )}
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ 
  title, 
  product, 
  existingProduct = null,
  onSubmit, 
  onChange, 
  onPersonalizationChange,
  onArrayChange,
  onSizesChange,
  onFragranceNotesChange,
  onClose, 
  loading, 
  categories, 
  collections, 
  seasons, 
  occasions,
  addSize,
  removeSize,
  isEdit = false,
  fetchProducts
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing & Stock' },
    { id: 'details', label: 'Product Details' },
    { id: 'fragrance', label: 'Fragrance Notes' },
    { id: 'media', label: 'Images' }
  ];

  const handleDeleteImage = async (index) => {
    if (!existingProduct) return;
    try {
      const result = await ProductService.deleteProductImage(existingProduct._id, index);
      if (result.success) {
        fetchProducts(); // Refresh the product list
        // To update the modal, we could refetch the single product, but for simplicity, close and reopen if needed
        alert('Image deleted successfully. Please reopen the modal to see changes.');
      } else {
        alert(result.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleDeleteHoverImage = async () => {
    if (!existingProduct) return;
    try {
      const result = await ProductService.deleteProductHoverImage(existingProduct._id);
      if (result.success) {
        fetchProducts(); // Refresh the product list
        alert('Hover image deleted successfully. Please reopen the modal to see changes.');
      } else {
        alert(result.message || 'Failed to delete hover image');
      }
    } catch (error) {
      console.error('Error deleting hover image:', error);
      alert('Failed to delete hover image');
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
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={product.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={product.sku}
                    onChange={(e) => onChange('sku', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter unique SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => onChange('brand', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={product.category}
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
                    Collection *
                  </label>
                  <select
                    required
                    value={product.productCollection}
                    onChange={(e) => onChange('productCollection', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {collections[product.category]?.map(col => (
                      <option key={col} value={col}>{col.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={product.featured}
                      onChange={(e) => onChange('featured', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">Featured</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={(e) => onChange('isActive', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={product.price}
                    onChange={(e) => onChange('price', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter base price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => onChange('stock', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter base stock"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes
                  </label>
                  {product.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) => onSizesChange(index, 'size', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Size (e.g., 50ml)"
                      />
                      <input
                        type="number"
                        min="0"
                        value={size.price}
                        onChange={(e) => onSizesChange(index, 'price', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Price"
                      />
                      <input
                        type="number"
                        min="0"
                        value={size.stock}
                        onChange={(e) => onSizesChange(index, 'stock', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Stock"
                      />
                      <select
                        value={size.available ? 'true' : 'false'}
                        onChange={(e) => onSizesChange(index, 'available', e.target.value === 'true')}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSize}
                    className="mt-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                  >
                    Add Size
                  </button>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={product.personalization.available}
                      onChange={(e) => onPersonalizationChange('available', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-gray-700">Personalization Available</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Characters
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={product.personalization.max_characters}
                      onChange={(e) => onPersonalizationChange('max_characters', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter max characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personalization Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={product.personalization.price}
                      onChange={(e) => onPersonalizationChange('price', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter personalization price"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={product.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={product.rating}
                    onChange={(e) => onChange('rating', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter rating (0-5)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={product.tags.join(', ')}
                    onChange={(e) => onArrayChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <textarea
                    rows={4}
                    value={product.ingredients}
                    onChange={(e) => onChange('ingredients', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                    placeholder="Enter product ingredients"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={product.volume}
                    onChange={(e) => onChange('volume', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter volume (e.g., 100ml)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Concentration
                  </label>
                  <input
                    type="text"
                    value={product.concentration}
                    onChange={(e) => onChange('concentration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter concentration (e.g., EDP)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longevity
                  </label>
                  <input
                    type="text"
                    value={product.longevity}
                    onChange={(e) => onChange('longevity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter longevity (e.g., Long Lasting)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sillage
                  </label>
                  <input
                    type="text"
                    value={product.sillage}
                    onChange={(e) => onChange('sillage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter sillage (e.g., Moderate)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seasons
                  </label>
                  <select
                    multiple
                    value={product.season}
                    onChange={(e) => onArrayChange('season', Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {seasons.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occasions
                  </label>
                  <select
                    multiple
                    value={product.occasion}
                    onChange={(e) => onArrayChange('occasion', Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    {occasions.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'fragrance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Notes
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(product.fragrance_notes.top) ? product.fragrance_notes.top.join(', ') : ''}
                    onChange={(e) => onFragranceNotesChange('top', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter top notes separated by commas (e.g., Bergamot, Lemon, Orange)"
                  />
                  <p className="text-sm text-gray-500 mt-1">The initial scent that hits first</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Notes (Heart)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(product.fragrance_notes.middle) ? product.fragrance_notes.middle.join(', ') : ''}
                    onChange={(e) => onFragranceNotesChange('middle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter heart notes separated by commas (e.g., Rose, Jasmine, Lavender)"
                  />
                  <p className="text-sm text-gray-500 mt-1">The core of the fragrance</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Notes
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(product.fragrance_notes.base) ? product.fragrance_notes.base.join(', ') : ''}
                    onChange={(e) => onFragranceNotesChange('base', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter base notes separated by commas (e.g., Sandalwood, Vanilla, Musk)"
                  />
                  <p className="text-sm text-gray-500 mt-1">The lasting foundation of the scent</p>
                </div>

                {/* Fragrance Pyramid Visual */}
                <div className="bg-gradient-to-b from-yellow-50 to-amber-50 rounded-xl p-6 border border-amber-100">
                  <h4 className="font-semibold text-gray-800 mb-4 text-center">Fragrance Pyramid Preview</h4>
                  <div className="space-y-3">
                    <div className="bg-yellow-100 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-yellow-800 mb-1">Top Notes</div>
                      <div className="text-xs text-yellow-600">
                        {product.fragrance_notes.top?.length > 0 ? product.fragrance_notes.top.join(' • ') : 'Not specified'}
                      </div>
                    </div>
                    <div className="bg-amber-100 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-amber-800 mb-1">Heart Notes</div>
                      <div className="text-xs text-amber-600">
                        {product.fragrance_notes.middle?.length > 0 ? product.fragrance_notes.middle.join(' • ') : 'Not specified'}
                      </div>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-orange-800 mb-1">Base Notes</div>
                      <div className="text-xs text-orange-600">
                        {product.fragrance_notes.base?.length > 0 ? product.fragrance_notes.base.join(' • ') : 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onChange('images', e.target.files)}
                      className="hidden"
                      id="images-upload"
                    />
                    <label htmlFor="images-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        Click to upload images
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB each (Max 5 images)
                      </p>
                    </label>
                  </div>
                  {isEdit && (
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        checked={product.keepExistingImages}
                        onChange={(e) => onChange('keepExistingImages', e.target.checked)}
                        className="w-4 h-4"
                        id="keep-images"
                      />
                      <label htmlFor="keep-images" className="text-sm font-medium text-gray-700">
                        Append new images to existing ones (uncheck to replace)
                      </label>
                    </div>
                  )}
                </div>

                {/* Show existing images if editing */}
                {isEdit && existingProduct && existingProduct.images && existingProduct.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Current Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = '/images/default-perfume.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(index)}
                              className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-amber-600 mt-2">
                      💡 Tip: Upload new images to replace existing ones, or keep existing images by not selecting new ones
                    </p>
                  </div>
                )}

                {/* Hover Image Upload */}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange('hoverImage', e.target.files[0])}
                      className="hidden"
                      id="hover-image-upload"
                    />
                    <label htmlFor="hover-image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        Click to upload hover image
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB (Single image, different from main image)
                      </p>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">This image will be shown on hover in product cards (optional)</p>
                </div>

                {/* Show existing hover image if editing */}
                {isEdit && existingProduct && existingProduct.hoverImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Current Hover Image
                    </label>
                    <div className="relative group w-48">
                      <img
                        src={existingProduct.hoverImage}
                        alt="Hover image"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = '/images/default-perfume.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleDeleteHoverImage}
                          className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-amber-600 mt-2">
                      💡 Tip: Upload a new hover image to replace the existing one
                    </p>
                  </div>
                )}

                {/* Image Upload Guidelines */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Image Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use high-quality images (minimum 800x800 pixels)</li>
                    <li>• First image will be used as the main product image</li>
                    <li>• Show product from different angles</li>
                    <li>• Use clean, professional backgrounds</li>
                    <li>• Ensure good lighting and sharp focus</li>
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
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ProductViewModal Component (unchanged)
const ProductViewModal = ({ product, onClose, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-amber-800 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Collection</p>
                <p className="font-medium">{product.productCollection}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand</p>
                <p className="font-medium">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-medium">{product.rating || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description || 'N/A'}</p>
          </div>

          {/* Pricing & Stock */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-800">Base Price</h4>
                <p className="text-blue-700">${product.price}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-medium text-green-800">Stock</h4>
                <p className="text-green-700">{product.stock}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-medium text-purple-800">Featured</h4>
                <p className="text-purple-700">{product.featured ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.sizes.map((size, index) => (
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

          {/* Fragrance Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fragrance Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 rounded-xl p-4">
                <h4 className="font-medium text-yellow-800">Top Notes</h4>
                <p className="text-yellow-700">{product.fragrance_notes.top.join(', ') || 'N/A'}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <h4 className="font-medium text-amber-800">Middle Notes</h4>
                <p className="text-amber-700">{product.fragrance_notes.middle.join(', ') || 'N/A'}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-medium text-orange-800">Base Notes</h4>
                <p className="text-orange-700">{product.fragrance_notes.base.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Personalization */}
          {product.personalization && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalization</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Available</h4>
                  <p className="text-purple-700">{product.personalization.available ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Max Characters</h4>
                  <p className="text-purple-700">{product.personalization.max_characters}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800">Additional Price</h4>
                  <p className="text-purple-700">${product.personalization.price}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-600">SKU</h4>
                <p className="text-gray-800 font-mono">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Created</h4>
                <p className="text-gray-800">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">Updated</h4>
                <p className="text-gray-800">{new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-600">ID</h4>
                <p className="text-gray-800 font-mono text-xs truncate">{product._id}</p>
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
              product.isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            {product.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Edit className="w-5 h-5 inline mr-2" />
            Edit Product
          </button>
          <button
            onClick={onDelete}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-5 h-5 inline mr-2" />
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsSection;