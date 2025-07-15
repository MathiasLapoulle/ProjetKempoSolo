import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './OngoingTournaments.module.css';

function OngoingTournaments() {
  const [tournamentsList, setTournamentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ongoing'); // 'ongoing', 'completed', 'all'

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/tournaments');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tournois');
      }
      
      const data = await response.json();
      setTournamentsList(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les tournois. Veuillez réessayer plus tard.');
      setLoading(false);
    }
  };

  const handleEndTournament = async (tournamentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir terminer ce tournoi ?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/tournaments/${tournamentId}/end`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la finalisation du tournoi');
      }
      
      // Rafraîchir la liste des tournois
      fetchTournaments();
      alert('Le tournoi a été terminé avec succès.');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Une erreur est survenue lors de la finalisation du tournoi.');
    }
  };

  const handleExportResults = (tournamentId, tournamentName) => {
    // Cette fonction sera responsable de l'export des résultats
    // Pour l'instant, elle simule juste un téléchargement
    alert(`Export des résultats pour le tournoi: ${tournamentName}`);
    
    // Dans une implémentation réelle, on ferait une requête vers le backend
    // pour générer et télécharger un rapport PDF ou Excel
  };

  // Filtrer les tournois
  const filteredTournaments = tournamentsList.filter(tournament => {
    if (filter === 'all') return true;
    if (filter === 'ongoing') return tournament.status === 'in_progress' || tournament.status === 'started';
    if (filter === 'completed') return tournament.status === 'completed';
    return true;
  });

  if (loading) {
    return <div className={styles.loading}>Chargement des tournois...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tournois en cours</h1>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${filter === 'ongoing' ? styles.active : ''}`}
            onClick={() => setFilter('ongoing')}
          >
            En cours
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Terminés
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
        </div>
      </div>

      {filteredTournaments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Aucun tournoi {filter === 'ongoing' ? 'en cours' : filter === 'completed' ? 'terminé' : ''} trouvé.</p>
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {filteredTournaments.map(tournament => (
            <div key={tournament.id} className={styles.tournamentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.tournamentName}>{tournament.name}</h2>
                <span className={`${styles.status} ${styles[tournament.status]}`}>
                  {tournament.status === 'pending' && 'En attente'}
                  {tournament.status === 'started' && 'Démarré'}
                  {tournament.status === 'in_progress' && 'En cours'}
                  {tournament.status === 'completed' && 'Terminé'}
                </span>
              </div>
              
              <div className={styles.tournamentDetails}>
                <p><strong>Date:</strong> {new Date(tournament.start_date).toLocaleDateString()}</p>
                <p><strong>Catégorie:</strong> {tournament.rank}</p>
                <p><strong>Genre:</strong> {tournament.gender === 'male' ? 'Homme' : tournament.gender === 'female' ? 'Femme' : 'Mixte'}</p>
                <p><strong>Système:</strong> {tournament.system}</p>
              </div>
              
              <div className={styles.cardActions}>
                <Link 
                  to={`/tournoiDetails/${tournament.id}`} 
                  className={styles.viewButton}
                >
                  Voir le bracket
                </Link>
                
                {tournament.status !== 'completed' ? (
                  <button 
                    className={styles.endButton}
                    onClick={() => handleEndTournament(tournament.id)}
                  >
                    Terminer
                  </button>
                ) : (
                  <button 
                    className={styles.exportButton}
                    onClick={() => handleExportResults(tournament.id, tournament.name)}
                  >
                    Exporter les résultats
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OngoingTournaments;