import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les composants enfants à rendre si l'accès est autorisé
 * @param {Array<string>} [props.allowedRoles] - Les rôles autorisés à accéder à cette route
 * @param {string} [props.redirectTo] - Le chemin de redirection en cas d'accès non autorisé
 * @returns {React.ReactElement} Le composant rendu
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login'
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  // Montre un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Vérifie si l'utilisateur est connecté
  if (!isAuthenticated) {
    // Redirige vers la page de connexion, en stockant l'URL actuelle pour rediriger après connexion
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si des rôles spécifiques sont requis, vérifie que l'utilisateur a le bon rôle
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirige vers la page d'accueil ou une page d'accès refusé
    return <Navigate to="/" replace />;
  }

  // Si toutes les vérifications sont passées, rend le contenu protégé
  return children;
};

export default ProtectedRoute;