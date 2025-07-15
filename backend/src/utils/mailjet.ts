// Utilitaires pour l'envoi d'emails via Mailjet
import Mailjet from 'node-mailjet';

// Configuration de Mailjet
// Clés API Mailjet
const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC || '9763291a8f09533d6b778f61f93f7ffe';
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE || 'c56108b4db9df9252ecba453181fb84f';

// Initialisation du client Mailjet - version 6.0.8
// @ts-ignore - Contourne les problèmes de typage avec la version 6.0.8 de node-mailjet en ESM
const mailjet = new Mailjet({
  apiKey: MJ_APIKEY_PUBLIC,
  apiSecret: MJ_APIKEY_PRIVATE
});

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {string} email Adresse email du destinataire
 * @param {string} resetToken Token de réinitialisation
 * @param {string} firstName Prénom de l'utilisateur
 * @param {string} lastName Nom de l'utilisateur
 * @returns {Promise} Promesse résolue lorsque l'email est envoyé
 */
export async function sendPasswordResetEmail(email: string, resetToken: string, firstName: string, lastName: string) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  try {
    console.log(`Tentative d'envoi d'email à ${email} avec Mailjet...`);
    
    const result = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "kempo.reset@gmail.com", // Votre adresse email vérifiée
              Name: "Kempo App"
            },
            To: [
              {
                Email: email,
                Name: `${firstName} ${lastName}`
              }
            ],
            Subject: "Réinitialisation de votre mot de passe",
            HTMLPart: `
              <h2>Réinitialisation de mot de passe</h2>
              <p>Bonjour ${firstName},</p>
              <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
              <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe (ce lien expirera dans 1 heure):</p>
              <p><a href="${resetLink}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
              <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
              <p>Cordialement,<br>L'équipe Kempo App</p>
            `
          }
        ]
      });
    
    console.log('Email envoyé avec succès:', result.body);
    // Affichage détaillé pour le débogage
    console.log('Message Status:', result.body?.Messages?.[0]?.Status);
    console.log('To:', JSON.stringify(result.body?.Messages?.[0]?.To));
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    if (error.response && error.response.data) {
      console.error('Détails de l\'erreur Mailjet:', error.response.data);
    }
    throw error;
  }
}

/**
 * Envoie un email de confirmation après la réinitialisation du mot de passe
 * @param {string} email Adresse email du destinataire
 * @param {string} firstName Prénom de l'utilisateur
 * @param {string} lastName Nom de l'utilisateur
 * @returns {Promise} Promesse résolue lorsque l'email est envoyé
 */
export async function sendPasswordResetConfirmationEmail(email: string, firstName: string, lastName: string) {
  try {
    const result = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "thibault.verbelen@viacesi.fr", // Votre adresse email vérifiée
              Name: "Kempo App"
            },
            To: [
              {
                Email: email,
                Name: `${firstName} ${lastName}`
              }
            ],
            Subject: "Votre mot de passe a été modifié",
            HTMLPart: `
              <h2>Confirmation de changement de mot de passe</h2>
              <p>Bonjour ${firstName},</p>
              <p>Votre mot de passe a été modifié avec succès.</p>
              <p>Si vous n'êtes pas à l'origine de ce changement, veuillez contacter immédiatement notre support.</p>
              <p>Cordialement,<br>L'équipe Kempo App</p>
            `
          }
        ]
      });
    
    console.log('Email de confirmation envoyé avec succès:', result.body);
    // Affichage détaillé pour le débogage
    console.log('Message Status:', result.body?.Messages?.[0]?.Status);
    console.log('To:', JSON.stringify(result.body?.Messages?.[0]?.To));
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    if (error.response && error.response.data) {
      console.error('Détails de l\'erreur Mailjet:', error.response.data);
    }
    throw error;
  }
}
