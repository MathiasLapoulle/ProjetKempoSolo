import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // État pour suivre si l'utilisateur est connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // État pour stocker les données de l'utilisateur
  const [user, setUser] = useState(null);
  
  // État pour le rôle de l'utilisateur ('user', 'admin', etc.)
  const [userRole, setUserRole] = useState(null);
  
  // État de chargement pour les opérations asynchrones
  const [loading, setLoading] = useState(true);

  // Vérifie le token au chargement initial
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const result = await authAPI.getCurrentUser();
        
        if (result.success) {
          setUser(result.data);
          setUserRole(result.data.role);
          setIsAuthenticated(true);
        } else {
          // Token invalide
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkToken();
  }, []);

  // Fonction pour connecter l'utilisateur
  const login = async (email, password) => {
    try {
      const result = await authAPI.login(email, password);
      
      if (result.success) {
        const { token, user } = result.data;
        
        // Stocke le token dans le localStorage
        localStorage.setItem('token', token);
        
        // Met à jour l'état
        setUser(user);
        setUserRole(user.role);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Une erreur inattendue est survenue'
      };
    }
  };

  // Fonction pour inscrire un nouvel utilisateur
  const register = async (userData) => {
    try {
      const result = await authAPI.register(userData);
      
      if (result.success) {
        const { token, user } = result.data;
        
        // Stocke le token dans le localStorage si fourni
        if (token) {
          localStorage.setItem('token', token);
          setUser(user);
          setUserRole(user.role);
          setIsAuthenticated(true);
        }
        
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Une erreur inattendue est survenue lors de l\'inscription'
      };
    }
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    // Supprime le token du localStorage
    localStorage.removeItem('token');
    
    // Réinitialise l'état
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  // Fonction pour mettre à jour le profil de l'utilisateur
  const updateProfile = async (userData) => {
    try {
      const result = await authAPI.updateProfile(userData);
      
      if (result.success) {
        // Met à jour l'état de l'utilisateur
        setUser(result.data);
        return { success: true, user: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: 'Erreur lors de la mise à jour du profil'
      };
    }
  };

  // Fonction pour changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await authAPI.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: 'Erreur lors du changement de mot de passe'
      };
    }
  };

  // Fonction pour demander une réinitialisation de mot de passe
  const forgotPassword = async (email) => {
    try {
      const result = await authAPI.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: 'Erreur lors de la demande de réinitialisation'
      };
    }
  };

  // Fonction pour réinitialiser le mot de passe
  const resetPassword = async (token, password) => {
    try {
      const result = await authAPI.resetPassword(token, password);
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: 'Erreur lors de la réinitialisation du mot de passe'
      };
    }
  };

  // Valeur du contexte à fournir
  const value = {
    isAuthenticated,
    user,
    userRole,
    loading,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;