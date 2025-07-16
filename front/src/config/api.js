// Configuration API pour les URLs dynamiques
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:4000',
    timeout: 5000,
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://kempo-backend.onrender.com',
    timeout: 10000,
  }
};

const environment = process.env.NODE_ENV || 'development';
const config = API_CONFIG[environment];

export const apiConfig = {
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Fonction pour construire les URLs d'API
export const buildApiUrl = (endpoint) => {
  return `${config.baseURL}${endpoint}`;
};

// Fonction pour vérifier la santé de l'API
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${config.baseURL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API Health check failed:', error);
    return false;
  }
};

export default apiConfig;
