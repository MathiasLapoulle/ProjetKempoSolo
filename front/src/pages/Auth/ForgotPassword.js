import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Une erreur s'est produite lors de l'envoi de l'email");
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      setError("Une erreur s'est produite lors de l'envoi de l'email");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Mot de passe oublié</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {success ? (
          <div className="success-container">
            <div className="success-message">
              Un email a été envoyé à {email} avec les instructions pour réinitialiser votre mot de passe.
            </div>
            <p>Veuillez vérifier votre boîte de réception et suivre les instructions.</p>
            <p>
              <button className="auth-button" onClick={() => navigate('/login')}>
                Retour à la connexion
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrez votre email"
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
            
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
