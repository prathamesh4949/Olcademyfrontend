import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UniversalCollection from './pages/UniversalCollection';
import MensCollection from './pages/Men/MensCollection';
import Womenscollection from './pages/Page2/Womens';
import AllFragrancesSection from './pages/AllFregrances';
import ProductCartSection from './pages/ProductCartSection';
import Checkout from './pages/Checkout';
import HomePage from './pages/Home';
import UnisexCollection from './pages/UnisexCollection';
import GiftCollection from './pages/GiftCollection';
import Wishlist from './components/common/Wishlist';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import TrendingCollection from './pages/TrendingCollection';
import BestSellersCollection from './pages/BestSellersCollection';
import WomensSignatureCollection from './pages/WomensSignatureCollection';
import RoseGardenEssenceCollection from './pages/RoseGardenEssenceCollection';
import MensSignatureCollection from './pages/MensSignatureCollection';
import OrangeMarmaladeCollection from './pages/OrangeMarmaladeCollection';
// Unisex collection pages
import GenderFreeFragranceCollection from './pages/GenderFreeFragranceCollection';
import ScentsWithoutLimitsCollection from './pages/ScentsWithoutLimitsCollection';
// NEW: Import the new gift collection pages
import PerfectDiscoverGiftsCollection from './pages/PerfectDiscoverGiftsCollection';
import PerfectGiftsPremiumCollection from './pages/PerfectGiftsPremiumCollection';
import PerfectGiftsLuxuryCollection from './pages/PerfectGiftsLuxuryCollection';
import HomeDecorGiftsCollection from './pages/HomeDecorGiftsCollection';

import { CartProvider } from './CartContext';
import { Toaster } from 'react-hot-toast';
import { WishlistProvider } from './WishlistContext';
import { AuthProvider } from './context/AuthContext';
import VerifyEmail from './components/common/VerifyEmail';
import Login from './components/common/Login';
import AdminPanel from './components/admin/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Orders from './components/Orders';
import SearchResults from './pages/SearchResults';

const AppRoutes = ({ darkMode, setDarkMode }) => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} />} 
              />
              <Route path="/universal-collection" element={<UniversalCollection />} />
              <Route path="/mens-collection" element={<MensCollection />} />
              <Route path="/womens-collection" element={<Womenscollection />} />
              <Route path="/all-fragrances" element={<AllFragrancesSection />} />
              <Route path="/unisex-collection" element={<UnisexCollection />} />
              <Route path="/gift-collection" element={<GiftCollection />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Collection Routes */}
              <Route path="/trending-collection" element={<TrendingCollection />} />
              <Route path="/best-sellers-collection" element={<BestSellersCollection />} />
              
              {/* Women's Collection Routes */}
              <Route path="/womens-signature-collection" element={<WomensSignatureCollection />} />
              <Route path="/rose-garden-essence-collection" element={<RoseGardenEssenceCollection />} />
              
              {/* Men's Collection Routes */}
              <Route path="/mens-signature-collection" element={<MensSignatureCollection />} />
              <Route path="/orange-marmalade-collection" element={<OrangeMarmaladeCollection />} />
              
              {/* Unisex Collection Routes */}
              <Route path="/gender-free-fragrance-collection" element={<GenderFreeFragranceCollection />} />
              <Route path="/scents-without-limits-collection" element={<ScentsWithoutLimitsCollection />} />
              
              {/* NEW: Gift Collection Routes */}
              <Route path="/perfect-discover-gifts-collection" element={<PerfectDiscoverGiftsCollection />} />
              <Route path="/perfect-gifts-premium-collection" element={<PerfectGiftsPremiumCollection />} />
              <Route path="/perfect-gifts-luxury-collection" element={<PerfectGiftsLuxuryCollection />} />
              <Route path="/home-decor-gifts-collection" element={<HomeDecorGiftsCollection />} />
              
              {/* IMPORTANT: Static routes BEFORE dynamic routes */}
              <Route path="/product-perfume" element={<ProductPage />} />
              
              {/* Dynamic product route - MUST come after static routes */}
              <Route path="/product/:id" element={<ProductDetailPage />} />
              {/* Dynamic scent route for new collection items */}
              <Route path="/scent/:id" element={<ProductDetailPage />} />
              
              {/* Authentication Routes */}
              <Route 
                path="/login" 
                element={<Login isOpen={true} onClose={() => window.history.back()} />} 
              />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/product-cart" 
                element={
                  <ProtectedRoute>
                    <ProductCartSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout darkMode={darkMode} setDarkMode={setDarkMode} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wishlist-collection" 
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders darkMode={darkMode} setDarkMode={setDarkMode} />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Only Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/panel" 
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } 
              />
              
              {/* Catch all route - 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-block bg-gradient-to-r from-[#79300f] to-[#b14527] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default AppRoutes;