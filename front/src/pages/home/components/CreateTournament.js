import React, { useState } from "react";
import styles from "./CreateTournament.module.css";
import { tournamentAPI } from "../../../services/api";

const CreationTournoi = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [multiDay, setMultiDay] = useState(false);

  // Grade selections
  const [whiteSelected, setWhiteSelected] = useState(false);
  const [yellowSelected, setYellowSelected] = useState(false);
  const [orangeSelected, setOrangeSelected] = useState(false);
  const [greenSelected, setGreenSelected] = useState(false);
  const [blueSelected, setBlueSelected] = useState(false);
  const [brownSelected, setBrownSelected] = useState(false);
  const [black1Selected, setBlack1Selected] = useState(false);
  const [black2Selected, setBlack2Selected] = useState(false);
  const [black3Selected, setBlack3Selected] = useState(false);
  const [black4Selected, setBlack4Selected] = useState(false);
  const [black5Selected, setBlack5Selected] = useState(false);
  const [black6Selected, setBlack6Selected] = useState(false);

  // Gender selection
  const [maleSelected, setMaleSelected] = useState(false);
  const [femaleSelected, setFemaleSelected] = useState(false);
  const [mixedSelected, setMixedSelected] = useState(false);

  // System selection
  const [poolSystem, setPoolSystem] = useState(false);
  const [directEliminationSystem, setDirectEliminationSystem] = useState(false);

  // Import selection
  const [manualImport, setManualImport] = useState(false);
  const [automaticImport, setAutomaticImport] = useState(false);

  const getSelectedGrades = () => {
    const grades = [];
    if (whiteSelected) grades.push("Ceinture Blanche");
    if (yellowSelected) grades.push("Ceinture Jaune");
    if (orangeSelected) grades.push("Ceinture Orange");
    if (greenSelected) grades.push("Ceinture Verte");
    if (blueSelected) grades.push("Ceinture Bleue");
    if (brownSelected) grades.push("Ceinture Marron");
    if (black1Selected) grades.push("Ceinture Noire 1er Dan");
    if (black2Selected) grades.push("Ceinture Noire 2ème Dan");
    if (black3Selected) grades.push("Ceinture Noire 3ème Dan");
    if (black4Selected) grades.push("Ceinture Noire 4ème Dan");
    if (black5Selected) grades.push("Ceinture Noire 5ème Dan");
    if (black6Selected) grades.push("Ceinture Noire 6ème Dan");
    return grades;
  };

  const getSelectedGenders = () => {
    const genders = [];
    if (maleSelected) genders.push("Homme");
    if (femaleSelected) genders.push("Femme");
    if (mixedSelected) genders.push("Mixte");
    return genders;
  };

  const getSelectedSystems = () => {
    const systems = [];
    if (poolSystem) systems.push("Poules");
    if (directEliminationSystem) systems.push("Élimination directe");
    return systems;
  };

  const getImportType = () => {
    if (manualImport) return "Manuellement";
    if (automaticImport) return "Automatiquement";
    return "";
  };

  const handleSubmit = async () => {
    const grades = getSelectedGrades();
    const genders = getSelectedGenders();
    const systems = getSelectedSystems();
    const importType = getImportType();

    if (
      !name.trim() ||
      !date ||
      grades.length === 0 ||
      genders.length === 0 ||
      systems.length === 0 ||
      !importType
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const tournamentData = {
      name: name,
      rank: grades[0] || "",
      gender: genders[0] || "",
      system: systems[0] || "",
      start_date: multiDay ? fromDate : date,
      end_date: multiDay ? toDate : date
    };

    try {
      const result = await tournamentAPI.createTournament(tournamentData);
      
      if (result.success) {
        console.log("✅ Tournoi créé:", result.data);
        alert("Tournoi créé avec succès!");
        handleReset();
      } else {
        console.error("❌ Erreur:", result.error);
        alert(result.error);
      }
    } catch (err) {
      console.error("❌ Erreur réseau:", err);
      alert("Erreur réseau");
    }
  };

  const handleReset = () => {
    setName("");
    setDate("");
    setFromDate("");
    setToDate("");
    setMultiDay(false);
    
    setWhiteSelected(false);
    setYellowSelected(false);
    setOrangeSelected(false);
    setGreenSelected(false);
    setBlueSelected(false);
    setBrownSelected(false);
    setBlack1Selected(false);
    setBlack2Selected(false);
    setBlack3Selected(false);
    setBlack4Selected(false);
    setBlack5Selected(false);
    setBlack6Selected(false);
    
    setMaleSelected(false);
    setFemaleSelected(false);
    setMixedSelected(false);
    
    setPoolSystem(false);
    setDirectEliminationSystem(false);
    
    setManualImport(false);
    setAutomaticImport(false);
  };

  return (
    <div className={styles.container}>
      <button className={styles.openButton} onClick={() => setIsOpen(true)}>
        Créer un Tournoi
      </button>

      <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ""}`}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Création du tournoi</h2>

          <div className={styles.formGroup}>
            <label>Insérer nom du tournoi :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du tournoi"
              className={styles.textInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Date du tournoi :</label>
            <div className={styles.dateInputContainer}>
              <input
                type="date"
                value={multiDay ? fromDate : date}
                onChange={(e) => multiDay ? setFromDate(e.target.value) : setDate(e.target.value)}
                className={styles.dateInput}
              />
              {multiDay && (
                <>
                  <span className={styles.dateRangeSeparator}>Au</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </>
              )}
              <div className={styles.calendarIcon}>📅</div>
            </div>
            <div className={styles.multiDayCheckbox}>
              <input
                type="checkbox"
                id="multiDay"
                checked={multiDay}
                onChange={(e) => setMultiDay(e.target.checked)}
              />
              <label htmlFor="multiDay">Tournoi sur plusieurs jours ?</label>
            </div>
          </div>

          <div className={styles.gradeSection}>
            <div className={styles.sectionTitle}>GRADE :</div>
            <div className={styles.gradesGrid}>
              <div className={styles.gradesColumn}>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="whiteBelt"
                    checked={whiteSelected}
                    onChange={() => setWhiteSelected(!whiteSelected)}
                  />
                  <label htmlFor="whiteBelt">Ceinture Blanche</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="yellowBelt"
                    checked={yellowSelected}
                    onChange={() => setYellowSelected(!yellowSelected)}
                  />
                  <label htmlFor="yellowBelt">Ceinture Jaune</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="orangeBelt"
                    checked={orangeSelected}
                    onChange={() => setOrangeSelected(!orangeSelected)}
                  />
                  <label htmlFor="orangeBelt">Ceinture Orange</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="greenBelt"
                    checked={greenSelected}
                    onChange={() => setGreenSelected(!greenSelected)}
                  />
                  <label htmlFor="greenBelt">Ceinture Verte</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="blueBelt"
                    checked={blueSelected}
                    onChange={() => setBlueSelected(!blueSelected)}
                  />
                  <label htmlFor="blueBelt">Ceinture Bleue</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="brownBelt"
                    checked={brownSelected}
                    onChange={() => setBrownSelected(!brownSelected)}
                  />
                  <label htmlFor="brownBelt">Ceinture Marron</label>
                </div>
              </div>
              <div className={styles.gradesColumn}>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="black1"
                    checked={black1Selected}
                    onChange={() => setBlack1Selected(!black1Selected)}
                  />
                  <label htmlFor="black1">Ceinture Noire 1er Dan</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="black2"
                    checked={black2Selected}
                    onChange={() => setBlack2Selected(!black2Selected)}
                  />
                  <label htmlFor="black2">Ceinture Noire 2ème Dan</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="black3"
                    checked={black3Selected}
                    onChange={() => setBlack3Selected(!black3Selected)}
                  />
                  <label htmlFor="black3">Ceinture Noire 3ème Dan</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="black4"
                    checked={black4Selected}
                    onChange={() => setBlack4Selected(!black4Selected)}
                  />
                  <label htmlFor="black4">Ceinture Noire 4ème Dan</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="black5"
                    checked={black5Selected}
                    onChange={() => setBlack5Selected(!black5Selected)}
                  />
                  <label htmlFor="black5">Ceinture Noire 5ème Dan</label>
                </div>
                <div className={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id="black6"
                    checked={black6Selected}
                    onChange={() => setBlack6Selected(!black6Selected)}
                  />
                  <label htmlFor="black6">Ceinture Noire 6ème Dan</label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.genderSection}>
            <div className={styles.sectionTitle}>GENRE :</div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxItem}>
                <input 
                  type="checkbox"
                  id="male"
                  checked={maleSelected}
                  onChange={() => setMaleSelected(!maleSelected)}
                />
                <label htmlFor="male">Homme</label>
              </div>
              <div className={styles.checkboxItem}>
                <input 
                  type="checkbox"
                  id="female"
                  checked={femaleSelected}
                  onChange={() => setFemaleSelected(!femaleSelected)}
                />
                <label htmlFor="female">Femme</label>
              </div>
              <div className={styles.checkboxItem}>
                <input 
                  type="checkbox"
                  id="mixed"
                  checked={mixedSelected}
                  onChange={() => setMixedSelected(!mixedSelected)}
                />
                <label htmlFor="mixed">Mixte</label>
              </div>
            </div>
          </div>

          <div className={styles.systemSection}>
            <div className={styles.sectionTitle}>SYSTÈME D'ÉLIMINATION :</div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxItem}>
                <input 
                  type="checkbox"
                  id="pool"
                  checked={poolSystem}
                  onChange={() => setPoolSystem(!poolSystem)}
                />
                <label htmlFor="pool">Poules</label>
              </div>
              <div className={styles.checkboxItem}>
                <input 
                  type="checkbox"
                  id="direct"
                  checked={directEliminationSystem}
                  onChange={() => setDirectEliminationSystem(!directEliminationSystem)}
                />
                <label htmlFor="direct">Élimination directe</label>
              </div>
            </div>
          </div>

          <div className={styles.importSection}>
            <div className={styles.sectionTitle}>IMPORTER LISTE PARTICIPANTS :</div>
            <div className={styles.radioContainer}>
              <div className={styles.radioItem}>
                <input 
                  type="radio"
                  id="manual"
                  name="importType"
                  checked={manualImport}
                  onChange={() => {
                    setManualImport(true);
                    setAutomaticImport(false);
                  }}
                />
                <label htmlFor="manual">Manuellement</label>
              </div>
              <div className={styles.radioItem}>
                <input 
                  type="radio"
                  id="automatic"
                  name="importType"
                  checked={automaticImport}
                  onChange={() => {
                    setAutomaticImport(true);
                    setManualImport(false);
                  }}
                />
                <label htmlFor="automatic">Automatiquement</label>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button 
              className={styles.addButton} 
              onClick={handleSubmit}
            >
              Ajouter le tournoi
            </button>
            <button 
              className={styles.resetButton} 
              onClick={handleReset}
            >
              Reset
            </button>
            <button 
              className={styles.backButton} 
              onClick={() => setIsOpen(false)}
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationTournoi;
