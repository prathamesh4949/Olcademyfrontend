// Check if we're in development environment
const isDevelopment = 
  process.env.NODE_ENV === 'development' || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
  (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1');

// Base URLs
const PRODUCTION_BASE_URL = "https://olcademybackend.vercel.app";
const DEVELOPMENT_BASE_URL = "http://localhost:8000";

// Select base URL based on environment
const BASE_URL = isDevelopment ? DEVELOPMENT_BASE_URL : PRODUCTION_BASE_URL;

// API Endpoints
export const USER_API_END_POINT = `${BASE_URL}/user`;

// You can add more API endpoints here as needed
// export const COURSE_API_END_POINT = `${BASE_URL}/course`;
// export const AUTH_API_END_POINT = `${BASE_URL}/auth`;

// Frontend URL (if needed in constants)
export const FRONTEND_URL = isDevelopment 
  ? "http://localhost:4028" 
  : "https://olcademyfrontend.vercel.app";

// Export base URL if needed elsewhere
export const API_BASE_URL = BASE_URL;

