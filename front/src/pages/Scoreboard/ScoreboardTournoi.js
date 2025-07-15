import React, { useState, useEffect } from "react";
import axios from "axios";

const ScoreboardTournoi = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger les données des tournois depuis l'API
    const fetchTournaments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tournaments");
        setTournaments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des tournois:", err);
        setError("Impossible de charger les données des tournois.");
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>Scoreboard Tournois</h1>
      
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Nom du tournoi</th>
            <th>Date</th>
            <th>Lieu</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                Aucun tournoi disponible
              </td>
            </tr>
          ) : (
            tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td style={{ padding: "10px" }}>{tournament.name}</td>
                <td style={{ padding: "10px" }}>
                  {new Date(tournament.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px" }}>{tournament.location}</td>
                <td style={{ padding: "10px" }}>
                  {tournament.status || "Non défini"}
                </td>
                <td style={{ padding: "10px" }}>
                  <button>Afficher</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreboardTournoi;
