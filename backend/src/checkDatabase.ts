import { config as dotenvConfig } from 'dotenv';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroORM } from '@mikro-orm/mysql';

// Charger les variables d'environnement
dotenvConfig();

async function checkDatabaseStructure() {
  console.log('Initializing direct database connection...');
  
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
    console.log('Checking database tables...');
    const knex = orm.em.getKnex();
    
    // Vérifier si la table existe déjà
    const userTableExists = await knex.schema.hasTable('user');
    console.log('User table exists:', userTableExists);
    
    if (userTableExists) {
      // Vérifier les colonnes de la table user
      const userColumns = await knex.table('user').columnInfo();
      console.log('User table columns:', Object.keys(userColumns));
      console.log('Grade column details:', userColumns['grade']);
    }
    
    const tournamentRegTableExists = await knex.schema.hasTable('tournament_registration');
    console.log('Tournament registration table exists:', tournamentRegTableExists);
    
    if (tournamentRegTableExists) {
      // Vérifier les colonnes de la table tournament_registration
      const regColumns = await knex.table('tournament_registration').columnInfo();
      console.log('Tournament registration table columns:', Object.keys(regColumns));
    }
    
    // Créer la table si elle n'existe pas
    if (!tournamentRegTableExists) {
      console.log('Creating tournament_registration table...');
      
      await knex.schema.createTable('tournament_registration', table => {
        table.uuid('id').primary();
        table.integer('user_id').notNullable();
        table.uuid('tournament_id').notNullable();
        table.string('status').defaultTo('pending').notNullable();
        table.string('admin_comment').nullable();
        table.float('weight').nullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
        
        // Index pour les performances de requête
        table.index('user_id');
        table.index('tournament_id');
        table.unique(['user_id', 'tournament_id']);
      });
      
      console.log('Tournament registration table created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await orm.close();
    console.log('Database connection closed.');
  }
}

// Exécuter la fonction
checkDatabaseStructure()
  .then(() => {
    console.log('Process completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
