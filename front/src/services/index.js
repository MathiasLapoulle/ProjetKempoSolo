// Export all API services for easy importing
export { authAPI, tournamentAPI, competitorAPI, matchAPI } from './api';
export { default as tournamentService } from './tournamentService';
export { default as matchService } from './matchService';

// You can also create additional services for:
// - competitorService for competitor management
// - categoryService for category management  
// - weightCategoryService for weight category management
// - ageGroupService for age group management

// Utility function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data?.message || error.response.data?.error || 'Une erreur est survenue';
  } else if (error.request) {
    // The request was made but no response was received
    return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'Une erreur inattendue est survenue';
  }
};

// Base URL configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
    GET_PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password'
  },
  
  // Tournament endpoints
  TOURNAMENTS: {
    GET_ALL: '/tournaments',
    GET_BY_ID: (id) => `/tournaments/${id}`,
    CREATE: '/tournaments',
    UPDATE: (id) => `/tournaments/${id}`,
    DELETE: (id) => `/tournaments/${id}`,
    REGISTER: (id) => `/tournaments/${id}/register`,
    PARTICIPANTS: (id) => `/tournaments/${id}/participants`
  },
  
  // Match endpoints
  MATCHES: {
    GET_BY_TOURNAMENT: (tournamentId) => `/matches/tournament/${tournamentId}`,
    GET_BY_ID: (id) => `/matches/${id}`,
    UPDATE_SCORE: (id) => `/matches/${id}`,
    START: (id) => `/matches/${id}/start`,
    END: (id) => `/matches/${id}/end`,
    ONGOING: '/matches/ongoing',
    GENERATE_BRACKET: (tournamentId, categoryId) => `/tournaments/${tournamentId}/categories/${categoryId}/bracket`
  },
  
  // Competitor endpoints
  COMPETITORS: {
    GET_ALL: '/competitors',
    CREATE: '/competitors',
    GET_BY_ID: (id) => `/competitors/${id}`,
    UPDATE: (id) => `/competitors/${id}`,
    DELETE: (id) => `/competitors/${id}`
  },
  
  // Category endpoints
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_TOURNAMENT: (tournamentId) => `/tournaments/${tournamentId}/categories`
  },
  
  // Age Group endpoints
  AGE_GROUPS: {
    GET_ALL: '/age-groups'
  },
  
  // Weight Category endpoints
  WEIGHT_CATEGORIES: {
    GET_ALL: '/weight-categories'
  }
};

export default {
  authAPI,
  tournamentService,
  matchService,
  handleApiError,
  API_BASE_URL,
  API_ENDPOINTS
};
