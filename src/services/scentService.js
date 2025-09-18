import { API_BASE_URL } from '../api/constant';

const SCENT_API_END_POINT = `${API_BASE_URL}/api/scents`;

class ScentService {
  // Base API call method with enhanced error handling
  async apiCall(endpoint, options = {}) {
    try {
      console.log('🌐 Making API call to:', `${SCENT_API_END_POINT}${endpoint}`);
      
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${SCENT_API_END_POINT}${endpoint}`, {
        headers,
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

  // Base API call for FormData (file uploads) - Updated to NOT set Content-Type
  async apiCallFormData(endpoint, options = {}) {
    try {
      console.log('🌐 Making FormData API call to:', `${SCENT_API_END_POINT}${endpoint}`);
      
      const token = localStorage.getItem('token');
      
      const headers = {
        ...options.headers
        // DO NOT set Content-Type for FormData - let browser set it with boundary
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${SCENT_API_END_POINT}${endpoint}`, {
        ...options,
        headers
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

  // ===== ADMIN SCENT MANAGEMENT METHODS =====
  
  // Get all scents with filters and pagination
  static async getAllScents(params = {}) {
    const service = new ScentService();
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `?${queryString}` : '';
      
      console.log('🔍 Fetching scents from:', `${SCENT_API_END_POINT}${endpoint}`);
      
      const response = await service.apiCall(endpoint);
      
      console.log('✅ Scents fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching scents:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Helper method to check if a value is valid (not null, undefined, or empty string)
  static isValidValue(value) {
    return value !== null && value !== undefined && value !== '';
  }

  // Helper method to validate image files
  static validateImageFiles(files) {
    if (!files) return true;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let file of files) {
      if (!validTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Only JPEG, PNG, GIF, and WebP are allowed.`);
      }
      if (file.size > maxSize) {
        throw new Error(`File size too large: ${file.name}. Maximum size is 5MB.`);
      }
    }
    
    return true;
  }

  // Create new scent with improved file handling
  static async createScent(scentData) {
    const service = new ScentService();
    try {
      console.log('🔍 Creating scent:', scentData);
      
      // Process form data with proper file handling
      const formData = new FormData();
      
      // Handle image files first
      if (scentData.images && scentData.images.length > 0) {
        // Validate image files
        this.validateImageFiles(scentData.images);
        
        console.log('Adding images to FormData:', Array.from(scentData.images).map(f => f.name));
        Array.from(scentData.images).forEach(file => {
          formData.append('images', file);
        });
      }

      if (scentData.hoverImage) {
        // Validate hover image
        this.validateImageFiles([scentData.hoverImage]);
        
        console.log('Adding hover image to FormData:', scentData.hoverImage.name);
        formData.append('hoverImage', scentData.hoverImage);
      }
      
      // Append all other scent fields
      Object.keys(scentData).forEach(key => {
        if (key === 'images' || key === 'hoverImage') {
          // Skip - already handled above
          return;
        } else if (key === 'sizes' || key === 'fragrance_notes' || key === 'personalization') {
          if (scentData[key] && (Array.isArray(scentData[key]) ? scentData[key].length > 0 : true)) {
            formData.append(key, JSON.stringify(scentData[key]));
          }
        } else if (Array.isArray(scentData[key])) {
          // Filter out empty strings from arrays before joining
          const filteredArray = scentData[key].filter(item => this.isValidValue(item));
          if (filteredArray.length > 0) {
            formData.append(key, filteredArray.join(','));
          }
        } else if (this.isValidValue(scentData[key]) && key !== 'keepExistingImages') {
          formData.append(key, scentData[key]);
        }
      });

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await service.apiCallFormData('', {
        method: 'POST',
        body: formData
      });

      console.log('✅ Scent created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update scent with improved file handling
  static async updateScent(id, scentData) {
    const service = new ScentService();
    try {
      console.log('🔍 Updating scent:', id, scentData);
      
      // Process form data with proper file handling
      const formData = new FormData();
      
      // Handle image files first
      if (scentData.images && scentData.images.length > 0) {
        // Validate image files
        this.validateImageFiles(scentData.images);
        
        console.log('Adding images to FormData:', Array.from(scentData.images).map(f => f.name));
        Array.from(scentData.images).forEach(file => {
          formData.append('images', file);
        });
      }

      if (scentData.hoverImage) {
        // Validate hover image
        this.validateImageFiles([scentData.hoverImage]);
        
        console.log('Adding hover image to FormData:', scentData.hoverImage.name);
        formData.append('hoverImage', scentData.hoverImage);
      }

      // Handle keepExistingImages flag
      if (scentData.keepExistingImages !== undefined) {
        formData.append('keepExistingImages', scentData.keepExistingImages);
      }
      
      // Append all other scent fields
      Object.keys(scentData).forEach(key => {
        if (key === 'images' || key === 'hoverImage') {
          // Skip - already handled above
          return;
        } else if (key === 'sizes' || key === 'fragrance_notes' || key === 'personalization') {
          if (scentData[key] && (Array.isArray(scentData[key]) ? scentData[key].length > 0 : true)) {
            formData.append(key, JSON.stringify(scentData[key]));
          }
        } else if (Array.isArray(scentData[key])) {
          // Filter out empty strings from arrays before joining
          const filteredArray = scentData[key].filter(item => this.isValidValue(item));
          if (filteredArray.length > 0) {
            formData.append(key, filteredArray.join(','));
          }
        } else if (this.isValidValue(scentData[key])) {
          formData.append(key, scentData[key]);
        }
      });

      // Log FormData contents for debugging
      console.log('FormData contents for update:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await service.apiCallFormData(`/${id}`, {
        method: 'PUT',
        body: formData
      });

      console.log('✅ Scent updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete scent
  static async deleteScent(id) {
    const service = new ScentService();
    try {
      console.log('🔍 Deleting scent:', id);
      
      const response = await service.apiCall(`/${id}`, {
        method: 'DELETE'
      });

      console.log('✅ Scent deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error deleting scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Toggle scent status (deactivate/activate)
  static async deactivateScent(id) {
    const service = new ScentService();
    try {
      console.log('🔍 Toggling scent status:', id);
      
      const response = await service.apiCall(`/${id}/deactivate`, {
        method: 'PATCH'
      });

      console.log('✅ Scent status toggled successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error toggling scent status:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get scents by collection (all collections including gift collections)
  static async getScentsByCollection(collection, params = {}) {
    const service = new ScentService();
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const endpoint = `/collection/${collection}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log(`🔍 Fetching ${collection} scents from:`, `${SCENT_API_END_POINT}${endpoint}`);
      
      const response = await service.apiCall(endpoint);

      console.log(`✅ ${collection} scents fetched successfully:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching ${collection} scents:`, error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Existing collection methods
  static async getTrendingScents(params = {}) {
    return this.getScentsByCollection('trending', params);
  }

  static async getBestSellerScents(params = {}) {
    return this.getScentsByCollection('best-seller', params);
  }

  static async getSignatureScents(params = {}) {
    return this.getScentsByCollection('signature', params);
  }

  static async getLimitedEditionScents(params = {}) {
    return this.getScentsByCollection('limited-edition', params);
  }

  static async getWomensSignatureScents(params = {}) {
    return this.getScentsByCollection('signature', params);
  }

  static async getRoseGardenEssenceScents(params = {}) {
    return this.getScentsByCollection('rose-garden-essence', params);
  }

  static async getMensSignatureScents(params = {}) {
    return this.getScentsByCollection('mens-signature', params);
  }

  static async getOrangeMarmaladeScents(params = {}) {
    return this.getScentsByCollection('orange-marmalade', params);
  }

  static async getGenderFreeScents(params = {}) {
    return this.getScentsByCollection('gender-free', params);
  }

  static async getLimitlessScents(params = {}) {
    return this.getScentsByCollection('limitless', params);
  }

  // Gift collection methods
  static async getPerfectDiscoverGiftsScents(params = {}) {
    return this.getScentsByCollection('perfect-discover-gifts', params);
  }

  static async getPerfectGiftsPremiumScents(params = {}) {
    return this.getScentsByCollection('perfect-gifts-premium', params);
  }

  static async getPerfectGiftsLuxuryScents(params = {}) {
    return this.getScentsByCollection('perfect-gifts-luxury', params);
  }

  static async getHomeDecorGiftsScents(params = {}) {
    return this.getScentsByCollection('home-decor-gifts', params);
  }

  // Get scents by brand
  static async getScentsByBrand(brand, params = {}) {
    const service = new ScentService();
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const endpoint = `/brand/${brand}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log(`🔍 Fetching ${brand} scents from:`, `${SCENT_API_END_POINT}${endpoint}`);
      
      const response = await service.apiCall(endpoint);

      console.log(`✅ ${brand} scents fetched successfully:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching ${brand} scents:`, error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Search scents
  static async searchScents(query, params = {}) {
    const service = new ScentService();
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('query', query);
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const endpoint = `/search?${queryParams.toString()}`;
      
      console.log('🔍 Searching scents:', `${SCENT_API_END_POINT}${endpoint}`);
      
      const response = await service.apiCall(endpoint);

      console.log('✅ Scents search completed successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error searching scents:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Get featured scents for homepage
  static async getFeaturedScents() {
    const service = new ScentService();
    try {
      const endpoint = '/featured';
      
      console.log('🔍 Fetching featured scents from:', `${SCENT_API_END_POINT}${endpoint}`);
      
      const response = await service.apiCall(endpoint);

      console.log('✅ Featured scents fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching featured scents:', error);
      return {
        success: false,
        message: error.message,
        data: {
          trending: [],
          bestSellers: [],
          signature: [],
          limitedEdition: [],
          mensSignature: [],
          orangeMarmalade: [],
          roseGardenEssence: [],
          genderFree: [],
          limitless: [],
          perfectDiscoverGifts: [],
          perfectGiftsPremium: [],
          perfectGiftsLuxury: [],
          homeDecorGifts: []
        }
      };
    }
  }

  // Get single scent by ID
  static async getScentById(id) {
    const service = new ScentService();
    try {
      const endpoint = `/${id}`;
      
      console.log('🔍 Fetching scent by ID from:', `${SCENT_API_END_POINT}${endpoint}`);
      
      const response = await service.apiCall(endpoint);

      console.log('✅ Scent fetched by ID successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching scent by ID:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  // Get filter options (for building dynamic filter UI)
  static async getFilterOptions() {
    const service = new ScentService();
    try {
      const endpoint = '/filters';
      
      const response = await service.apiCall(endpoint);
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching filter options:', error);
      return {
        success: false,
        message: error.message,
        data: {
          categories: ['women', 'men', 'unisex', 'home', 'summer'],
          collections: [
            'trending', 'best-seller', 'signature', 'limited-edition', 'mens-signature', 
            'orange-marmalade', 'rose-garden-essence', 'gender-free', 'limitless',
            'perfect-discover-gifts', 'perfect-gifts-premium', 'perfect-gifts-luxury', 'home-decor-gifts'
          ],
          scentFamilies: ['floral', 'woody', 'citrus', 'oriental', 'fresh', 'spicy', 'fruity'],
          intensities: ['light', 'moderate', 'strong'],
          longevities: ['2-4 hours', '4-6 hours', '6-8 hours', '8+ hours'],
          sillages: ['intimate', 'moderate', 'strong', 'enormous'],
          concentrations: ['parfum', 'eau de parfum', 'eau de toilette', 'eau de cologne', 'eau fraiche'],
          seasons: ['spring', 'summer', 'autumn', 'winter'],
          occasions: ['casual', 'formal', 'romantic', 'office', 'party', 'evening']
        }
      };
    }
  }
}

export default ScentService;