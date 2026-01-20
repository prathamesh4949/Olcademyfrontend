import axios from 'axios';
import { USER_API_END_POINT } from '@/api/constant';

// Fetch saved shipment details for the authenticated user
export const getShipment = async () => {
  try {
    const response = await axios.get(`${USER_API_END_POINT}/shipment`);
    if (response.data?.success) {
      // Prefer explicit shipment field; fallback to user.shipment
      const data = response.data.shipment ?? response.data.user?.shipment ?? null;
      if (!data) return null;
      // Normalize to array since backend now stores an array
      return Array.isArray(data) ? data : [data];
    }
    return null;
  } catch (error) {
    // If endpoint not available, try localStorage fallback
    if (error.response?.status === 404) {
      try {
        const userStr = localStorage.getItem('user');
        const email = userStr ? JSON.parse(userStr).email : null;
        if (!email) return null;
        const raw = localStorage.getItem(`savedShipment:${email}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : null);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
};

// Save shipment details for the authenticated user
export const saveShipment = async (shipment) => {
  try {
    // Always send an array to backend
    const shipmentArray = Array.isArray(shipment) ? shipment : [shipment];
    const response = await axios.put(`${USER_API_END_POINT}/shipment`, { shipment: shipmentArray });
    if (response.data?.success) {
      const returned = response.data.shipment ?? shipmentArray;
      return { success: true, shipment: Array.isArray(returned) ? returned : [returned], message: response.data.message || 'Address saved' };
    }
    return { success: false, message: response.data?.message || 'Failed to save address' };
  } catch (error) {
    // If endpoint not available, store to localStorage as a fallback so UI remains usable in dev
    if (error.response?.status === 404) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const { email } = JSON.parse(userStr);
          const shipmentArray = Array.isArray(shipment) ? shipment : [shipment];
          localStorage.setItem(`savedShipment:${email}`, JSON.stringify(shipmentArray));
          return { success: true, shipment: shipmentArray, message: 'Saved locally (dev fallback)' };
        }
      } catch (_) {
        // ignore
      }
    }
    return { success: false, message: error.response?.data?.message || error.message || 'Failed to save address' };
  }
};
