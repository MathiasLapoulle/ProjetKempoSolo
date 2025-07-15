import React from "react";
import styles from "./RankingTable.module.css";

const RankingTable = ({ rankings }) => {
  return (
    <div>
      <h2>🏅 Classement :</h2>
      <table className={styles.rankingTable}>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Ippon</th>
            <th>Kekkou</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((player, index) => {
            let rowClass = "";
            if (index === 0) rowClass = styles.gold;
            else if (index === 1) rowClass = styles.silver;
            else if (index === 2) rowClass = styles.bronze;

            return (
              <tr key={index} className={rowClass}>
                <td>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}</td>
                <td>{player.name}</td>
                <td>{player.surname}</td>
                <td>{player.ippon}</td>
                <td>{player.kekkou}</td>
                <td>{player.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;
