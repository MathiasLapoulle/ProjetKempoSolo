import { config as dotenvConfig } from 'dotenv';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroORM } from '@mikro-orm/mysql';
import { v4 } from 'uuid';

// Charger les variables d'environnement
dotenvConfig();

async function checkAndCreateTournamentRegistrationTable() {
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
    console.log('Getting database connection...');
    const connection = orm.em.getConnection();
    const knex = orm.em.getKnex();
    
    console.log('Checking if tournament_registration table exists...');
    const exists = await knex.schema.hasTable('tournament_registration');
    console.log('Table exists:', exists);
    
    if (!exists) {
      console.log('Creating tournament_registration table...');
      
      try {
        await knex.schema.createTable('tournament_registration', (table) => {
          table.string('id', 36).primary();
          table.integer('user_id').notNullable();
          table.string('tournament_id', 36).notNullable();
          table.string('status', 50).defaultTo('pending').notNullable();
          table.string('admin_comment', 255).nullable();
          table.float('weight').nullable();
          table.datetime('created_at').defaultTo(knex.fn.now()).notNullable();
          table.datetime('updated_at').defaultTo(knex.fn.now()).notNullable();
          
          // Index uniquement, sans contrainte de clé étrangère
          table.index('user_id');
          table.index('tournament_id');
          table.unique(['user_id', 'tournament_id']);
        });
        
        console.log('Tournament registration table created successfully!');
      } catch (err) {
        console.error('Error creating table:', err);
      }
    }
    
    // Insérer une entrée de test
    if (exists) {
      console.log('Inserting test registration...');
      try {
        const testId = v4();
        const result = await knex('tournament_registration').insert({
          id: testId,
          user_id: 1, // Assurez-vous qu'un utilisateur avec cet ID existe
          tournament_id: '550e8400-e29b-41d4-a716-446655440000', // ID fictif pour le test
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        });
        
        console.log('Test registration inserted successfully:', result);
        
        // Vérifier l'insertion
        const inserted = await knex('tournament_registration').where('id', testId).first();
        console.log('Retrieved test registration:', inserted);
      } catch (err) {
        console.error('Error inserting test registration:', err);
      }
    }
    
  } catch (mainError) {
    console.error('Main error:', mainError);
  } finally {
    console.log('Closing connection...');
    await orm.close(true);
    console.log('Connection closed.');
  }
}

// Exécuter la fonction
checkAndCreateTournamentRegistrationTable()
  .then(() => {
    console.log('Process completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
