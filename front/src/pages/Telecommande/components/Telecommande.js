import React, { useState, useEffect, useRef } from "react";
import styles from "./Telecommande.module.css";

const Telecommande = () => {
  // État pour les scores des compétiteurs
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // État pour le minuteur
  const [time, setTime] = useState(180); // 3 minutes en secondes
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Formatage du temps en minutes:secondes
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Gestion des scores
  const incrementScore = (player) => {
    if (player === 1) setScore1(prev => prev + 1);
    else setScore2(prev => prev + 1);
  };

  const decrementScore = (player) => {
    if (player === 1) setScore1(prev => Math.max(0, prev - 1));
    else setScore2(prev => Math.max(0, prev - 1));
  };

  // Gestion des pénalités/fautes
  const applyPenalty = (player) => {
    // Ajoute 2 points à l'adversaire
    if (player === 1) setScore2(prev => prev + 2);
    else setScore1(prev => prev + 2);
  };

  // Gestion du timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(180); // 3 minutes
  };

  const endMatch = () => {
    setIsRunning(false);
    setTime(180); // 3 minutes
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>Julien WECKERLE</strong>
          <span>Chatenois</span>
        </div>

        {/* Contrôles pour le joueur 1 */}
        <div className={styles.controls}>

          {/* Bouton - qui incrémente le score */}
          <button className={styles.btn} onClick={() => decrementScore(1)}>-</button>
          <div className={styles.score}>{score1}</div>

          {/* Bouton + qui décrémente le score */}
      
          <button className={styles.btn} onClick={() => incrementScore(1)}>+</button>
        </div>

        <button 
          className={`${styles.btn} ${styles.penaltyBtn}`} 
          onClick={() => applyPenalty(1)}
          style={{ background: "#d32f2f", marginLeft: "10px" }}
        >
          FAUTE
        </button>
      </div>


      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>Mesut AYSEL</strong>
          <span>Nancy</span>
        </div>
        <div className={styles.controls}>
          
          <button className={styles.btn} onClick={() => decrementScore(2)}>-</button>
          <div className={styles.score}>{score2}</div>
          <button className={styles.btn} onClick={() => incrementScore(2)}>+</button>
        </div>
        <button 
          className={`${styles.btn} ${styles.penaltyBtn}`} 
          onClick={() => applyPenalty(2)}
          style={{ background: "#d32f2f", marginLeft: "10px" }}
        >
          FAUTE
        </button>
      </div>

      <div className={`${styles.card} ${styles.timerCard}`}>
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.timerControls}>
          <button className={`${styles.ctrlBtn} ${styles.select}`}>SELECT</button>
          <button 
            className={`${styles.ctrlBtn} ${styles.start}`}
            onClick={startTimer}
          >
            START
          </button>
          <button 
            className={`${styles.ctrlBtn} ${styles.pause}`}
            onClick={pauseTimer}
          >
            PAUSE
          </button>
          <button 
            className={`${styles.ctrlBtn} ${styles.reset}`}
            onClick={resetTimer}
          >
            RESET
          </button>
          <button 
            className={`${styles.ctrlBtn} ${styles.end}`}
            onClick={endMatch}
          >
            END
          </button>
        </div>
      </div>
    </div>
  );
};

export default Telecommande;
