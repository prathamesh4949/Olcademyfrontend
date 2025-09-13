import { API_BASE_URL } from '../api/constant';

const SCENT_API_END_POINT = `${API_BASE_URL}/api/scents`;

class ScentService {
  // Get all scents with filters
  static async getAllScents(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = `${SCENT_API_END_POINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fetching scents from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scents fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching scents:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  // Get scents by collection (all collections including gift collections)
  static async getScentsByCollection(collection, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = `${SCENT_API_END_POINT}/collection/${collection}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log(`🔍 Fetching ${collection} scents from:`, url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ ${collection} scents fetched successfully:`, data);
      return data;
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

  // NEW: Gift collection methods
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
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = `${SCENT_API_END_POINT}/brand/${brand}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log(`🔍 Fetching ${brand} scents from:`, url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ ${brand} scents fetched successfully:`, data);
      return data;
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
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('query', query);
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const url = `${SCENT_API_END_POINT}/search?${queryParams.toString()}`;
      
      console.log('🔍 Searching scents:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scents search completed successfully:', data);
      return data;
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
    try {
      const url = `${SCENT_API_END_POINT}/featured`;
      
      console.log('🔍 Fetching featured scents from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Featured scents fetched successfully:', data);
      return data;
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
          // NEW: Gift collections
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
    try {
      const url = `${SCENT_API_END_POINT}/${id}`;
      
      console.log('🔍 Fetching scent by ID from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scent fetched by ID successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching scent by ID:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  // Create new scent (admin only)
  static async createScent(scentData) {
    try {
      const url = SCENT_API_END_POINT;
      
      console.log('🔍 Creating scent:', scentData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(scentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scent created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update scent (admin only)
  static async updateScent(id, scentData) {
    try {
      const url = `${SCENT_API_END_POINT}/${id}`;
      
      console.log('🔍 Updating scent:', id, scentData);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(scentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scent updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete scent (admin only)
  static async deleteScent(id) {
    try {
      const url = `${SCENT_API_END_POINT}/${id}`;
      
      console.log('🔍 Deleting scent:', id);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scent deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error deleting scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Soft delete scent (admin only)
  static async deactivateScent(id) {
    try {
      const url = `${SCENT_API_END_POINT}/${id}/deactivate`;
      
      console.log('🔍 Deactivating scent:', id);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ Scent deactivated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error deactivating scent:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get filter options (for building dynamic filter UI)
  static async getFilterOptions() {
    try {
      const url = `${SCENT_API_END_POINT}/filters`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Error fetching filter options:', error);
      return {
        success: false,
        message: error.message,
        data: {
          categories: ['women', 'men', 'unisex', 'home', 'summer'],
          collections: [
            'trending', 
            'best-seller', 
            'signature', 
            'limited-edition', 
            'mens-signature', 
            'orange-marmalade', 
            'rose-garden-essence', 
            'gender-free', 
            'limitless',
            // NEW: Gift collections
            'perfect-discover-gifts',
            'perfect-gifts-premium',
            'perfect-gifts-luxury',
            'home-decor-gifts'
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