import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentAPI, ranksAPI, ageGroupsAPI, weightCategoriesAPI } from '../../services/api';
import styles from './CreateTournament.module.css';

function CreateTournament() {
  const navigate = useNavigate();  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    city: '',
    gender: 'male',
    rank: '',
    system: 'poule',
    ageCategory: '',
    weightCategory: ''
  });

  const [ranks, setRanks] = useState([]);
  const [ageCategories, setAgeCategories] = useState([]);
  const [weightCategories, setWeightCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  // Fetch ranks, age categories, and weight categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch ranks using API service
        const ranksResult = await ranksAPI.getAllRanks();
        if (ranksResult.success) {
          setRanks(ranksResult.data);
        } else {
          console.error('Error fetching ranks:', ranksResult.error);
        }
        
        // Fetch age categories using API service
        const ageGroupsResult = await ageGroupsAPI.getAllAgeGroups();
        if (ageGroupsResult.success) {
          setAgeCategories(ageGroupsResult.data);
        } else {
          console.error('Error fetching age groups:', ageGroupsResult.error);
        }
        
        // Fetch weight categories using API service
        const weightCategoriesResult = await weightCategoriesAPI.getAllWeightCategories();
        if (weightCategoriesResult.success) {
          setWeightCategories(weightCategoriesResult.data);
        } else {
          console.error('Error fetching weight categories:', weightCategoriesResult.error);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Une erreur est survenue lors du chargement des données');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {      // Prepare tournament data for API
      const tournamentData = {
        name: formData.name,
        start_date: formData.start_date,
        city: formData.city || undefined,
        gender: formData.gender,
        rank: formData.rank,
        system: formData.system,
        // Optional fields based on selections
        ageCategory: formData.ageCategory || undefined,
        weightCategory: formData.weightCategory || undefined
      };

      const result = await tournamentAPI.createTournament(tournamentData);
      
      if (result.success) {
        setSuccess('Tournoi créé avec succès !');
        console.log('Tournament created:', result.data);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/tournois');
        }, 2000);
      } else {
        setError(result.error || 'Une erreur est survenue lors de la création du tournoi');
      }
    } catch (err) {
      console.error('Tournament creation error:', err);
      setError('Une erreur inattendue est survenue lors de la création du tournoi');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !ranks.length && !ageCategories.length && !weightCategories.length) {
    return <div className={styles.loading}>Chargement des données...</div>;
  }

  return (
    <div className={styles.createTournamentContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Création d'un nouveau tournoi</h1>
        <p className={styles.description}>
          Remplissez le formulaire ci-dessous pour créer un nouveau tournoi.
        </p>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nom du tournoi</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="Exemple: Tournoi international de Paris 2025"
          />
        </div>
          <div className={styles.formGroup}>
          <label htmlFor="start_date" className={styles.label}>Date de début</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="city" className={styles.label}>Ville</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ville du tournoi (optionnel)"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="gender" className={styles.label}>Catégorie de genre</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="male">Hommes</option>
            <option value="female">Femmes</option>
            <option value="mixed">Mixte</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="rank" className={styles.label}>Grade</label>
          <select
            id="rank"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Sélectionnez un grade</option>
            {ranks.map((rank, index) => (
              <option key={index} value={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="ageCategory" className={styles.label}>Catégorie d'âge</label>
          <select
            id="ageCategory"
            name="ageCategory"
            value={formData.ageCategory}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Sélectionnez une catégorie d'âge</option>
            {ageCategories.map(age => (
              <option key={age.id} value={age.id}>
                {age.name} ({age.minAge}-{age.maxAge} ans)
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="weightCategory" className={styles.label}>Catégorie de poids</label>
          <select
            id="weightCategory"
            name="weightCategory"
            value={formData.weightCategory}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Sélectionnez une catégorie de poids</option>
            {weightCategories.map(weight => (
              <option key={weight.id} value={weight.id}>
                {weight.name} ({weight.minWeight}-{weight.maxWeight} kg)
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="system" className={styles.label}>Système de tournoi</label>
          <select
            id="system"
            name="system"
            value={formData.system}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="poule">Poules</option>
            <option value="elimination">Élimination directe</option>
            <option value="mixed">Système mixte (poules + élimination)</option>
          </select>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/tournois')}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer le tournoi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTournament;