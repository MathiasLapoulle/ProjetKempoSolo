import { config as dotenvConfig } from 'dotenv';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroORM } from '@mikro-orm/mysql';

// Charger les variables d'environnement
dotenvConfig();

async function addGradeColumn() {
  console.log('Initializing direct database connection...');
    // Utiliser les informations de connexion du fichier de configuration
  // Créer une connexion directe sans passer par les entités
  const orm = await MikroORM.init({
    driver: MySqlDriver,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    dbName: 'kempo_db',
    allowGlobalContext: true,
    discovery: { warnWhenNoEntities: false },
    entities: [],
  });

  try {
    console.log('Adding grade column to user table...');
    const knex = orm.em.getKnex();
    
    // Vérifier si la colonne existe déjà
    const hasGradeColumn = await knex.schema.hasColumn('user', 'grade');
    
    if (!hasGradeColumn) {
      // Ajouter la colonne grade
      await knex.schema.table('user', table => {
        table.string('grade', 100).nullable();
      });
      console.log('Grade column added successfully!');
    } else {
      console.log('Grade column already exists in user table.');
    }
  } catch (error) {
    console.error('Error adding grade column:', error);
  } finally {
    await orm.close();
    console.log('Database connection closed.');
  }
}

// Exécuter la fonction
addGradeColumn()
  .then(() => {
    console.log('Process completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
