import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddCategoryModal from "./Components/AddCategoryModal";

const TournoiDetails = () => {
  const { id: tournamentId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the tournament
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tournaments/${tournamentId}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [tournamentId]);

  // Add category handler
  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCategorySubmit = async (categoryData) => {
    try {
      const payload = {
        rank: categoryData.grades,
        gender: categoryData.gender,
        weight_category_id: parseInt(categoryData.weight_category_id),
        age_group_id: parseInt(categoryData.age_group_id),
        elimination_type: "Directe"
      };

      await axios.post(`http://localhost:3000/tournaments/${tournamentId}/categories`, payload);
      alert("✅ Catégorie ajoutée avec succès !");
      setIsModalOpen(false);

      // Refresh the list after adding
      const res = await axios.get(`http://localhost:3000/tournaments/${tournamentId}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error.response?.data || error.message);
      alert("Erreur serveur. Voir la console.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Détails du Tournoi</h2>

      <button onClick={handleAddCategory}>➕ Ajouter Catégorie</button>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCategorySubmit}
      />

      <h3 style={{ marginTop: "30px" }}>📋 Catégories existantes</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Rang</th>
            <th>Genre</th>
            <th>ID Poids</th>
            <th>ID Âge</th>
            <th>Élimination</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>Aucune catégorie trouvée.</td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <tr key={index}>
                <td>{Array.isArray(cat.rank) ? cat.rank.join(", ") : cat.rank}</td>
                <td>{cat.gender}</td>
                <td>{cat.weight_category_id ?? "N/A"}</td>
                <td>{cat.age_group_id ?? "N/A"}</td>
                <td>{cat.elimination_type}</td>
                <td>
                  <button onClick={() => alert(JSON.stringify(cat, null, 2))}>
                    🔍 Détails
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TournoiDetails;
