import React from 'react';
import TournamentBracket from '../../components/TournamentBracket/TournamentBracket';
import styles from './BracketExample.module.css';

// Générateur de noms de joueurs aléatoires
const generateRandomName = () => {
  const firstNames = ['Jean', 'Marie', 'Thomas', 'Sophie', 'Lucas', 'Emma', 'Nicolas', 'Camille', 'Pierre', 'Léa', 
                     'Hugo', 'Julie', 'Alexandre', 'Clara', 'Maxime', 'Chloé', 'Antoine', 'Laura', 'Julien', 'Manon'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
                    'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier'];
  
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${randomFirstName} ${randomLastName}`;
};

// Générer des joueurs
const players = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: generateRandomName()
}));

// Générer les matchs pour un tournoi à 16 joueurs (4 rounds)
const generateMatches = (players) => {
  const matches = [];
  let matchId = 1;


  // Constante maximum pour le score
  // Je met 2 ici comme après ça arrondi à l'entier inférieur
  const MAX_SCORE = 2;

  // Round 1 - 8 matchs (16 joueurs)
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: matchId,
      round: 1,
      position: i + 1,
      player1Id: players[i * 2].id,
      player2Id: players[i * 2 + 1].id,
      //Permet ici de générer un chiffre aléatoir entre 0 et 2 pour le score
      //Math.floor me permet d'arrondir à l'arrondi inférieur (2 points max)
      player1Score: Math.floor(Math.random() * (MAX_SCORE + 1)),
      player2Score: Math.floor(Math.random() * (MAX_SCORE + 1)),
      winnerId: null,
      sourceMatch1: null,
      sourceMatch2: null
    });
    matchId++;
  }

  //A FAIRE
  //GERER LE FAIT QUE LE MAX DE POINTS FASSE PASSER UN JOUEUR A LA MANCHE SUIVANTE
  
  // Round 2 - 4 matchs (8 joueurs)
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: matchId,
      round: 2,
      position: i + 1,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      winnerId: null,
      sourceMatch1: i * 2 + 1,
      sourceMatch2: i * 2 + 2
    });
    matchId++;
  }
  
  // Round 3 - 2 matchs (4 joueurs)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: matchId,
      round: 3,
      position: i + 1,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      winnerId: null,
      sourceMatch1: 8 + i * 2 + 1,
      sourceMatch2: 8 + i * 2 + 2
    });
    matchId++;
  }
  
  // Round 4 - Finale (2 joueurs)
  matches.push({
    id: matchId,
    round: 4,
    position: 1,
    player1Id: null,
    player2Id: null,
    player1Score: 0,
    player2Score: 0,
    winnerId: null,
    sourceMatch1: 13,
    sourceMatch2: 14
  });
  
  return matches;
};

const tournamentData = {
  id: 1,
  name: 'Tournoi de Kempo - Ceintures Noires',
  players: players,
  matches: generateMatches(players)
};

const BracketExample = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{tournamentData.name}</h1>
      <div className={styles.description}>
        <p>Bracket interactif avec 16 participants. Cliquez sur un joueur pour le désigner vainqueur.</p>          <div className={styles.instructions}>
            <h3>Instructions:</h3>
            <ul>
              <li>Cliquez sur un joueur pour le désigner comme vainqueur du match</li>
              <li>Utilisez les boutons + et - qui apparaissent au survol pour ajuster rapidement les scores</li>
              <li>Double-cliquez sur un match pour ouvrir l'éditeur de score détaillé</li>
              <li>Suivez la progression du tournoi avec la barre en haut du bracket</li>
              <li>Cliquez sur "Réinitialiser le tournoi" pour recommencer depuis le début</li>
              <li>Admirez l'animation de célébration quand un champion est couronné!</li>
            </ul>
          </div>
      </div>
      <div className={styles.bracketWrapper}>
        <TournamentBracket tournamentData={tournamentData} />
      </div>
      <div className={styles.participantsList}>
        <h3>Liste des participants</h3>
        <div className={styles.participantsGrid}>
          {tournamentData.players.map(player => (
            <div key={player.id} className={styles.playerCard}>
              {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BracketExample;
