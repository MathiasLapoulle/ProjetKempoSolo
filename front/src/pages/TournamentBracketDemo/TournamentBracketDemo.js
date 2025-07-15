import React from 'react';
import TournamentBracket from '../../components/TournamentBracket/TournamentBracket';
import styles from './TournamentBracketDemo.module.css';

// Données fictives pour démonstration
const mockTournamentData = {
  id: 1,
  name: 'Tournoi de Démonstration',
  players: [
    { id: 1, name: 'Jean Dupont' },
    { id: 2, name: 'Marie Martin' },
    { id: 3, name: 'Lucas Bernard' },
    { id: 4, name: 'Sophie Petit' },
    { id: 5, name: 'Thomas Durand' },
    { id: 6, name: 'Emma Moreau' },
    { id: 7, name: 'Nicolas Robert' },
    { id: 8, name: 'Clara Simon' },
  ],
  matches: [
    // Quarts de finale
    { id: 1, round: 1, position: 1, player1Id: 1, player2Id: 2, player1Score: 3, player2Score: 1, winnerId: 1, sourceMatch1: null, sourceMatch2: null },
    { id: 2, round: 1, position: 2, player1Id: 3, player2Id: 4, player1Score: 2, player2Score: 3, winnerId: 4, sourceMatch1: null, sourceMatch2: null },
    { id: 3, round: 1, position: 3, player1Id: 5, player2Id: 6, player1Score: 0, player2Score: 3, winnerId: 6, sourceMatch1: null, sourceMatch2: null },
    { id: 4, round: 1, position: 4, player1Id: 7, player2Id: 8, player1Score: 3, player2Score: 2, winnerId: 7, sourceMatch1: null, sourceMatch2: null },
    
    // Demi-finales
    { id: 5, round: 2, position: 1, player1Id: 1, player2Id: 4, player1Score: 0, player2Score: 0, winnerId: null, sourceMatch1: 1, sourceMatch2: 2 },
    { id: 6, round: 2, position: 2, player1Id: 6, player2Id: 7, player1Score: 0, player2Score: 0, winnerId: null, sourceMatch1: 3, sourceMatch2: 4 },
    
    // Finale
    { id: 7, round: 3, position: 1, player1Id: null, player2Id: null, player1Score: 0, player2Score: 0, winnerId: null, sourceMatch1: 5, sourceMatch2: 6 }
  ]
};

const TournamentBracketDemo = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{mockTournamentData.name}</h1>
      <div className={styles.description}>
        <p>Cliquez sur un joueur pour le désigner comme vainqueur du match. Le bracket se mettra à jour automatiquement.</p>
      </div>
      <div className={styles.bracketWrapper}>
        <TournamentBracket tournamentData={mockTournamentData} />
      </div>
    </div>
  );
};

export default TournamentBracketDemo;
