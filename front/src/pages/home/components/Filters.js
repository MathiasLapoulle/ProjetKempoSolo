import React from "react";
import styles from "./Filters.module.css";

const Filter = ({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  selectedCategory,
  setSelectedCategory
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterRow}>
        <div className={styles.filterItem}>
          <label htmlFor="searchTournament">
            <i className={styles.searchIcon}>🔍</i> Rechercher:
          </label>
          <input
            type="text"
            id="searchTournament"
            placeholder="Nom du tournoi"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterItem}>
          <label htmlFor="dateFilter">
            <i className={styles.calendarIcon}>📅</i> Date:
          </label>
          <input
            type="date"
            id="dateFilter"
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.filterItem}>
          <label htmlFor="categoryFilter">
            <i className={styles.categoryIcon}>🏆</i> Grade:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Tous les grades</option>
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
      </div>
    </div>
  );
};

export default Filter;
