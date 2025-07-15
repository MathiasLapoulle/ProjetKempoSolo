import styles from './Competitors.module.css'
import CompetiteursTable from './Components/CompetitorsTable';

function Competitors(){
    return (
        <div className={styles.competitorsContainer}>
            <h1 className={styles.title}>Liste Compétiteurs</h1>
            <CompetiteursTable />
        </div>
    )
}

export default Competitors