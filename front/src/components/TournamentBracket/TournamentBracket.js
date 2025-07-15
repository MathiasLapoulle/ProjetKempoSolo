import React, { useState, useEffect } from 'react';
import styles from './TournamentBracket.module.css';
import './confetti.css';
import ScoreAdjustModal from './ScoreAdjustModal';

const TournamentBracket = ({ tournamentData }) => {
  // Utiliser l'état pour gérer les matchs
  const [matches, setMatches] = useState(tournamentData.matches);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Fonction pour mettre à jour le vainqueur d'un match
  const updateWinner = (matchId, winnerId) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        // Générer un score aléatoire pour le vainqueur qui est supérieur à l'autre
        let player1Score = match.player1Score || 0;
        let player2Score = match.player2Score || 0;
        
        if (winnerId === match.player1Id && player1Score <= player2Score) {
          player1Score = player2Score + 1 + Math.floor(Math.random() * 2);
        } else if (winnerId === match.player2Id && player2Score <= player1Score) {
          player2Score = player1Score + 1 + Math.floor(Math.random() * 2);
        }
        
        // Mettre à jour le gagnant du match actuel et les scores
        return { 
          ...match, 
          winnerId,
          player1Score,
          player2Score
        };
      }
      
      // Chercher si ce match alimente un match ultérieur
      if (match.player1Id === null && match.sourceMatch1 === matchId) {
        return { ...match, player1Id: winnerId };
      }
      
      if (match.player2Id === null && match.sourceMatch2 === matchId) {
        return { ...match, player2Id: winnerId };
      }
      
      return match;
    });
    
    setMatches(updatedMatches);
  };

  // Organiser les matchs par round
  const matchesByRound = {};
  matches.forEach(match => {
    if (!matchesByRound[match.round]) {
      matchesByRound[match.round] = [];
    }
    matchesByRound[match.round].push(match);
  });

  // Convertir en tableau pour faciliter le rendu
  const rounds = Object.keys(matchesByRound).sort((a, b) => a - b).map(round => ({
    round: parseInt(round),
    matches: matchesByRound[round].sort((a, b) => a.position - b.position)
  }));

  // Fonction pour obtenir le nom d'un joueur à partir de son ID
  const getPlayerName = (playerId) => {
    if (!playerId) return 'À déterminer';
    
    const player = tournamentData.players.find(p => p.id === playerId);
    return player ? player.name : 'Joueur inconnu';
  };  
  
  // Déterminer le nom des rounds en fonction du nombre total de rounds
  const getRoundName = (roundNumber, totalRounds) => {
    if (roundNumber === totalRounds) {
      return 'Finale';
    } else if (roundNumber === totalRounds - 1) {
      return 'Demi-finales';
    } else if (roundNumber === totalRounds - 2) {
      return 'Quarts de finale';
    } else if (roundNumber === totalRounds - 3) {
      return 'Huitièmes de finale';
    } else if (roundNumber === 1) {
      return 'Premier tour';
    } else {
      return `Tour ${roundNumber}`;
    }
  };

  // Calcul du pourcentage de progression du tournoi
  const calculateProgress = () => {
    const totalMatches = matches.length;
    const completedMatches = matches.filter(match => match.winnerId !== null).length;
    return Math.round((completedMatches / totalMatches) * 100);
  };

  // Nombre total de rounds
  const totalRounds = rounds.length;
  const tournamentProgress = calculateProgress();
  // Fonction pour réinitialiser le tournoi
  const resetTournament = () => {
    const resetMatches = matches.map(match => {
      // Conserver uniquement les joueurs du premier tour, réinitialiser tous les scores et vainqueurs
      if (match.round === 1) {
        return {
          ...match,
          player1Score: 0,
          player2Score: 0,
          winnerId: null
        };
      } else {
        return {
          ...match,
          player1Id: null,
          player2Id: null,
          player1Score: 0,
          player2Score: 0,
          winnerId: null
        };
      }
    });
    setMatches(resetMatches);
  };

  // Vérifier si le tournoi est terminé (le match final a un vainqueur)
  const finalMatch = matches.find(match => match.round === totalRounds);
  const isTournamentComplete = finalMatch && finalMatch.winnerId !== null;
  const championId = isTournamentComplete ? finalMatch.winnerId : null;
  const champion = championId ? tournamentData.players.find(p => p.id === championId) : null;
  // Effect pour célébrer le champion
  useEffect(() => {
    if (isTournamentComplete) {
      // Déclencher l'animation de confettis après le chargement du composant
      const timer = setTimeout(() => {
        const confettiElements = document.querySelectorAll(`.${styles.confetti}`);
        confettiElements.forEach(el => {
          el.classList.add(styles.active);
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isTournamentComplete]);

  useEffect(() => {
 
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTip]);

  const handleScoreUpdate = (updatedMatch) => {
    const updatedMatches = matches.map(match => 
      match.id === updatedMatch.id ? updatedMatch : match
    );
    
 
    if (updatedMatch.winnerId !== null) {
        // Si un vainqueur est sélectionné, mettre à jour les matchs suivants
      const nextMatches = updatedMatches.filter(match => 
        match.sourceMatch1 === updatedMatch.id || match.sourceMatch2 === updatedMatch.id
      );
      

      nextMatches.forEach(nextMatch => {
        if (nextMatch.sourceMatch1 === updatedMatch.id) {
          nextMatch.player1Id = updatedMatch.winnerId;
        }
        if (nextMatch.sourceMatch2 === updatedMatch.id) {
          nextMatch.player2Id = updatedMatch.winnerId;
        }
      });
    }
    
    setMatches(updatedMatches);
    setShowScoreModal(false);
  };

  return (
    <div className={styles.bracketWrapper}>
      {showTip && (
        <div className={styles.tooltip}>
          <p>Double-cliquez sur un match pour ajuster manuellement les scores</p>
          <button onClick={() => setShowTip(false)} className={styles.closeTooltip}>×</button>
        </div>
      )}
      <div className={styles.tournamentHeader}>
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>Progression: {tournamentProgress}%</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${tournamentProgress}%` }}
            ></div>
          </div>
        </div>
        <button 
          className={styles.resetButton} 
          onClick={resetTournament}
        >
          Réinitialiser le tournoi
        </button>
      </div>
      
      {isTournamentComplete && (
        <div className={styles.championBanner}>
          <div className={styles.confetti}></div>
          <h2>🏆 Champion: {champion?.name} 🏆</h2>
          <div className={styles.confetti}></div>
        </div>
      )}
      
      <div className={styles.bracketContainer}>
        {rounds.map(round => (
          <div key={round.round} className={styles.round}>
            <div className={styles.roundLabel}>
              {getRoundName(round.round, totalRounds)}
            </div>
            <div className={styles.matchesContainer}>
              {round.matches.map((match, index) => {
                // Calculer la hauteur du connecteur horizontal
                const nextRoundMatches = round.round < totalRounds ? 
                  rounds.find(r => r.round === round.round + 1).matches.length : 0;
                const connectorClass = nextRoundMatches > 0 ? 
                  nextRoundMatches < round.matches.length ? styles.connectorWithFork : styles.connector : '';
                
                return (
                  <div key={match.id} className={styles.matchWrapper}>
                    <div 
                      className={styles.matchBox}
                      onDoubleClick={() => {
                        setSelectedMatch(match);
                        setShowScoreModal(true);
                      }}
                    >                  <div 
                    className={`${styles.player} ${match.winnerId === match.player1Id ? styles.winner : ''}`} 
                    onClick={() => match.player1Id && updateWinner(match.id, match.player1Id)}
                  >
                    <span className={styles.playerName}>{getPlayerName(match.player1Id)}</span>
                    <div className={styles.scoreControls}>
                      {match.player1Id && (
                        <button 
                          className={styles.scoreButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedMatches = matches.map(m => {
                              if (m.id === match.id) {
                                const newScore = Math.max(0, (m.player1Score || 0) - 1);
                                return {...m, player1Score: newScore};
                              }
                              return m;
                            });
                            setMatches(updatedMatches);
                          }}
                        >-</button>
                      )}
                      <span className={styles.score}>{match.player1Score !== undefined ? match.player1Score : '-'}</span>
                      {match.player1Id && (
                        <button 
                          className={styles.scoreButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedMatches = matches.map(m => {
                              if (m.id === match.id) {
                                return {...m, player1Score: (m.player1Score || 0) + 1};
                              }
                              return m;
                            });
                            setMatches(updatedMatches);
                          }}
                        >+</button>
                      )}
                    </div>
                  </div>
                  <div 
                    className={`${styles.player} ${match.winnerId === match.player2Id ? styles.winner : ''}`}
                    onClick={() => match.player2Id && updateWinner(match.id, match.player2Id)}
                  >
                    <span className={styles.playerName}>{getPlayerName(match.player2Id)}</span>
                    <div className={styles.scoreControls}>
                      {match.player2Id && (
                        <button 
                          className={styles.scoreButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedMatches = matches.map(m => {
                              if (m.id === match.id) {
                                const newScore = Math.max(0, (m.player2Score || 0) - 1);
                                return {...m, player2Score: newScore};
                              }
                              return m;
                            });
                            setMatches(updatedMatches);
                          }}
                        >-</button>
                      )}
                      <span className={styles.score}>{match.player2Score !== undefined ? match.player2Score : '-'}</span>
                      {match.player2Id && (
                        <button 
                          className={styles.scoreButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedMatches = matches.map(m => {
                              if (m.id === match.id) {
                                return {...m, player2Score: (m.player2Score || 0) + 1};
                              }
                              return m;
                            });
                            setMatches(updatedMatches);
                          }}
                        >+</button>
                      )}
                    </div>
                  </div>
                    </div>
                    {/* Connecteurs améliorés pour les rounds suivants */}
                    {round.round < totalRounds && (
                      <div className={connectorClass}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {showScoreModal && selectedMatch && (
        <ScoreAdjustModal
          match={selectedMatch}
          players={tournamentData.players}
          onClose={() => setShowScoreModal(false)}
          onSave={handleScoreUpdate}
        />
      )}
    </div>
  );
};

export default TournamentBracket;
