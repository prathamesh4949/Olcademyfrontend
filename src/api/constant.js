//src/api/constant.js

const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
    (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1');

const PRODUCTION_BASE_URL = "https://olcademybackend.vercel.app";
const DEVELOPMENT_BASE_URL = "http://localhost:8000";

export const API_BASE_URL = isDevelopment ? DEVELOPMENT_BASE_URL : PRODUCTION_BASE_URL;
// export const API_BASE_URL = PRODUCTION_BASE_URL;

// API Endpoints
export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const ORDER_API_END_POINT = `${API_BASE_URL}/order`;
export const CART_API_END_POINT = `${API_BASE_URL}/cart`;
export const WISHLIST_API_END_POINT = `${API_BASE_URL}/wishlist`;
export const PRODUCT_API_END_POINT = `${API_BASE_URL}/api/products`;
export const SCENT_API_END_POINT = `${API_BASE_URL}/api/scents`;  // Scents endpoint
export const BANNER_API_END_POINT = `${API_BASE_URL}/api/banners`;

// Frontend URL
export const FRONTEND_URL = isDevelopment
    ? "http://localhost:4028"
    : "https://olcademyfrontend.vercel.app";

// API Response Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// Collection Types
export const COLLECTIONS = {
    JUST_ARRIVED: 'just-arrived',
    BEST_SELLERS: 'best-sellers',
    HUNTSMAN_SAVILE_ROW: 'huntsman-savile-row',
    PREMIUM: 'premium',
    
    // Scent Collections
    TRENDING: 'trending',
    BEST_SELLER: 'best-seller',
    SIGNATURE: 'signature',
    LIMITED_EDITION: 'limited-edition',
    
    // Women's Collections
    WOMENS_SIGNATURE: 'signature',
    ROSE_GARDEN_ESSENCE: 'rose-garden-essence',
    
    // Men's Collections
    MENS_SIGNATURE: 'mens-signature',
    ORANGE_MARMALADE: 'orange-marmalade',
    
    // Unisex Collections
    GENDER_FREE: 'gender-free',
    LIMITLESS: 'limitless',
    
    // NEW: Gift Collections
    PERFECT_DISCOVER_GIFTS: 'perfect-discover-gifts',
    PERFECT_GIFTS_PREMIUM: 'perfect-gifts-premium',
    PERFECT_GIFTS_LUXURY: 'perfect-gifts-luxury',
    HOME_DECOR_GIFTS: 'home-decor-gifts'
};

// Categories
export const CATEGORIES = {
    WOMEN: 'women',
    MEN: 'men',
    UNISEX: 'unisex',
    HOME: 'home',
    SUMMER: 'summer'
};

// Scent Families
export const SCENT_FAMILIES = {
    FLORAL: 'floral',
    WOODY: 'woody',
    CITRUS: 'citrus',
    ORIENTAL: 'oriental',
    FRESH: 'fresh',
    SPICY: 'spicy',
    FRUITY: 'fruity'
};

// Scent Intensities
export const SCENT_INTENSITIES = {
    LIGHT: 'light',
    MODERATE: 'moderate',
    STRONG: 'strong'
};

// Longevity Options
export const LONGEVITY_OPTIONS = {
    SHORT: '2-4 hours',
    MEDIUM: '4-6 hours',
    LONG: '6-8 hours',
    VERY_LONG: '8+ hours'
};

// Navigation paths
export const NAVIGATION_PATHS = {
    HOME: '/',
    TRENDING_COLLECTION: '/trending-collection',
    BEST_SELLERS_COLLECTION: '/best-sellers-collection',
    UNIVERSAL_COLLECTION: '/universal-collection',
    MENS_COLLECTION: '/mens-collection',
    WOMENS_COLLECTION: '/womens-collection',
    UNISEX_COLLECTION: '/unisex-collection',
    GIFT_COLLECTION: '/gift-collection',
    ALL_FRAGRANCES: '/all-fragrances',
    
    // Women's Collection Paths
    WOMENS_SIGNATURE_COLLECTION: '/womens-signature-collection',
    ROSE_GARDEN_ESSENCE_COLLECTION: '/rose-garden-essence-collection',
    
    // Men's Collection Paths
    MENS_SIGNATURE_COLLECTION: '/mens-signature-collection',
    ORANGE_MARMALADE_COLLECTION: '/orange-marmalade-collection',
    
    // Unisex Collection Paths
    GENDER_FREE_FRAGRANCE_COLLECTION: '/gender-free-fragrance-collection',
    SCENTS_WITHOUT_LIMITS_COLLECTION: '/scents-without-limits-collection',
    
    // NEW: Gift Collection Paths
    PERFECT_DISCOVER_GIFTS_COLLECTION: '/perfect-discover-gifts-collection',
    PERFECT_GIFTS_PREMIUM_COLLECTION: '/perfect-gifts-premium-collection',
    PERFECT_GIFTS_LUXURY_COLLECTION: '/perfect-gifts-luxury-collection',
    HOME_DECOR_GIFTS_COLLECTION: '/home-decor-gifts-collection',
    
    // Other paths
    CART: '/product-cart',
    WISHLIST: '/wishlist-collection',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    SEARCH: '/search'
};