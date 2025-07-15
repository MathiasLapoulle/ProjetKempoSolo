import React, { useState, useRef } from "react";
import styles from "./AddCompetitors.module.css";
import { competitorAPI } from "../../../services/api";

const AddCompetitorModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    firstName: "",
    grade: "",
    birthDate: "",
    sex: "",
    weight: "",
    club: "",
    country: "France"
  });
  
  const [csvFile, setCsvFile] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("manual"); // "manual" ou "csv"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const resetForm = () => {
    setForm({
      name: "",
      firstName: "",
      grade: "",
      birthDate: "",
      sex: "",
      weight: "",
      club: "",
      country: "France"
    });
    setCsvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        firstname: form.firstName,
        lastname: form.name,
        birthday: form.birthDate,
        club: form.club,
        country: form.country,
        weight: parseFloat(form.weight),
        rank: form.grade,
        gender: form.sex === "Homme" ? "H" : "F"
      };

      const result = await competitorAPI.createCompetitor(payload);
      
      if (result.success) {
        // Call the parent's onAdd callback to refresh the data
        onAdd(payload);
        resetForm();
        onClose();
      } else {
        alert("Erreur lors de l'ajout: " + result.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du compétiteur :", error);
      alert("Échec de l'ajout. Vérifiez la console pour plus de détails.");
    }
  };

  const parseCSVLine = (line) => {
    const result = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    result.push(currentField.trim());
    return result;
  };

  const validateCompetitorData = (competitor) => {
    const errors = [];
    
    if (!competitor.firstname) errors.push('Prénom manquant');
    if (!competitor.lastname) errors.push('Nom manquant');
    if (!competitor.birthday) errors.push('Date de naissance manquante');
    if (!competitor.rank) errors.push('Grade manquant');
    if (!competitor.gender) errors.push('Sexe manquant');
    
    // Validate date format
    if (competitor.birthday && !Date.parse(competitor.birthday)) {
      errors.push('Format de date invalide');
    }
    
    // Validate weight
    if (competitor.weight && (isNaN(competitor.weight) || competitor.weight <= 0)) {
      errors.push('Poids invalide');
    }
    
    return errors;
  };

  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    
    if (!csvFile) {
      alert("Veuillez sélectionner un fichier CSV");
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert("Le fichier CSV doit contenir au moins une ligne d'en-têtes et une ligne de données");
        return;
      }
      
      const headers = parseCSVLine(lines[0]).map(header => header.toLowerCase().trim());
      const competitors = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          try {
            const values = parseCSVLine(line);
            const competitor = {};
            
            headers.forEach((header, index) => {
              competitor[header] = values[index] || '';
            });
            
            // Transform CSV data to backend format with better field mapping
            const transformedCompetitor = {
              firstname: competitor.firstname || competitor.prenom || competitor.prénom || '',
              lastname: competitor.lastname || competitor.nom || '',
              birthday: competitor.birthday || competitor.dateNaissance || competitor.date_naissance || competitor['date de naissance'] || '',
              club: competitor.club || '',
              country: competitor.country || competitor.pays || 'France',
              weight: parseFloat(competitor.weight || competitor.poids || 0) || 0,
              rank: (() => {
                const rank = (competitor.rank || competitor.grade || '').toLowerCase();
                // Map common rank values to backend enum values
                if (rank.includes('blanc') || rank.includes('white')) return 'Ceinture Blanche';
                if (rank.includes('jaune') || rank.includes('yellow')) return 'Ceinture Jaune';
                if (rank.includes('orange')) return 'Ceinture Orange';
                if (rank.includes('vert') || rank.includes('green')) return 'Ceinture Verte';
                if (rank.includes('bleu') || rank.includes('blue')) return 'Ceinture Bleue';
                if (rank.includes('marron') || rank.includes('brown')) return 'Ceinture Marron';
                if (rank.includes('noire') || rank.includes('black')) {
                  if (rank.includes('1') || rank.includes('première') || rank.includes('premier')) return 'Ceinture Noire 1ère dan';
                  if (rank.includes('2') || rank.includes('deuxième')) return 'Ceinture Noire 2ème dan';
                  if (rank.includes('3') || rank.includes('troisième')) return 'Ceinture Noire 3ème dan';
                  return 'Ceinture Noire 1ère dan'; // Default to 1st dan
                }
                return 'Ceinture Blanche'; // Default to white belt
              })(),
              gender: (() => {
                const gender = (competitor.gender || competitor.sexe || 'M').toUpperCase();
                if (gender === 'F' || gender === 'FEMME' || gender === 'FEMALE') return 'F';
                if (gender === 'H' || gender === 'M' || gender === 'HOMME' || gender === 'MALE') return 'H';
                return 'H'; // Default to H
              })()
            };
            
            // Validate the competitor data
            const validationErrors = validateCompetitorData(transformedCompetitor);
            if (validationErrors.length > 0) {
              errors.push(`Ligne ${i + 1}: ${validationErrors.join(', ')}`);
              continue;
            }
            
            competitors.push(transformedCompetitor);
          } catch (lineError) {
            errors.push(`Ligne ${i + 1}: Erreur de parsing - ${lineError.message}`);
          }
        }
      }

      if (competitors.length === 0) {
        alert(`Aucun compétiteur valide trouvé dans le fichier CSV.\n\nErreurs détectées:\n${errors.join('\n')}`);
        return;
      }

      if (errors.length > 0) {
        const proceed = window.confirm(`${errors.length} erreur(s) détectée(s):\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}\n\nContinuer avec ${competitors.length} compétiteur(s) valide(s) ?`);
        if (!proceed) return;
      }

      const result = await competitorAPI.importCompetitorsCSV({ competitors });
      
      if (result.success) {
        let message = `Import réussi: ${result.data.imported} compétiteur(s) importé(s)`;
        if (result.data.failed > 0) {
          message += `, ${result.data.failed} échec(s)`;
        }
        alert(message);
        onAdd(null); // Signal to parent to refresh data
        resetForm();
        onClose();
      } else {
        alert("Erreur lors de l'import: " + result.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'import CSV :", error);
      alert("Échec de l'import. Vérifiez la console pour plus de détails.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Ajouter un Compétiteur</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "manual" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            Ajout Manuel
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "csv" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("csv")}
          >
            Import CSV
          </button>
        </div>

        {activeTab === "manual" ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nom:</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Prénom:</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Club:</label>
                <input
                  type="text"
                  name="club"
                  value={form.club}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Pays:</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={styles.formInput}
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Allemagne">Allemagne</option>
                  <option value="Espagne">Espagne</option>
                  <option value="Italie">Italie</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Grade:</label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                >
                  <option value="">Sélectionner</option>
                  <option value="Ceinture Blanche">Ceinture Blanche</option>
                  <option value="Ceinture Jaune">Ceinture Jaune</option>
                  <option value="Ceinture Orange">Ceinture Orange</option>
                  <option value="Ceinture Verte">Ceinture Verte</option>
                  <option value="Ceinture Bleue">Ceinture Bleue</option>
                  <option value="Ceinture Marron">Ceinture Marron</option>
                  <option value="Ceinture Noire 1er Dan">Ceinture Noire 1er Dan</option>
                  <option value="Ceinture Noire 2ème Dan">Ceinture Noire 2ème Dan</option>
                  <option value="Ceinture Noire 3ème Dan">Ceinture Noire 3ème Dan</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Date de Naissance:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Sexe:</label>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Poids (kg):</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  step="0.1"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className={styles.confirmButton}>
                Ajouter
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCsvSubmit} className={styles.csvForm}>
            <div className={styles.csvInstructions}>
              <h3>Instructions pour le fichier CSV</h3>
              <p>Le fichier CSV doit contenir les colonnes suivantes (noms flexibles) :</p>
              <ul>
                <li><strong>nom/lastname</strong> - Nom de famille</li>
                <li><strong>prenom/firstname</strong> - Prénom</li>
                <li><strong>club</strong> - Club d'appartenance</li>
                <li><strong>pays/country</strong> - Pays (optionnel, France par défaut)</li>
                <li><strong>grade/rank</strong> - Grade (ex: Ceinture Blanche, Ceinture Jaune, etc.)</li>
                <li><strong>dateNaissance/birthday/date_naissance</strong> - Date de naissance (YYYY-MM-DD)</li>
                <li><strong>sexe/gender</strong> - Sexe (H/F, M/F, Homme/Femme)</li>
                <li><strong>poids/weight</strong> - Poids en kg (optionnel)</li>
              </ul>
              <p>La première ligne doit contenir les en-têtes de colonne. Les champs peuvent être entre guillemets si ils contiennent des virgules.</p>
              <p><strong>Exemple:</strong> nom,prenom,club,grade,dateNaissance,sexe,poids</p>
            </div>
            
            <div className={styles.fileInputContainer}>
              <label htmlFor="csvFileInput" className={styles.fileLabel}>
                Sélectionner un fichier CSV
              </label>
              <input
                type="file"
                id="csvFileInput"
                accept=".csv"
                onChange={handleFileChange}
                className={styles.fileInput}
                ref={fileInputRef}
              />
              {csvFile && (
                <p className={styles.selectedFile}>
                  Fichier sélectionné: {csvFile.name}
                </p>
              )}
            </div>
            
            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className={styles.confirmButton} disabled={!csvFile}>
                Importer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCompetitorModal;
