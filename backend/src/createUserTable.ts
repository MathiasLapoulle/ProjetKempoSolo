import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.ts';
import * as dotenv from 'dotenv';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

async function createUserTable() {
  console.log('Création de la table utilisateur...');
  
  try {
    // Connexion à la BDD
    const orm = await MikroORM.init(config);
    const em = orm.em.fork();
    const connection = orm.em.getConnection();
    
    console.log('Création de la table user...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`user\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`first_name\` varchar(255) NOT NULL,
        \`last_name\` varchar(255) NOT NULL,
        \`role\` varchar(255) NOT NULL DEFAULT 'user',
        \`birth_date\` datetime NULL,
        \`club\` varchar(255) NULL,
        \`city\` varchar(255) NULL,
        \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`email_unique\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    
    // Vérification si un admin existe déjà
    console.log('Vérification des utilisateurs administrateurs existants...');
    const result = await connection.execute('SELECT * FROM `user` WHERE `role` = ?', ['admin']);
    const adminExists = Array.isArray(result) && result.length > 0;
    
    if (!adminExists) {
      console.log('Création du compte administrateur par défaut...');
      
      // Cryptage du mot de passe
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Insertion directe de l'administrateur
      await connection.execute(
        'INSERT INTO `user` (`email`, `password`, `first_name`, `last_name`, `role`, `club`, `city`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['admin@kenpo.com', hashedPassword, 'Admin', 'Kenpo', 'admin', 'Kenpo Club', 'Paris']
      );
      
      console.log('Compte administrateur créé avec succès:');
      console.log('Email: admin@kenpo.com');
      console.log('Mot de passe: admin123');
    } else {
      console.log('Un compte administrateur existe déjà.');
    }
    
    await orm.close(true);
    console.log('Création de la table utilisateur terminée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la création de la table utilisateur:', error);
    process.exit(1);
  }
}

createUserTable();
