
import React, { useState } from 'react';
import styles from './home.module.css'; // Styles spécifiques à la page Home
import { useAuth } from "../../context/AuthContext";

import RssFeedWidget from './components/RssFeedWidget.js';

function Home() {
  const [currentFeedUrl, setCurrentFeedUrl] = useState("https://rmcsport.bfmtv.com/rss/football/");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  
  const { isAuthenticated, userRole, logout } = useAuth();

  // Fonction pour afficher/masquer le champ de saisie
  const handleChangeRssFeed = () => {
    setShowUrlInput(!showUrlInput);
    setNewFeedUrl(currentFeedUrl); // Pré-remplir avec l'URL actuelle
  };

  // Fonction pour appliquer la nouvelle URL
  const handleApplyNewUrl = () => {
    if (newFeedUrl.trim() !== "") {
      // Validation simple d'URL
      try {
        new URL(newFeedUrl.trim());
        setCurrentFeedUrl(newFeedUrl.trim());
        setShowUrlInput(false);
        console.log("Nouvelle URL RSS appliquée:", newFeedUrl.trim());
      } catch (error) {
        alert("Veuillez entrer une URL valide");
      }
    } else {
      alert("Veuillez entrer une URL");
    }
  };

  // Fonction pour annuler le changement
  const handleCancelChange = () => {
    setShowUrlInput(false);
    setNewFeedUrl("");
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>PAGE D'ACCUEIL</h1>
        <p className={styles.description}>
          Description ou sous-titre de la page d'accueil.
        </p>
      </div>
      {(isAuthenticated && (userRole === 'admin')) && (
        <>
          <div className={styles.rssFeedControlsWrapper}>
            <div className={styles.currentUrlDisplay}>
              <small>URL actuelle: {currentFeedUrl}</small>
            </div>
            
            <button 
              className={styles.changeRssButton}
              onClick={handleChangeRssFeed}
            >
              {showUrlInput ? 'Annuler' : 'Changement Flux RSS'}
            </button>
            
            {showUrlInput && (
              <div className={styles.urlInputContainer}>
                <label htmlFor="rssUrl" className={styles.inputLabel}>
                  Nouvelle URL du flux RSS:
                </label>
                <input
                  id="rssUrl"
                  type="url"
                  className={styles.urlInput}
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                  placeholder="https://example.com/rss"
                />
                <div className={styles.urlInputButtons}>
                  <button 
                    className={styles.applyButton}
                    onClick={handleApplyNewUrl}
                  >
                    Appliquer
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={handleCancelChange}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.rssFeedWrapper}>
            <RssFeedWidget rssFeedUrl={currentFeedUrl} />
          </div>
        </>
      )}

      {
      <div className={styles.underConstruction}>
        <h2>Site en Construction</h2>
        <p>De nouvelles fonctionnalités arrivent bientôt !</p>
      </div>
      }
    </div>
  );
}

export default Home;
