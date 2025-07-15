import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { AdminSeeder } from './seeders/AdminSeeder.ts';
import * as dotenv from 'dotenv';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

async function createAdmin() {
  console.log('Initialisation de la connexion à la base de données...');
  const orm = await MikroORM.init(config);
  
  console.log('Création du compte administrateur...');
  const seeder = orm.getSeeder();
  await seeder.seed(AdminSeeder);
  
  await orm.close(true);
  console.log('Opération terminée.');
}

createAdmin().catch(error => {
  console.error('Erreur lors de la création du compte administrateur:', error);
  process.exit(1);
});
