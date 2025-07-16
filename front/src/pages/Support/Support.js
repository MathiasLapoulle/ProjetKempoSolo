import React from 'react';
import styles from './Support.module.css';

const Support = () => {
  const handleSupportClick = () => {
    // Ouvrir le lien de support dans un nouvel onglet
    window.open('https://kempo-solo-project.atlassian.net/servicedesk/customer/portal/1', '_blank');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Centre de Support</h1>
      
      <div className={styles.description}>
        <p>Notre équipe de support est là pour vous aider avec toutes vos questions concernant KempoSolo.</p>
        
        <div className={styles.infoSection}>
          <h3>Comment fonctionne notre support ?</h3>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Créez votre ticket</h4>
                <p>Cliquez sur le bouton "Contacter le Support" ci-dessous pour ouvrir notre système de tickets.</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Décrivez votre problème</h4>
                <p>Expliquez votre problème en détail avec des captures d'écran si nécessaire. Plus vous donnez d'informations, plus nous pourrons vous aider rapidement.</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Suivi personnalisé</h4>
                <p>Un membre de notre équipe vous contactera dans les 24 heures. Vous recevrez des mises à jour régulières par email.</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Résolution</h4>
                <p>Nous travaillons avec vous jusqu'à la résolution complète de votre problème. Votre satisfaction est notre priorité.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.supportInfo}>
          <h3>Informations importantes</h3>
          <ul>
            <li><strong>Temps de réponse :</strong> 24 heures maximum</li>
            <li><strong>Heures d'assistance :</strong> Lundi à Vendredi, 9h00 - 18h00</li>
            <li><strong>Support d'urgence :</strong> Disponible pour les problèmes critiques</li>
            <li><strong>Langues supportées :</strong> Français, Anglais</li>
          </ul>
        </div>
        
        <div className={styles.faqSection}>
          <h3>Questions fréquentes</h3>
          <div className={styles.faqItem}>
            <h4>Comment réinitialiser mon mot de passe ?</h4>
            <p>Utilisez le lien "Mot de passe oublié" sur la page de connexion.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>Comment créer un nouveau tournoi ?</h4>
            <p>Allez dans "Créer un tournoi" depuis le menu principal et suivez les étapes.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>Problème avec l'affichage des brackets ?</h4>
            <p>Vérifiez votre connexion internet et rafraîchissez la page. Si le problème persiste, contactez-nous.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.buttonContainer}>
        <button 
          className={styles.supportButton}
          onClick={handleSupportClick}
        >
          📞 Contacter le Support
        </button>
      </div>
      
      <div className={styles.footer}>
        <p>
          Vous pouvez également nous contacter directement par email à : 
          <a href="mailto:support@kempo-solo-project.atlassian.net"> support@kemposolo.com</a>
        </p>
      </div>
    </div>
  );
};

export default Support;
