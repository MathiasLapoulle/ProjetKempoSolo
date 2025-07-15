const mysql = require('mysql2/promise');

async function createTable() {
  console.log('Connecting to database...');
  
  try {
    // Créer une connexion
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kempo_db'
    });
    
    console.log('Connected to database successfully!');
    
    // Vérifier si la table existe
    const [tables] = await connection.query('SHOW TABLES LIKE "tournament_registration"');
    const tableExists = tables.length > 0;
    console.log('Tournament registration table exists:', tableExists);
    
    if (!tableExists) {
      console.log('Creating tournament registration table...');
      
      // Créer la table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS tournament_registration (
          id VARCHAR(36) PRIMARY KEY,
          user_id INT NOT NULL,
          tournament_id VARCHAR(36) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending' NOT NULL,
          admin_comment VARCHAR(255) NULL,
          weight FLOAT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
          INDEX (user_id),
          INDEX (tournament_id),
          UNIQUE KEY unique_registration (user_id, tournament_id)
        )
      `);
      
      console.log('Table created successfully!');
    }
    
    // Fermer la connexion
    await connection.end();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTable()
  .then(() => {
    console.log('Process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
