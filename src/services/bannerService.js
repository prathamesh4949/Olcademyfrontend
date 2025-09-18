import { API_BASE_URL } from '../api/constant';

class BannerService {
  // Helper function to validate ObjectId format
  isValidObjectId(id) {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  // Base API call method with enhanced error handling
  async apiCall(endpoint, options = {}) {
    try {
      console.log('🌐 Making API call to:', `${API_BASE_URL}${endpoint}`);
      
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: API call failed`;
          console.error('❌ API Error Response:', errorData);
        } catch (parseError) {
          const errorText = await response.text();
          console.error('❌ API Error Response (text):', errorText);
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
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

  // Base API call for FormData (file uploads)
  async apiCallFormData(endpoint, options = {}) {
    try {
      console.log('🌐 Making FormData API call to:', `${API_BASE_URL}${endpoint}`);
      
      const token = localStorage.getItem('token');
      
      const headers = {
        ...options.headers
      };
      
      // Don't set Content-Type for FormData - let browser set it with boundary
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: API call failed`;
          console.error('❌ API Error Response:', errorData);
        } catch (parseError) {
          const errorText = await response.text();
          console.error('❌ API Error Response (text):', errorText);
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
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

  // ===== ADMIN BANNER MANAGEMENT METHODS =====
  
  // Get all banners with filters and pagination
  async getAllBanners(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/banners${queryString ? `?${queryString}` : ''}`;
      return await this.apiCall(endpoint);
    } catch (error) {
      console.error('Error fetching banners:', error);
      return { success: false, error: error.message };
    }
  }

  // Create new banner
  async createBanner(bannerData) {
    try {
      console.log('🔄 Creating banner with data:', bannerData);
      
      const formData = new FormData();
      
      // Append all banner fields
      Object.keys(bannerData).forEach(key => {
        const value = bannerData[key];
        
        if (value === null || value === undefined) {
          return; // Skip null/undefined values
        }
        
        if (key === 'backgroundImage' && value instanceof File) {
          formData.append('backgroundImage', value);
          console.log('📎 Added backgroundImage file:', value.name);
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value);
          console.log('📎 Added image file:', value.name);
        } else if (key !== 'backgroundImage' && key !== 'image') {
          // Convert non-file values to strings
          formData.append(key, String(value));
          console.log(`📝 Added field ${key}:`, value);
        }
      });

      // Log FormData contents
      console.log('📋 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      return await this.apiCallFormData('/api/banners', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('Error creating banner:', error);
      return { success: false, error: error.message };
    }
  }

  // Update banner
  async updateBanner(bannerId, bannerData) {
    try {
      console.log('🔄 Updating banner', bannerId, 'with data:', bannerData);
      
      // Check if bannerId is valid
      if (!bannerId) {
        throw new Error('Banner ID is required for update');
      }

      // Validate ObjectId format
      if (!this.isValidObjectId(bannerId)) {
        throw new Error(`Invalid banner ID format: "${bannerId}". Expected 24-character hex string.`);
      }

      const formData = new FormData();
      
      Object.keys(bannerData).forEach(key => {
        const value = bannerData[key];
        
        if (value === null || value === undefined) {
          return; // Skip null/undefined values
        }
        
        if (key === 'backgroundImage' && value instanceof File) {
          formData.append('backgroundImage', value);
          console.log('📎 Added backgroundImage file:', value.name);
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value);
          console.log('📎 Added image file:', value.name);
        } else if (key !== 'backgroundImage' && key !== 'image') {
          // Convert non-file values to strings, handle booleans properly
          const stringValue = typeof value === 'boolean' ? value.toString() : String(value);
          formData.append(key, stringValue);
          console.log(`📝 Added field ${key}:`, stringValue);
        }
      });

      // Log FormData contents
      console.log('📋 FormData contents for update:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const result = await this.apiCallFormData(`/api/banners/${bannerId}`, {
        method: 'PUT',
        body: formData
      });

      console.log('✅ Update result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error updating banner:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete banner
  async deleteBanner(bannerId) {
    try {
      // Validate ObjectId format
      if (!this.isValidObjectId(bannerId)) {
        throw new Error(`Invalid banner ID format: "${bannerId}". Expected 24-character hex string.`);
      }

      return await this.apiCall(`/api/banners/${bannerId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
      return { success: false, error: error.message };
    }
  }

  // Toggle banner status
  async toggleBannerStatus(bannerId) {
    try {
      // Validate ObjectId format
      if (!this.isValidObjectId(bannerId)) {
        throw new Error(`Invalid banner ID format: "${bannerId}". Expected 24-character hex string.`);
      }

      return await this.apiCall(`/api/banners/${bannerId}/toggle-status`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error toggling banner status:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete banner image
  async deleteBannerImage(bannerId, imageType) {
    try {
      // Validate ObjectId format
      if (!this.isValidObjectId(bannerId)) {
        throw new Error(`Invalid banner ID format: "${bannerId}". Expected 24-character hex string.`);
      }

      return await this.apiCall(`/api/banners/${bannerId}/image/${imageType}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting banner image:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== BANNER FETCHING METHODS =====
  async getBanners(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/banners${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await this.apiCall(endpoint);
      return response || { success: false, data: [], message: 'No banners found' };
    } catch (error) {
      console.error('❌ Failed to fetch banners:', error.message);
      return { success: false, data: [], message: error.message };
    }
  }

  async getBannersByCategory(category, type = null) {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    
    const queryString = queryParams.toString();
    const endpoint = `/api/banners/${category.toLowerCase()}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await this.apiCall(endpoint);
      return response || { success: false, data: [], message: `No banners found for category: ${category}` };
    } catch (error) {
      console.error(`❌ Failed to fetch banners for category ${category}:`, error.message);
      return { success: false, data: [], message: error.message };
    }
  }

  async getBanner(category, type) {
    const endpoint = `/api/banners/${category.toLowerCase()}/${type}`;
    try {
      const response = await this.apiCall(endpoint);
      return response || { success: false, data: null, message: `No banner found for ${category}/${type}` };
    } catch (error) {
      console.error(`❌ Failed to fetch banner for ${category}/${type}:`, error.message);
      return { success: false, data: null, message: error.message };
    }
  }

  // Category-specific methods
  async getHomeBanners() {
    return this.getBannersByCategory('home');
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

  async getGiftBanners() {
    try {
      // First try 'gift' (singular)
      const response = await this.getBannersByCategory('gift');
      if (response.success && response.data && response.data.length > 0) {
        return response;
      }
      
      // Fallback to 'gifts' (plural) if no data found
      console.log('🔄 No banners found with "gift", trying "gifts"...');
      return await this.getBannersByCategory('gifts');
    } catch (error) {
      console.error('❌ Error fetching gift banners, trying fallback:', error);
      // Fallback to 'gifts' (plural)
      return await this.getBannersByCategory('gifts');
    }
  }

  // Type-specific methods
  async getHeroBanner(category) {
    return this.getBanner(category, 'hero');
  }

  async getProductHighlightBanners(category) {
    return this.getBannersByCategory(category, 'product_highlight');
  }

  async getCollectionHighlightBanners(category) {
    return this.getBannersByCategory(category, 'collection_highlight');
  }

  async getGiftHighlightBanners() {
    try {
      // First try 'gift' (singular)
      const response = await this.getBannersByCategory('gift', 'gift_highlight');
      if (response.success && response.data && response.data.length > 0) {
        return response;
      }
      
      // Fallback to 'gifts' (plural) if no data found
      console.log('🔄 No gift highlight banners found with "gift", trying "gifts"...');
      return await this.getBannersByCategory('gifts', 'gift_highlight');
    } catch (error) {
      console.error('❌ Error fetching gift highlight banners, trying fallback:', error);
      // Fallback to 'gifts' (plural)
      return await this.getBannersByCategory('gifts', 'gift_highlight');
    }
  }

  // Analytics
  async trackBannerClick(bannerId) {
    try {
      // Validate ObjectId format
      if (!this.isValidObjectId(bannerId)) {
        throw new Error(`Invalid banner ID format: "${bannerId}". Expected 24-character hex string.`);
      }

      return await this.apiCall(`/api/banners/${bannerId}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('❌ Failed to track banner click:', error.message);
      return { success: false, message: error.message };
    }
  }

  async getBannerDebugCounts() {
    try {
      return await this.apiCall('/api/banners/debug/count');
    } catch (error) {
      console.error('❌ Failed to fetch banner debug counts:', error.message);
      return { success: false, data: {}, message: error.message };
    }
  }

  // ===== UTILITY METHODS =====
  async testConnection() {
    try {
      console.log('🧪 Testing Banner API connection...');
      const response = await fetch(API_BASE_URL + '/api/banners/debug/count');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Banner API connection test successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Banner API connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllBannerIds() {
    try {
      const response = await this.apiCall('/api/banners/debug/count');
      return response.data?.sampleBanners || [];
    } catch (error) {
      console.error('Error fetching banner IDs:', error);
      return [];
    }
  }

  // ===== DEBUG METHODS =====
  async debugBannerData() {
    console.log('🔍 Starting comprehensive banner data debug...');
    
    try {
      // Test different banner endpoints
      const bannerTests = [
        { endpoint: '/api/banners', name: 'all banners' },
        { endpoint: '/api/banners/home', name: 'home banners' },
        { endpoint: '/api/banners/men', name: 'men banners' },
        { endpoint: '/api/banners/women', name: 'women banners' },
        { endpoint: '/api/banners/unisex', name: 'unisex banners' },
        { endpoint: '/api/banners/gift', name: 'gift banners' },
      ];
      
      console.log('🔍 Testing banner endpoints...');
      for (const test of bannerTests) {
        try {
          const response = await this.apiCall(test.endpoint);
          console.log(`✅ ${test.name} endpoint:`, response);
        } catch (error) {
          console.log(`❌ ${test.name} endpoint failed:`, error.message);
        }
      }
      
      // Test debug counts
      console.log('🔍 Testing debug counts...');
      try {
        const debugCounts = await this.getBannerDebugCounts();
        console.log('✅ Banner debug counts:', debugCounts);
      } catch (error) {
        console.log('❌ Banner debug counts failed:', error.message);
      }
      
      return {
        success: true,
        message: 'Debug completed - check console for detailed logs'
      };
    } catch (error) {
      console.error('❌ Debug failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async debugBannerEndpoints() {
    console.log('🔍 Testing all possible banner endpoints...');
    
    const endpoints = [
      '/api/banners',
      '/api/banners/home',
      '/api/banners/men',
      '/api/banners/women',
      '/api/banners/unisex',
      '/api/banners/gift',
      '/api/banners/home/hero',
      '/api/banners/men/hero',
      '/api/banners/women/hero',
      '/api/banners/unisex/hero',
      '/api/banners/gift/hero',
      '/api/banners/home/product_highlight',
      '/api/banners/men/product_highlight',
      '/api/banners/women/product_highlight',
      '/api/banners/unisex/product_highlight',
      '/api/banners/gift/gift_highlight'
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.apiCall(endpoint);
        results[endpoint] = { success: true, data: response };
        console.log(`✅ ${endpoint}:`, response);
      } catch (error) {
        results[endpoint] = { success: false, error: error.message };
        console.log(`❌ ${endpoint}:`, error.message);
      }
    }
    
    return results;
  }
}

export default new BannerService();