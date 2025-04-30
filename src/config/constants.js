// src/config/constants.js

// TODO: Use environment variables for BASE_URL
export const API = {
  // Assuming backend gateway runs on port 8000 locally
  BASE_URL: 'https://aldaleelapp-mcp.onrender.com/api',
    TIMEOUT: 120000, // 2 minutes to account for cold start
};

export const SPECIAL_REQUIREMENTS = [
  { label: 'Halal Food Required', value: 'halal' },
  { label: 'Wheelchair Accessible', value: 'wheelchair' },
  { label: 'Kid-Friendly', value: 'kidFriendly' },
  { label: 'Pet-Friendly', value: 'petFriendly' },
];

export const TRANSPORTATION_OPTIONS = [
  { label: 'Public Transport', value: 'publicTransport' },
  { label: 'Private Car', value: 'privateCar' },
  { label: 'Walking/Biking', value: 'walkingBiking' },
  { label: 'Mix of all', value: 'mix' },
];

export const ENDPOINTS = {
  // Note: These need to match the actual backend routes
  VISA_REQUIREMENTS: '/proxy/visa-requirements', // Matches proxyRoutes.js
  CULTURE_INSIGHTS: '/proxy/culture-insights', // Matches proxyRoutes.js
  CURRENCY_INFO: '/proxy/currency-info', // New endpoint for currency information
  HEALTH_INFO: '/proxy/health-info', // New endpoint for health information
  TRANSPORTATION_INFO: '/proxy/transportation-info', // New endpoint for transportation information
  LANGUAGE_INFO: '/proxy/language-info', // New endpoint for language information
  GENERATE: '/trips/generate', // Matches tripRoutes.js
  EVENTS: '/events', // Matches eventRoutes.js mounted directly under /api
  TRIPS: '/trips', // Matches tripRoutes.js mounted under /api
};