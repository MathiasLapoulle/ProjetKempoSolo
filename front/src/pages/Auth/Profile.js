import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    club: '',
    city: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { user, userRole, updateProfile, changePassword, isAuthenticated } = useAuth();
  
  // État pour le formulaire de création d'admin
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    club: '',
    city: '',
    password: '',
    confirmPassword: ''
  });
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Utiliser les données utilisateur du contexte
    if (user) {
      setUserData(user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        club: user.club || '',
        city: user.city || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAdminFormChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      // Validation du mot de passe si modification demandée
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Les nouveaux mots de passe ne correspondent pas');
          return;
        }
        
        if (!formData.currentPassword) {
          setError('Veuillez saisir votre mot de passe actuel');
          return;
        }
        
        // Changer le mot de passe séparément
        const passwordResult = await changePassword(formData.currentPassword, formData.newPassword);
        if (!passwordResult.success) {
          setError(passwordResult.error);
          return;
        }
      }
      
      // Préparer les données à envoyer pour le profil
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        club: formData.club,
        city: formData.city
      };
      
      // Mettre à jour le profil
      const profileResult = await updateProfile(dataToSend);
      
      if (profileResult.success) {
        setUserData(profileResult.user);
        
        // Réinitialiser les champs de mot de passe
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setSuccessMessage('Profil mis à jour avec succès');
        setEditMode(false);
      } else {
        setError(profileResult.error || 'Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    }
  };
  
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminFormError('');
    setAdminFormSuccess('');
    
    // Vérifications des champs
    if (adminFormData.password !== adminFormData.confirmPassword) {
      setAdminFormError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (!adminFormData.club) {
      setAdminFormError('Le club est obligatoire');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/users/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: adminFormData.firstName,
          lastName: adminFormData.lastName,
          email: adminFormData.email,
          birthDate: adminFormData.birthDate,
          club: adminFormData.club,
          city: adminFormData.city,
          password: adminFormData.password,
          role: 'admin'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du compte administrateur');
      }
      
      // Réinitialiser le formulaire
      setAdminFormData({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        club: '',
        city: '',
        password: '',
        confirmPassword: ''
      });
      
      setAdminFormSuccess('Compte administrateur créé avec succès');
      setTimeout(() => {
        setShowAdminForm(false);
        setAdminFormSuccess('');
      }, 3000);
      
    } catch (err) {
      setAdminFormError(err.message || 'Erreur lors de la création du compte administrateur');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Chargement du profil...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card profile-card">
        <h2>Mon Profil</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        {editMode ? (
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
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="club">Club (optionnel)</label>
                <input
                  type="text"
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <h3>Changer le mot de passe (optionnel)</h3>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength={formData.newPassword ? "8" : ""}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="button-row">
              <button type="submit" className="auth-button">
                Enregistrer les modifications
              </button>
              <button type="button" className="auth-button secondary" onClick={() => setEditMode(false)}>
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Prénom:</span>
              <span className="info-value">{userData?.firstName}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Nom:</span>
              <span className="info-value">{userData?.lastName}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData?.email}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Date de naissance:</span>
              <span className="info-value">{new Date(userData?.birthDate).toLocaleDateString()}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Club:</span>
              <span className="info-value">{userData?.club || 'Non renseigné'}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Ville:</span>
              <span className="info-value">{userData?.city}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Rôle:</span>
              <span className="info-value info-role">{userData?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
            </div>
            
            <div className="button-row">
              <button className="auth-button" onClick={() => setEditMode(true)}>
                Modifier le profil
              </button>
              <button className="auth-button danger" onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
            
            {userRole === 'admin' && (
              <div className="admin-section">
                <div className="admin-header">
                  <h3>Administration</h3>
                  <button 
                    className="auth-button admin-button" 
                    onClick={() => setShowAdminForm(!showAdminForm)}
                  >
                    {showAdminForm ? 'Annuler' : 'Créer un compte administrateur'}
                  </button>
                </div>
                
                {showAdminForm && (
                  <div className="admin-form-container">
                    <h3>Création d'un compte administrateur</h3>
                    
                    {adminFormError && <div className="error-message">{adminFormError}</div>}
                    {adminFormSuccess && <div className="success-message">{adminFormSuccess}</div>}
                    
                    <form onSubmit={handleCreateAdmin} className="auth-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="adminFirstName">Prénom</label>
                          <input
                            type="text"
                            id="adminFirstName"
                            name="firstName"
                            value={adminFormData.firstName}
                            onChange={handleAdminFormChange}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="adminLastName">Nom</label>
                          <input
                            type="text"
                            id="adminLastName"
                            name="lastName"
                            value={adminFormData.lastName}
                            onChange={handleAdminFormChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="adminEmail">Email</label>
                        <input
                          type="email"
                          id="adminEmail"
                          name="email"
                          value={adminFormData.email}
                          onChange={handleAdminFormChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="adminBirthDate">Date de naissance</label>
                        <input
                          type="date"
                          id="adminBirthDate"
                          name="birthDate"
                          value={adminFormData.birthDate}
                          onChange={handleAdminFormChange}
                          required
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="adminClub">Club</label>
                          <input
                            type="text"
                            id="adminClub"
                            name="club"
                            value={adminFormData.club}
                            onChange={handleAdminFormChange}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="adminCity">Ville</label>
                          <input
                            type="text"
                            id="adminCity"
                            name="city"
                            value={adminFormData.city}
                            onChange={handleAdminFormChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="adminPassword">Mot de passe</label>
                          <input
                            type="password"
                            id="adminPassword"
                            name="password"
                            value={adminFormData.password}
                            onChange={handleAdminFormChange}
                            required
                            minLength="8"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="adminConfirmPassword">Confirmer le mot de passe</label>
                          <input
                            type="password"
                            id="adminConfirmPassword"
                            name="confirmPassword"
                            value={adminFormData.confirmPassword}
                            onChange={handleAdminFormChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <button type="submit" className="auth-button">
                        Créer le compte administrateur
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;