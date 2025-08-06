import { API_BASE_URL } from '../api/constant';

class ProductService {
  // Base API call method with enhanced error handling
  async apiCall(endpoint, options = {}) {
    try {
      console.log('🌐 Making API call to:', `${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        let errorMessage;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || `HTTP ${response.status}: API call failed`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📡 Response data:', JSON.stringify(data, null, 2));
      
      return data;
    } catch (error) {
      console.error('❌ API Error:', {
        endpoint,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Normalize sizes data to ensure correct types
  normalizeSizes(sizes) {
    if (!Array.isArray(sizes)) return [];
    return sizes.map(size => ({
      ...size,
      size: String(size.size || ''),
      price: Number(size.price) || 0,
      available: size.available === true || size.available === 'true',
      stock: Number(size.stock) || 0
    }));
  }

  // ===== PRODUCT METHODS =====
  async getWomensCollections() {
    return this.apiCall('/api/products/women/collections');
  }

  async getMensCollections() {
    return this.apiCall('/api/products/men/collections');
  }

  async getUnisexCollections() {
    return this.apiCall('/api/products/unisex/collections');
  }

  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.apiCall(endpoint);
  }

  async getProductsByCollection(category, collection, limit = 6) {
    return this.getProducts({
      category,
      collection,
      limit
    });
  }

  async searchProducts(query, filters = {}) {
    const searchParams = {
      q: query,
      ...filters
    };

    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    return this.apiCall(`/api/products/search?${queryParams.toString()}`);
  }

  async getProduct(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }
    
    const cleanId = id.toString().trim();
    
    console.log('🔍 ProductService.getProduct called with ID:', {
      originalId: id,
      cleanId: cleanId,
      idType: typeof cleanId,
      idLength: cleanId.length
    });
    
    if (cleanId.length !== 24) {
      console.error('❌ Invalid ID length:', cleanId.length);
      throw new Error(`Invalid product ID format. Expected 24 characters, got ${cleanId.length}`);
    }
    
    const hexRegex = /^[0-9a-fA-F]{24}$/;
    if (!hexRegex.test(cleanId)) {
      console.error('❌ Invalid ID format - not hex:', cleanId);
      throw new Error('Invalid product ID format. Must contain only hexadecimal characters');
    }
    
    try {
      console.log('🔍 Making API call for product:', cleanId);
      const response = await this.apiCall(`/api/products/${cleanId}`);
      console.log('✅ ProductService.getProduct response:', JSON.stringify(response, null, 2));
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch product');
      }
      
      if (!response.data || !response.data.product) {
        throw new Error('Invalid response format - missing product data');
      }
      
      // Normalize sizes data
      response.data.product.sizes = this.normalizeSizes(response.data.product.sizes || []);
      console.log('🔍 Normalized sizes:', response.data.product.sizes);
      
      return response;
    } catch (error) {
      console.error('❌ ProductService.getProduct error:', {
        id: cleanId,
        error: error.message,
        stack: error.stack
      });
      
      if (error.message.includes('404')) {
        throw new Error(`Product not found with ID: ${cleanId}`);
      } else if (error.message.includes('400')) {
        throw new Error(`Invalid product ID format: ${cleanId}`);
      } else if (error.message.includes('500')) {
        throw new Error('Server error while fetching product. Please try again.');
      }
      
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  async getDebugCounts() {
    return this.apiCall('/api/products/debug/count');
  }

  async checkProductExists(id) {
    if (!id) {
      throw new Error('Product ID is required for existence check');
    }
    
    const cleanId = id.toString().trim();
    console.log('🔍 Checking product existence for ID:', cleanId);
    
    if (cleanId.length !== 24) {
      return {
        success: true,
        exists: false,
        error: `Invalid ID length: ${cleanId.length}`,
        id: cleanId,
        validId: false
      };
    }
    
    const hexRegex = /^[0-9a-fA-F]{24}$/;
    if (!hexRegex.test(cleanId)) {
      return {
        success: true,
        exists: false,
        error: 'Invalid ID format',
        id: cleanId,
        validId: false
      };
    }
    
    try {
      return await this.apiCall(`/api/products/debug/exists/${cleanId}`);
    } catch (error) {
      console.error('❌ Error checking product existence:', error);
      return {
        success: false,
        exists: false,
        error: error.message,
        id: cleanId,
        validId: true
      };
    }
  }

  // ===== BANNER METHODS =====
  async getBanners(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/banners${queryString ? `?${queryString}` : ''}`;
    
    return this.apiCall(endpoint);
  }

  async getBannersByCategory(category, type = null) {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    
    const queryString = queryParams.toString();
    const endpoint = `/api/banners/${category}${queryString ? `?${queryString}` : ''}`;
    
    return this.apiCall(endpoint);
  }

  async getBanner(category, type) {
    return this.apiCall(`/api/banners/${category}/${type}`);
  }

  async getWomensBanners() {
    return this.getBannersByCategory('women');
  }

  async getMensBanners() {
    return this.getBannersByCategory('men');
  }

  async getUnisexBanners() {
    return this.getBannersByCategory('unisex');
  }

  async getHeroBanner(category) {
    return this.getBanner(category, 'hero');
  }

  async getProductHighlightBanners(category) {
    return this.getBannersByCategory(category, 'product_highlight');
  }

  async getCollectionHighlightBanners(category) {
    return this.getBannersByCategory(category, 'collection_highlight');
  }

  async trackBannerClick(bannerId) {
    return this.apiCall(`/api/banners/${bannerId}/click`, {
      method: 'POST'
    });
  }

  async getBannerDebugCounts() {
    return this.apiCall('/api/banners/debug/count');
  }

  async getMensPageData() {
    try {
      const [collections, banners] = await Promise.all([
        this.getMensCollections(),
        this.getMensBanners()
      ]);

      return {
        success: true,
        data: {
          collections: collections.data,
          banners: banners.data
        }
      };
    } catch (error) {
      console.error('Error fetching men\'s page data:', error);
      throw error;
    }
  }

  async getWomensPageData() {
    try {
      const [collections, banners] = await Promise.all([
        this.getWomensCollections(),
        this.getWomensBanners()
      ]);

      return {
        success: true,
        data: {
          collections: collections.data,
          banners: banners.data
        }
      };
    } catch (error) {
      console.error('Error fetching women\'s page data:', error);
      throw error;
    }
  }

  async getUnisexPageData() {
    try {
      const [collections, banners] = await Promise.all([
        this.getUnisexCollections(),
        this.getUnisexBanners()
      ]);

      return {
        success: true,
        data: {
          collections: collections.data,
          banners: banners.data
        }
      };
    } catch (error) {
      console.error('Error fetching unisex page data:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch(API_BASE_URL + '/');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ API connection test successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllProductIds() {
    try {
      const response = await this.apiCall('/api/products/debug/count');
      return response.data?.sampleProducts || [];
    } catch (error) {
      console.error('Error fetching product IDs:', error);
      return [];
    }
  }

  async debugProductId(id) {
    try {
      console.log('🔍 Debug: Testing product ID:', id);
      
      console.log('Step 1: Checking existence...');
      const existsCheck = await this.checkProductExists(id);
      console.log('Exists check result:', existsCheck);
      
      if (existsCheck.exists) {
        console.log('Step 2: Fetching full product...');
        const productResult = await this.getProduct(id);
        console.log('Product fetch result:', productResult);
        return {
          success: true,
          exists: true,
          product: productResult.data?.product,
          debug: { existsCheck, productResult }
        };
      } else {
        return {
          success: true,
          exists: false,
          error: existsCheck.error,
          debug: { existsCheck }
        };
      }
    } catch (error) {
      console.error('Debug error:', error);
      return {
        success: false,
        error: error.message,
        debug: { error: error.stack }
      };
    }
  }
}

export default new ProductService();