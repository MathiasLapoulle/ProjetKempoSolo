import axios from 'axios';
import { apiConfig } from '../config/api.js';

// API configuration and base URL
const API_BASE_URL = apiConfig.baseURL;

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'inscription'
      };
    }
  },
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la connexion'
      };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du profil'
      };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la demande de réinitialisation'
      };
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/users/reset-password', { token, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe'
      };
    }
  }
};

// Tournament API calls
export const tournamentAPI = {
  // Get all tournaments
  getAllTournaments: async () => {
    try {
      const response = await api.get('/tournaments');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des tournois'
      };
    }
  },

  // Get tournament by ID
  getTournamentById: async (id) => {
    try {
      const response = await api.get(`/tournaments/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du tournoi'
      };
    }
  },

  // Create new tournament
  createTournament: async (tournamentData) => {
    try {
      const response = await api.post('/tournaments', tournamentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du tournoi'
      };
    }
  },
  // Update tournament
  updateTournament: async (id, tournamentData) => {
    try {
      const response = await api.put(`/tournaments/${id}`, tournamentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du tournoi'
      };
    }
  },

  // Delete tournament
  deleteTournament: async (id) => {
    try {
      const response = await api.delete(`/tournaments/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du tournoi'
      };
    }
  }
};

// Competitors API calls
export const competitorAPI = {
  // Get all competitors
  getAllCompetitors: async () => {
    try {
      const response = await api.get('/competitors');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des compétiteurs'
      };
    }
  },

  // Get competitor by ID
  getCompetitorById: async (id) => {
    try {
      const response = await api.get(`/competitors/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du compétiteur'
      };
    }
  },

  // Create new competitor
  createCompetitor: async (competitorData) => {
    try {
      const response = await api.post('/competitors', competitorData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du compétiteur'
      };
    }
  },

  // Update competitor
  updateCompetitor: async (id, competitorData) => {
    try {
      const response = await api.put(`/competitors/${id}`, competitorData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du compétiteur'
      };
    }
  },

  // Delete competitor
  deleteCompetitor: async (id) => {
    try {
      const response = await api.delete(`/competitors/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du compétiteur'
      };
    }
  },

  // Import competitors from CSV
  importCompetitorsCSV: async (csvData) => {
    try {
      const response = await api.post('/competitors/import-csv', csvData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'importation CSV'
      };
    }
  },

  // Get competitors by category
  getCompetitorsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/competitors/category/${categoryId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des compétiteurs par catégorie'
      };
    }
  }
};

// Matches API calls
export const matchAPI = {
  // Get matches for a tournament
  getTournamentMatches: async (tournamentId) => {
    try {
      const response = await api.get(`/matches/tournament/${tournamentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des matchs'
      };
    }
  },

  // Update match score
  updateMatchScore: async (matchId, scoreData) => {
    try {
      const response = await api.put(`/matches/${matchId}`, scoreData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du score'
      };
    }
  }
};

// Ranks API calls
export const ranksAPI = {
  // Get all ranks
  getAllRanks: async () => {
    try {
      const response = await api.get('/ranks');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des grades'
      };
    }
  }
};

// Age Groups API calls
export const ageGroupsAPI = {
  // Get all age groups
  getAllAgeGroups: async () => {
    try {
      const response = await api.get('/age-groups');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des catégories d\'âge'
      };
    }
  }
};

// Weight Categories API calls
export const weightCategoriesAPI = {
  // Get all weight categories
  getAllWeightCategories: async () => {
    try {
      const response = await api.get('/weight-categories');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des catégories de poids'
      };
    }
  }
};

export default api;
