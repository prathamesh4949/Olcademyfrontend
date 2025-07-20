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
import { CartProvider } from './CartContext';
import { Toaster } from 'react-hot-toast';
import { WishlistProvider } from './WishlistContext';
import VerifyEmail from './components/common/VerifyEmail';
import Login from './components/common/Login';

const AppRoutes = ({ darkMode, setDarkMode }) => {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/universal-collection" element={<UniversalCollection />} />
            <Route path="/mens-collection" element={<MensCollection />} />
            <Route path="/womens-collection" element={<Womenscollection />} />
            <Route path="/all-fragrances" element={<AllFragrancesSection />} />
            <Route path="/product-cart" element={<ProductCartSection />} />
            <Route path="/Checkout" element={<Checkout darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/unisex-collection" element={<UnisexCollection />} />
            <Route path="/gift-collection" element={<GiftCollection />} />
            <Route path="/wishlist-collection" element={<Wishlist />} />
            <Route path="/product-perfume" element={<ProductPage />} />
            <Route path="/login" element={<Login isOpen={true} onClose={() => window.history.back()} />} />
          </Routes>
        </WishlistProvider>
        <Toaster position="top-center" />
      </CartProvider>
    </Router>
  ); 
};

export default AppRoutes;