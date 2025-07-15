import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

// Liste des principales villes françaises (par ordre alphabétique)
const frenchCities = [
  "Aix-en-Provence", "Ajaccio", "Amiens", "Angers", "Annecy", "Antibes", "Argenteuil", "Asnières-sur-Seine", "Aubervilliers",
  "Avignon", "Bayonne", "Besançon", "Bordeaux", "Boulogne-Billancourt", "Bourges", "Brest", "Caen", "Cannes", "Chalon-sur-Saône", 
  "Chambéry", "Chartres", "Clermont-Ferrand", "Colmar", "Dijon", "Dunkerque", "Grenoble", "Hyères", "La Rochelle", "La Roche-sur-Yon", 
  "Le Havre", "Le Mans", "Lille", "Limoges", "Lyon", "Marseille", "Metz", "Montpellier", "Mulhouse", "Nancy", "Nantes", 
  "Nice", "Nîmes", "Orléans", "Paris", "Pau", "Perpignan", "Poitiers", "Reims", "Rennes", "Rouen", "Saint-Étienne", 
  "Saint-Malo", "Saint-Nazaire", "Strasbourg", "Toulon", "Toulouse", "Tours", "Troyes", "Valence", "Versailles"
].sort();

// Règles pour un mot de passe fort
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  needsUppercase: true,
  needsLowercase: true,
  needsNumber: true,
  needsSpecial: true
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    club: '',
    city: '',
    otherCity: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtherCityInput, setShowOtherCityInput] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [navigate, isAuthenticated]);
  // Fonction pour valider la complexité du mot de passe
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(`Au moins ${PASSWORD_REQUIREMENTS.minLength} caractères`);
    }
    if (PASSWORD_REQUIREMENTS.needsUppercase && !/[A-Z]/.test(password)) {
      errors.push("Au moins une majuscule");
    }
    if (PASSWORD_REQUIREMENTS.needsLowercase && !/[a-z]/.test(password)) {
      errors.push("Au moins une minuscule");
    }
    if (PASSWORD_REQUIREMENTS.needsNumber && !/[0-9]/.test(password)) {
      errors.push("Au moins un chiffre");
    }
    if (PASSWORD_REQUIREMENTS.needsSpecial && !/[^A-Za-z0-9]/.test(password)) {
      errors.push("Au moins un caractère spécial");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
      setShowOtherCityInput(value === 'Autre');
    }
    
    // Validation du mot de passe en temps réel
    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
      // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    
    // Vérifier la complexité du mot de passe
    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setError('Le mot de passe ne respecte pas les exigences de sécurité');
      setPasswordErrors(passwordValidationErrors);
      setLoading(false);
      return;
    }
    
    // Vérifier l'âge minimum (13 ans)
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      setError("Vous devez avoir au moins 13 ans pour vous inscrire");
      setLoading(false);
      return;
    }
    
    try {      // Préparer les données pour l'API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        birthDate: formData.birthDate,
        club: formData.club, // obligatoire
        city: formData.city === 'Autre' ? formData.otherCity : formData.city,
        password: formData.password
      };
      
      const result = await register(userData);
      
      if (result.success) {
        // Rediriger vers la page de connexion avec un message de succès
        navigate('/login', { 
          state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' }
        });
      } else {
        setError(result.error || "Une erreur s'est produite lors de l'inscription");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de l'inscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Inscription</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate">Date de naissance</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="club">Club</label>
              <input
                type="text"
                id="club"
                name="club"
                value={formData.club}
                onChange={handleChange}
                required
              />
            </div>            <div className="form-group">
              <label htmlFor="city">Ville</label>              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une ville</option>
                {frenchCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value="Autre">Autre</option>
              </select>
              
              {showOtherCityInput && (
                <input
                  type="text"
                  id="otherCity"
                  name="otherCity"
                  value={formData.otherCity}
                  onChange={handleChange}
                  placeholder="Précisez votre ville"
                  required
                  style={{ 
                    marginTop: '8px',
                    width: '100%',
                  }}
                />
              )}
            </div>
          </div>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              {passwordErrors.length > 0 && (
                <div className="password-requirements">
                  <p>Le mot de passe doit contenir:</p>
                  <ul>
                    {passwordErrors.map((error, index) => (
                      <li key={index} className="password-requirement-item">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Vous avez déjà un compte ?{' '}
            <span className="auth-link" onClick={() => navigate('/login')}>
              Se connecter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;