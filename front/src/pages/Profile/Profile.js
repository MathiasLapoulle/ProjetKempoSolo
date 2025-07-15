import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import styles from './Profile.module.css';

// Ajout d'un composant pour afficher et sélectionner une ceinture d'art martial
const BeltSelector = ({ value, onChange, disabled }) => {
  const beltColors = [
    { name: 'Blanche', color: '#FFFFFF', border: '#000000' },
    { name: 'Jaune', color: '#FFF44F' },
    { name: 'Orange', color: '#FF9800' },
    { name: 'Verte', color: '#4CAF50' },
    { name: 'Bleue', color: '#2196F3' },
    { name: 'Marron', color: '#795548' },
    { name: 'Noire', color: '#000000' },
    { name: 'Rouge', color: '#F44336' },
  ];

  return (
    <div className={styles.beltSelector}>
      <div className={styles.beltDisplay}>
        {beltColors.map((belt) => (
          <div 
            key={belt.name}
            className={`${styles.beltOption} ${value === belt.name ? styles.selectedBelt : ''}`}
            style={{ 
              backgroundColor: belt.color,
              borderColor: belt.border || belt.color,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.7 : 1
            }}
            onClick={() => !disabled && onChange(belt.name)}
            title={belt.name}
          />
        ))}
      </div>
      {value && <span className={styles.selectedBeltName}>{value}</span>}
    </div>
  );
};

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    nickname: '',
    displayName: '',
    club: '',
    city: '',
    weight: '',
    belt: '',
    birthDate: '',
    biography: '',
    whatsApp: '',
    telegram: '',
    website: '',
    height: '',
    weightCategory: '',
    experience: '',
    specialties: '',
    wins: 0,
    losses: 0,
    draws: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Récupérer les données du profil au chargement
  useEffect(() => {
    if (isAuthenticated && user) {
      // En mode développement, nous utilisons les données factices
      setProfileData({
        username: user.name || 'utilisateur',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        nickname: user.nickname || '',
        displayName: user.displayName || user.name || '',
        club: user.club || '',
        city: user.city || '',
        weight: user.weight || '',
        belt: user.belt || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        biography: user.biography || '',
        whatsApp: user.whatsApp || '',
        telegram: user.telegram || '',
        website: user.website || '',
        height: user.height || '',
        weightCategory: user.weightCategory || '',
        experience: user.experience || '',
        specialties: user.specialties || '',
        wins: user.wins || 0,
        losses: user.losses || 0,
        draws: user.draws || 0
      });

      // Charger l'image de profil si disponible
      if (user.profileImage) {
        setPreviewImage(user.profileImage);
      }
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      // Enregistrement des modifications du profil
      // En production, cela serait remplacé par un appel API réel
      console.log('Données du profil à sauvegarder:', profileData);
      
      // Simulation d'une requête API réussie
      setTimeout(() => {
        setMessage({ 
          text: 'Profil mis à jour avec succès!', 
          type: 'success' 
        });
        setIsEditing(false);
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMessage({ 
        text: 'Erreur lors de la mise à jour du profil.', 
        type: 'error' 
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ 
        text: 'Les nouveaux mots de passe ne correspondent pas.', 
        type: 'error' 
      });
      return;
    }

    try {
      // En production, cela serait remplacé par un appel API réel
      console.log('Changement de mot de passe:', { oldPassword, newPassword });
      
      // Simulation d'une requête API réussie
      setTimeout(() => {
        setPasswordMessage({ 
          text: 'Mot de passe modifié avec succès!', 
          type: 'success' 
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setPasswordMessage({ 
        text: 'Erreur lors du changement de mot de passe.', 
        type: 'error' 
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!profileImage) return;

    try {
      // En production, cela serait remplacé par un appel API réel
      console.log('Téléchargement de la photo:', profileImage);
      
      // Simulation d'une requête API réussie
      setTimeout(() => {
        setMessage({ 
          text: 'Photo de profil mise à jour avec succès!', 
          type: 'success' 
        });
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo:', error);
      setMessage({ 
        text: 'Erreur lors du téléchargement de la photo.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h1>Gestion du Compte</h1>
      
      <div className={styles.profileLayout}>
        {/* Colonne de gauche: Photo de profil et mot de passe */}
        <div className={styles.leftColumn}>
          <div className={styles.photoSection}>
            <div className={styles.imageContainer}>
              {previewImage ? (
                <>
                  <img 
                    src={previewImage} 
                    alt="Photo de profil" 
                    className={styles.profileImage} 
                  />
                  <button 
                    className={styles.removePhotoButton}
                    onClick={() => {
                      setPreviewImage(null);
                      setProfileImage(null);
                    }}
                  >
                    &times;
                  </button>
                </>
              ) : (
                <div className={styles.noPhoto}>
                  <span>{profileData.firstName?.charAt(0) || profileData.username?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>
            
            <div className={styles.uploadPhotoContainer}>
              <label htmlFor="photo-upload" className={styles.uploadButton}>
                Changer la Photo
              </label>
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                onChange={handleImageChange} 
                className={styles.fileInput}
              />
            </div>
          </div>
          
          <div className={styles.passwordSection}>
            <h3>Changer le Mot de Passe</h3>
            
            {passwordMessage.text && (
              <div className={`${styles.message} ${styles[passwordMessage.type]}`}>
                {passwordMessage.text}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className={styles.formGroup}>
                <label htmlFor="old-password">Ancien Mot de Passe</label>
                <input
                  type="password"
                  id="old-password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="new-password">Nouveau Mot de Passe</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirm-password">Confirmer le Mot de Passe</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              
              <button type="submit" className={styles.changePasswordBtn}>
                Changer le Mot de Passe
              </button>
            </form>
          </div>
        </div>
        
        {/* Colonne de droite: Informations du profil */}
        <div className={styles.rightColumn}>
          <h2>Informations du Profil</h2>
          
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSave}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="nickname">Surnom</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={profileData.nickname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="role">Rôle</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={user?.role || 'Membre'}
                  disabled={true}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Nom de famille</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="displayName">Nom public</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email (obligatoire)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="birthDate">Date de naissance</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="club">Club</label>
                <input
                  type="text"
                  id="club"
                  name="club"
                  value={profileData.club}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
                <div className={styles.formGroup}>
                <label htmlFor="weight">Poids (kg)</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ex: 75"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="height">Taille (cm)</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={profileData.height || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ex: 180"
                />
              </div>
            </div>
            
            <div className={styles.martialArtsInfoSection}>
              <h3>Informations de Combattant</h3>
                <div className={styles.beltSection}>
                <label>Ceinture</label>
                <BeltSelector
                  value={profileData.belt}
                  onChange={(belt) => setProfileData(prevData => ({ ...prevData, belt }))}
                  disabled={!isEditing}
                />
              </div>
                <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="weightCategory">Catégorie de poids</label>
                  <select
                    id="weightCategory"
                    name="weightCategory"
                    value={profileData.weightCategory || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="lightweight">Poids léger (-65kg)</option>
                    <option value="welterweight">Poids welter (-70kg)</option>
                    <option value="middleweight">Poids moyen (-77kg)</option>
                    <option value="cruiserweight">Poids mi-lourd (-85kg)</option>
                    <option value="heavyweight">Poids lourd (+85kg)</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="experience">Expérience (années)</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    min="0"
                    max="50"
                    value={profileData.experience || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="specialties">Spécialités</label>
                <input
                  type="text"
                  id="specialties"
                  name="specialties"
                  placeholder="Ex: Judo, Karaté, Boxe thaïlandaise..."
                  value={profileData.specialties || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Victoires</span>
                  <span className={styles.statValue}>{profileData.wins || 0}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Défaites</span>
                  <span className={styles.statValue}>{profileData.losses || 0}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Égalités</span>
                  <span className={styles.statValue}>{profileData.draws || 0}</span>
                </div>
              </div>
            </div>
              
            <div className={styles.contactSection}>
              <h3>Informations de Contact</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="whatsApp">WhatsApp</label>
                <input
                  type="text"
                  id="whatsApp"
                  name="whatsApp"
                  value={profileData.whatsApp}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="@pseudo"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="telegram">Telegram</label>
                <input
                  type="text"
                  id="telegram"
                  name="telegram"
                  value={profileData.telegram}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="@pseudo"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="website">Site web</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://exemple.com"
                />
              </div>
            </div>
            
            <div className={styles.bioSection}>
              <h3>À propos de moi</h3>
              <div className={styles.formGroup}>
                <textarea
                  id="biography"
                  name="biography"
                  value={profileData.biography}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Parlez-nous de vous, de votre expérience dans les arts martiaux..."
                  rows={5}
                />
              </div>
            </div>
            
            <div className={styles.buttonContainer}>
              {isEditing ? (
                <>
                  <button type="submit" className={styles.saveButton}>
                    Enregistrer
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
