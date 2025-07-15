import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './UnregisterTournamentModal.module.css';

const UnregisterTournamentModal = ({ tournament, isOpen, onClose, onUnregister }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

  // Vérifier si le tournoi commence dans moins de 48h
  const tournamentDate = new Date(tournament?.start_date);
  const now = new Date();
  const timeDiff = tournamentDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  const isLessThan48Hours = hoursDiff < 48;

  const handleUnregister = async () => {
    if (!reason.trim()) {
      setError('Veuillez indiquer une raison pour votre désinscription.');
      return;
    }

    if (isLessThan48Hours) {
      const confirm = window.confirm(
        "Attention : Ce tournoi commence dans moins de 48 heures. La désinscription tardive peut entraîner des pénalités. Êtes-vous sûr de vouloir continuer ?"
      );
      if (!confirm) return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/tournaments/${tournament.id}/unregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          reason: reason
        })
      });

      if (response.ok) {
        onUnregister && onUnregister(tournament.id);
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || 'Une erreur est survenue lors de la désinscription.');
      }
    } catch (err) {
      console.error('Erreur de désinscription:', err);
      setError('Une erreur réseau est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Se désinscrire du tournoi</h2>
        <p className={styles.modalSubtitle}>{tournament?.name}</p>

        <div className={styles.warningBox}>
          <strong>Important :</strong> La désinscription à un tournoi doit se faire au moins 48h avant le début de celui-ci.
          {isLessThan48Hours && (
            <p className={styles.urgentWarning}>
              ⚠️ Ce tournoi commence dans moins de 48 heures. Une désinscription tardive peut entraîner des pénalités selon le règlement.
            </p>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="reason">Raison de la désinscription :</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={styles.textArea}
            placeholder="Veuillez indiquer la raison pour laquelle vous souhaitez vous désinscrire..."
            required
          />
        </div>

        <div className={styles.buttonContainer}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            className={styles.confirmButton}
            onClick={handleUnregister}
            disabled={loading}
          >
            {loading ? 'Traitement...' : 'Confirmer la désinscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnregisterTournamentModal;