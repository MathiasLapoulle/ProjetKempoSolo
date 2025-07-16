import React, { useState, useEffect } from "react";
import styles from "./CompetitorsTable.module.css";
import Filter from "./Filter";
import AjouterCompetiteurs from "./AddCompetitors";
import { competitorAPI } from "../../../services/api";

const CompetitorTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load competitors from backend
  const loadCompetitors = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await competitorAPI.getAllCompetitors();
      if (result.success) {
        // Transform backend data to frontend format
        const transformedCompetitors = result.data.map(comp => ({
          id: comp.id,
          name: comp.lastname,
          firstName: comp.firstname,
          club: comp.club || '',
          pays: comp.country,
          dateNaissance: comp.birthday ? new Date(comp.birthday).toISOString().split('T')[0] : '',
          sexe: comp.gender === 'H' ? 'M' : 'F',
          categorie: comp.rank,
          weight: comp.weight || 0,
          rank: comp.rank
        }));
        setCompetitors(transformedCompetitors);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Erreur lors du chargement des compétiteurs');
      console.error('Error loading competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load competitors on component mount
  useEffect(() => {
    loadCompetitors();
  }, []);

  const handleAdd = async (newCompetitor) => {
    try {
      const result = await competitorAPI.createCompetitor(newCompetitor);
      if (result.success) {
        await loadCompetitors(); // Reload to get updated data
        setIsAddModalOpen(false);
      } else {
        alert('Erreur lors de l\'ajout: ' + result.error);
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout du compétiteur');
      console.error('Error adding competitor:', error);
    }
  };

  const handleEdit = async (competitorId) => {
    // TODO: Implement edit functionality
    console.log('Edit competitor:', competitorId);
  };

  const handleDelete = async (competitorId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compétiteur ?")) {
      try {
        const result = await competitorAPI.deleteCompetitor(competitorId);
        if (result.success) {
          await loadCompetitors(); // Reload to get updated data
        } else {
          alert('Erreur lors de la suppression: ' + result.error);
        }
      } catch (error) {
        alert('Erreur lors de la suppression du compétiteur');
        console.error('Error deleting competitor:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const competitors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',').map(value => value.trim());
        const competitor = {};
        
        headers.forEach((header, index) => {
          competitor[header] = values[index] || '';
        });
        
        // Transform CSV data to backend format
        const transformedCompetitor = {
          firstname: competitor.firstname || competitor.prenom || '',
          lastname: competitor.lastname || competitor.nom || '',
          birthday: competitor.birthday || competitor.dateNaissance || '',
          club: competitor.club || '',
          country: competitor.country || competitor.pays || 'France',
          weight: parseFloat(competitor.weight || competitor.poids || 0),
          rank: competitor.rank || competitor.grade || 'BLANC',
          gender: (competitor.gender || competitor.sexe || 'M') === 'M' ? 'H' : 'F'
        };
        
        competitors.push(transformedCompetitor);
      }
    }
    
    return competitors;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier CSV d'abord");
      return;
    }
    
    setLoading(true);
    try {
      const text = await selectedFile.text();
      const competitorsData = parseCSV(text);
      
      if (competitorsData.length === 0) {
        alert("Aucun compétiteur trouvé dans le fichier CSV");
        return;
      }

      const result = await competitorAPI.importCompetitorsCSV({ competitors: competitorsData });
      
      if (result.success) {
        alert(`Import réussi: ${result.data.imported} compétiteurs importés, ${result.data.failed} échecs`);
        await loadCompetitors(); // Reload to get updated data
        setSelectedFile(null);
      } else {
        alert('Erreur lors de l\'import: ' + result.error);
      }
    } catch (error) {
      alert('Erreur lors du traitement du fichier CSV');
      console.error('Error processing CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearList = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider la liste des compétiteurs ?")) {
      setLoading(true);
      try {
        // Delete all competitors one by one
        const deletePromises = competitors.map(comp => 
          competitorAPI.deleteCompetitor(comp.id)
        );
        await Promise.all(deletePromises);
        await loadCompetitors(); // Reload to get updated data
      } catch (error) {
        alert('Erreur lors de la suppression des compétiteurs');
        console.error('Error clearing competitors:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCompetitors = competitors.filter((comp) =>
    (comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     comp.firstName.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedDate === "" || comp.dateNaissance.startsWith(selectedDate)) &&
    (selectedGrade === "" || comp.categorie === selectedGrade)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompetitors = filteredCompetitors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompetitors.length / itemsPerPage);

  // Pagination navigation handlers
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          <p>Erreur: {error}</p>
          <button onClick={loadCompetitors} className={styles.retryBtn}>
            Réessayer
          </button>
        </div>
      )}
      
      <div className={styles.importSection}>
        

        <div className={styles.searchSection}>
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <p>Chargement des compétiteurs...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NOM</th>
                <th>PRÉNOM</th>
                <th>CLUB</th>
                <th>PAYS</th>
                <th>DATE DE NAISSANCE</th>
                <th>SEXE</th>
                <th>CATÉGORIE</th>
                <th>POIDS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentCompetitors.length > 0 ? (
                currentCompetitors.map((comp) => (
                  <tr key={comp.id}>
                    <td>{comp.name}</td>
                    <td>{comp.firstName}</td>
                    <td>{comp.club}</td>
                    <td>{comp.pays}</td>
                    <td>{comp.dateNaissance}</td>
                    <td>{comp.sexe}</td>
                    <td>{comp.categorie}</td>
                    <td>{comp.weight}kg</td>
                    <td className={styles.actionCell}>
                      <button 
                        className={styles.btnEdit} 
                        title="Modifier"
                        onClick={() => handleEdit(comp.id)}
                        disabled={loading}
                      >
                        ✏️
                      </button>
                      <button 
                        className={styles.btnDelete} 
                        title="Supprimer"
                        onClick={() => handleDelete(comp.id)}
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.noData}>
                    {error ? 'Erreur lors du chargement' : 'Aucun compétiteur trouvé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => handlePageClick(i + 1)} 
              className={currentPage === i + 1 ? styles.activePage : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</button>
          <span className={styles.pageInfo}>
            PAGE : {currentPage} / {totalPages}
          </span>
        </div>
      )}

      {/* Modal component */}
      <AjouterCompetiteurs
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default CompetitorTable;
