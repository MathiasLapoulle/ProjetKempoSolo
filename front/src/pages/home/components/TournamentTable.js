import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { tournamentAPI } from "../../../services/api";
import styles from "./TournamentTable.module.css";
import Filter from "./Filters";
import EditTournoiModal from "./EditTournamentModal";
import CreateTournoi from "./CreateTournament";
import UnregisterTournamentModal from "./UnregisterTournamentModal";

const TournoiTable = () => {
  const [searchQueryName, setSearchQueryName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournoi, setSelectedTournoi] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [unregisterOpen, setUnregisterOpen] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [infoMessage, setInfoMessage] = useState("");
  
  const { user, userRole, isAuthenticated } = useAuth();

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const result = await tournamentAPI.getAllTournaments();
      
      if (result.success) {
        console.log("API Response data:", result.data);
        // Ensure data is always an array
        if (Array.isArray(result.data)) {
          setTournois(result.data);
        } else {
          console.error("API returned non-array data:", result.data);
          setTournois([]);
        }
      } else {
        console.error("API error:", result.error);
        setTournois([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des tournois:", err);
      setTournois([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user registrations
  const fetchUserRegistrations = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      // For now, we'll use a direct fetch since we don't have this API endpoint in our service yet
      // This can be updated later when the registration API is implemented
      const response = await fetch(`http://localhost:4000/users/${user.id}/registrations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserRegistrations(data);
      } else {
        console.log("No registrations endpoint available yet");
        setUserRegistrations([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des inscriptions:", err);
      setUserRegistrations([]);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchTournaments();
    fetchUserRegistrations();
    
    // Afficher le message d'information une seule fois par session
    const hasShownInfo = sessionStorage.getItem('tournamentInfoShown');
    if (!hasShownInfo && isAuthenticated) {
      setInfoMessage("Rappel : Toute désinscription à un tournoi doit se faire au moins 48h avant le début de celui-ci.");
      sessionStorage.setItem('tournamentInfoShown', 'true');
      
      // Cacher le message après 10 secondes
      const timer = setTimeout(() => {
        setInfoMessage("");
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, fetchUserRegistrations]);

  const filteredTournois = (Array.isArray(tournois) ? tournois : []).filter((tournoi) =>
    tournoi.name?.toLowerCase().includes(searchQueryName.toLowerCase()) &&
    (selectedDate === "" || tournoi.start_date?.startsWith(selectedDate)) &&
    (selectedCategory === "" || tournoi.rank === selectedCategory)
  );

  const handleDelete = async (id) => {
    if (userRole !== 'admin') return;
    
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce tournoi ?");
    if (!confirm) return;

    try {
      const result = await tournamentAPI.deleteTournament(id);
      
      if (result.success) {
        console.log("Tournoi supprimé !");
        setTournois(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Erreur lors de la suppression: " + result.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Une erreur réseau est survenue.");
    }
  };

  const handleLaunchTournament = (id) => {
    if (userRole !== 'admin') return;
    
    // Ici, vous ajouterez la logique pour lancer un tournoi
    alert(`Lancement du tournoi ${id}`);
  };
  
  const isUserRegistered = (tournamentId) => {
    return userRegistrations.some(reg => reg.tournamentId === tournamentId);
  };
  
  const handleUnregisterComplete = (tournamentId) => {
    // Mettre à jour la liste des inscriptions de l'utilisateur après désinscription
    setUserRegistrations(prev => prev.filter(reg => reg.tournamentId !== tournamentId));
    // Afficher un message de confirmation
    alert("Vous avez été désinscrit du tournoi avec succès.");
  };

  return (
    <div className={styles.container}>
      {infoMessage && (
        <div className={styles.infoMessage}>
          <span>{infoMessage}</span>
          <button 
            className={styles.closeInfoBtn} 
            onClick={() => setInfoMessage("")}
          >
            ×
          </button>
        </div>
      )}
    
      <div className={styles.topSection}>
        <h2 className={styles.tableTitle}>Liste des tournois</h2>
        <div className={styles.filterSection}>
          <Filter
            searchQuery={searchQueryName}
            setSearchQuery={setSearchQueryName}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      {userRole === 'admin' && (
        <div className={styles.createTournamentSection}>
          <CreateTournoi />
        </div>
      )}
      
      {loading ? (
        <div className={styles.loading}>Chargement des tournois...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.tournamentTable}>
            <thead>
              <tr>
                <th>NOM DU TOURNOI</th>
                <th>DATE</th>
                <th>GENRE</th>
                <th>GRADE</th>
                <th>SYSTÈME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredTournois.length > 0 ? (
                filteredTournois.map((tournoi, index) => {
                  const isRegistered = isUserRegistered(tournoi.id);
                  const canManage = userRole === 'admin';
                  const isPendingOrStarted = tournoi.status === 'pending' || tournoi.status === 'started';
                  
                  return (
                    <tr key={index}>
                      <td>{tournoi.name || "Tournoi numéro 1 : Catégorie X"}</td>
                      <td>{tournoi.start_date?.split("T")[0] || "jj/mm/AAAA"}</td>
                      <td>{tournoi.gender || "Homme/Femme"}</td>
                      <td>{tournoi.rank || "Ceinture Blanche"}</td>
                      <td>{tournoi.system || "Poules"}</td>
                      <td className={styles.actionButtons}>
                        {canManage && isPendingOrStarted && (
                          <button 
                            className={styles.launchBtn} 
                            onClick={() => handleLaunchTournament(tournoi.id)}
                          >
                            LANCEMENT
                          </button>
                        )}
                        
                        {isRegistered && isPendingOrStarted && (
                          <button 
                            className={styles.unregisterBtn} 
                            onClick={() => {
                              setSelectedTournoi(tournoi);
                              setUnregisterOpen(true);
                            }}
                          >
                            SE DÉSINSCRIRE
                          </button>
                        )}
                        
                        {canManage && (
                          <div className={styles.actionIcons}>
                            <button 
                              className={styles.editBtn}
                              onClick={() => {
                                setSelectedTournoi(tournoi);
                                setEditOpen(true);
                              }}
                            >
                              ✏️
                            </button>
                            <button 
                              className={styles.deleteBtn}
                              onClick={() => handleDelete(tournoi.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noData}>Aucun tournoi trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditTournoiModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        tournament={selectedTournoi}
        onUpdate={fetchTournaments}
      />
      
      <UnregisterTournamentModal 
        isOpen={unregisterOpen}
        onClose={() => setUnregisterOpen(false)}
        tournament={selectedTournoi}
        onUnregister={handleUnregisterComplete}
      />
    </div>
  );
};

export default TournoiTable;
