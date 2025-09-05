// WishlistService.js
import { API_BASE_URL } from '../api/constant';

class WishlistService {
  // Base API call method with enhanced error handling
  async apiCall(endpoint, options = {}) {
    try {
      console.log('Making wishlist API call to:', `${API_BASE_URL}${endpoint}`);
      
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
      
      console.log('Wishlist API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Wishlist API Error Response:', errorText);
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
      console.log('Wishlist API response data:', JSON.stringify(data, null, 2));
      
      return data;
    } catch (error) {
      console.error('Wishlist API Error:', {
        endpoint,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get user's wishlist
  async getWishlist() {
    try {
      return await this.apiCall('/wishlist');
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { success: false, wishlistItems: [], error: error.message };
    }
  }

  // Add item to wishlist
  async addToWishlist(item) {
    try {
      const wishlistItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        collection: item.collection,
        description: item.description,
        selectedSize: item.selectedSize || null
      };

      return await this.apiCall('/wishlist/add', {
        method: 'POST',
        body: JSON.stringify(wishlistItem)
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(id, selectedSize = null) {
    try {
      const queryParams = selectedSize ? `?selectedSize=${encodeURIComponent(selectedSize)}` : '';
      return await this.apiCall(`/wishlist/remove/${id}${queryParams}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear entire wishlist
  async clearWishlist() {
    try {
      return await this.apiCall('/wishlist/clear', {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, error: error.message };
    }
  }

  // Move item from wishlist to cart
  async moveToCart(id, selectedSize = null, quantity = 1) {
    try {
      const requestBody = {
        quantity
      };
      
      if (selectedSize) {
        requestBody.selectedSize = selectedSize;
      }

      return await this.apiCall(`/wishlist/move-to-cart/${id}`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      console.error('Error moving item to cart:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if item is in wishlist
  async checkWishlistStatus(id, selectedSize = null) {
    try {
      const queryParams = selectedSize ? `?selectedSize=${encodeURIComponent(selectedSize)}` : '';
      return await this.apiCall(`/wishlist/status/${id}${queryParams}`);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return { success: false, inWishlist: false, error: error.message };
    }
  }

  // Toggle wishlist status (add if not present, remove if present)
  async toggleWishlist(item) {
    try {
      const statusCheck = await this.checkWishlistStatus(item.id, item.selectedSize);
      
      if (statusCheck.inWishlist) {
        return await this.removeFromWishlist(item.id, item.selectedSize);
      } else {
        return await this.addToWishlist(item);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new WishlistService();