import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.ts';
import * as dotenv from 'dotenv';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

async function initDatabase() {
  console.log('Initialisation de la base de données...');
  
  try {
    // Connexion à la BDD
    const orm = await MikroORM.init(config);
    const em = orm.em.fork();
    const generator = orm.getSchemaGenerator();    // Création des tables
    console.log('Création du schéma de la base de données...');
    await generator.createSchema();
    
    // S'assurer que la table 'user' est créée correctement
    console.log('Vérification de la table user...');
    const connection = orm.em.getConnection();
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
    console.log('Vérification des utilisateurs existants...');
    const users = await em.find(User, {});
    
    if (users.length === 0) {
      console.log('Création du compte administrateur par défaut...');
      
      // Cryptage du mot de passe
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Création de l'administrateur par défaut
      const admin = em.create(User, {
        email: 'admin@kenpo.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Kenpo',
        role: 'admin',
        club: 'Kenpo Club',
        city: 'Paris',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      await em.persistAndFlush(admin);
      
      console.log('Compte administrateur créé avec succès:');
      console.log('Email: admin@kenpo.com');
      console.log('Mot de passe: admin123');
    } else {
      console.log(`${users.length} utilisateur(s) existe(nt) déjà dans la base de données.`);
    }
    
    await orm.close(true);
    console.log('Initialisation de la base de données terminée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

initDatabase();
