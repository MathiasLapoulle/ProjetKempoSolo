import React, { useState, useEffect } from 'react';
import styles from './ScoreAdjustModal.module.css';

const ScoreAdjustModal = ({ match, players, onClose, onSave }) => {
  const [player1Score, setPlayer1Score] = useState(match.player1Score || 0);
  const [player2Score, setPlayer2Score] = useState(match.player2Score || 0);
  
  const player1 = players.find(p => p.id === match.player1Id);
  const player2 = players.find(p => p.id === match.player2Id);
  
  const player1Name = player1 ? player1.name : 'À déterminer';
  const player2Name = player2 ? player2.name : 'À déterminer';
  

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        handleSave();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player1Score, player2Score]);
  
  const handleSave = () => {
    // Determine the winner based on scores
    let winnerId = null;
    if (player1Score > player2Score) {
      winnerId = match.player1Id;
    } else if (player2Score > player1Score) {
      winnerId = match.player2Id;
    }
    
    onSave({
      ...match,
      player1Score,
      player2Score,
      winnerId
    });
  };
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Ajuster les scores</h3>
        
        <div className={styles.matchInfo}>
          <div className={styles.playerScoreContainer}>
            <div className={styles.playerName}>{player1Name}</div>
            <input
              type="number"
              min="0" 
              className={styles.scoreInput}
              value={player1Score}
              onChange={(e) => setPlayer1Score(parseInt(e.target.value) || 0)}
              autoFocus
            />
          </div>
          
          <div className={styles.versus}>vs</div>
          
          <div className={styles.playerScoreContainer}>
            <div className={styles.playerName}>{player2Name}</div>
            <input
              type="number"
              min="0"
              className={styles.scoreInput}
              value={player2Score}
              onChange={(e) => setPlayer2Score(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreAdjustModal;
