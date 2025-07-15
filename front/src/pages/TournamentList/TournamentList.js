import React from "react";
import Filters from "../home/components/Filters";
import TournoiTable from "../home/components/TournamentTable";
import styles from "./TournamentList.module.css";

function TournamentList() {
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Liste des Tournois</h1>
        <p className={styles.description}>
          Gérez tous vos tournois en cours et à venir. Créez, modifiez et lancez vos tournois facilement.
        </p>
      </div>

      <TournoiTable />
    </div>
  );
}

export default TournamentList;