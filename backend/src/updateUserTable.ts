import mysql from 'mysql2/promise';

// Configuration directe de connexion à la base de données
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'kempo_db'
};

async function updateUserTable() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(dbConfig);  
  try {
    console.log('Checking if columns exist...');
      // Vérifie si les colonnes existent déjà
    const [rows] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME IN ('reset_password_token', 'reset_password_expires')
    `, [dbConfig.database, 'user']);
    
    // @ts-ignore - Gestion du type de retour pour mysql2
    const existingColumns = rows.map((row: any) => row.COLUMN_NAME);
    
    // Ajoute reset_password_token si nécessaire
    if (!existingColumns.includes('reset_password_token')) {
      console.log('Adding reset_password_token column...');
      await connection.execute('ALTER TABLE user ADD COLUMN reset_password_token VARCHAR(255) NULL');
      console.log('reset_password_token column added successfully!');
    } else {
      console.log('reset_password_token column already exists');
    }
    
    // Ajoute reset_password_expires si nécessaire
    if (!existingColumns.includes('reset_password_expires')) {
      console.log('Adding reset_password_expires column...');
      await connection.execute('ALTER TABLE user ADD COLUMN reset_password_expires DATETIME NULL');
      console.log('reset_password_expires column added successfully!');
    } else {
      console.log('reset_password_expires column already exists');
    }
    
    console.log('Database updated successfully!');
  } catch (error) {
    console.error('Error updating user table:', error);
  } finally {
    await connection.end();
    console.log('Connection closed');
  }
}

updateUserTable()
  .then(() => {
    console.log('Script completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
