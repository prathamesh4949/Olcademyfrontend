// api/constants.js
const isDevelopment = 
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
    (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1');

const PRODUCTION_BASE_URL = "https://olcademybackend.vercel.app";
const DEVELOPMENT_BASE_URL = "http://localhost:8000";

export const API_BASE_URL = isDevelopment ? DEVELOPMENT_BASE_URL : PRODUCTION_BASE_URL;

// API Endpoints
export const USER_API_END_POINT = `${API_BASE_URL}/user`;
export const ORDER_API_END_POINT = `${API_BASE_URL}/order`;
export const PRODUCT_API_END_POINT = `${API_BASE_URL}/api/products`;

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
    PREMIUM: 'premium'
};

// Categories
export const CATEGORIES = {
    WOMEN: 'women',
    MEN: 'men',
    UNISEX: 'unisex',
    HOME: 'home',
    SUMMER: 'summer'
};