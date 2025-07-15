import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  // Vérifier la validité du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Pour l'instant, on suppose que le token est valide si les paramètres existent
        // Plus tard, vous pourrez ajouter une API pour vérifier le token
        if (userId && token) {
          setTokenValid(true);
        } else {
          setError("Le lien de réinitialisation est invalide");
        }
      } catch (err) {
        setError("Une erreur s'est produite lors de la vérification du lien");
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [userId, token]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    // Vérifier la complexité du mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setResetting(true);
    
    try {
      const result = await resetPassword(token, password);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Une erreur s'est produite lors de la réinitialisation du mot de passe");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la réinitialisation du mot de passe");
    } finally {
      setResetting(false);
    }
  };
  
  if (loading || verifying) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Réinitialisation du mot de passe</h2>
          <p>Vérification du lien de réinitialisation...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Réinitialisation du mot de passe</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {!tokenValid && !success ? (
          <div className="error-container">
            <p>
              Le lien de réinitialisation est invalide ou a expiré.
              Veuillez demander un nouveau lien de réinitialisation.
            </p>
            <button 
              className="auth-button"
              onClick={() => navigate('/forgot-password')}
            >
              Demander un nouveau lien
            </button>
          </div>
        ) : success ? (
          <div className="success-container">
            <div className="success-message">
              Votre mot de passe a été réinitialisé avec succès !
            </div>
            <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <button 
              className="auth-button"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Entrez votre nouveau mot de passe"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={resetting}
            >
              {resetting ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
