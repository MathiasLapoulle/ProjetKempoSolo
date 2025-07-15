import { config as dotenvConfig } from 'dotenv';
import { Collection, EntitySchema } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MikroORM } from '@mikro-orm/mysql';
import { v4 } from 'uuid';

// Charger les variables d'environnement
dotenvConfig();

// Définition des classes et schémas sans dépendances circulaires

// 1. Définition minimale de User sans la relation vers TournamentRegistration
class User {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
}

// 2. Définition minimale de Tournament
class Tournament {
  id!: string;
  name!: string;
}

// 3. Définition de TournamentRegistration avec références One-To-Many
class TournamentRegistration {
  id!: string;
  user!: User;
  tournament!: Tournament;
  status!: string;
  adminComment?: string;
  weight?: number;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

// Schéma EntitySchema pour TournamentRegistration
const TournamentRegistrationSchema = new EntitySchema({
  class: TournamentRegistration,
  tableName: 'tournament_registration',
  properties: {
    id: { type: 'uuid', primary: true },
    user: { kind: 'm:1', entity: () => User, fieldName: 'user_id' },
    tournament: { kind: 'm:1', entity: () => Tournament, fieldName: 'tournament_id' },
    status: { type: 'string', default: 'pending' },
    adminComment: { type: 'string', nullable: true, fieldName: 'admin_comment' },
    weight: { type: 'number', nullable: true },
    createdAt: { type: 'Date', fieldName: 'created_at' },
    updatedAt: { type: 'Date', fieldName: 'updated_at' }
  }
});

// Schéma EntitySchema pour User sans relation bidirectionnelle
const UserSchema = new EntitySchema({
  class: User,
  tableName: 'user',
  properties: {
    id: { type: 'number', primary: true },
    email: { type: 'string' },
    firstName: { type: 'string', fieldName: 'first_name' },
    lastName: { type: 'string', fieldName: 'last_name' }
  }
});

// Schéma EntitySchema pour Tournament
const TournamentSchema = new EntitySchema({
  class: Tournament,
  tableName: 'tournament',
  properties: {
    id: { type: 'uuid', primary: true },
    name: { type: 'string' }
  }
});

async function testRelationships() {
  console.log('Initializing ORM with minimal schemas...');
    // Utiliser les informations de connexion du fichier de configuration
  const orm = await MikroORM.init({
    driver: MySqlDriver,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    dbName: 'kempo_db',
    entities: [UserSchema, TournamentSchema, TournamentRegistrationSchema],
    debug: true
  });

  try {
    console.log('Testing read operations...');
    const em = orm.em.fork();
    
    // Essayer de récupérer quelques utilisateurs
    const users = await em.find(User, {}, { limit: 3 });
    console.log(`Found ${users.length} users`);
    
    // Essayer de récupérer quelques tournois
    const tournaments = await em.find(Tournament, {}, { limit: 3 });
    console.log(`Found ${tournaments.length} tournaments`);
    
    // Si des utilisateurs et des tournois existent, essayer de créer une inscription
    if (users.length > 0 && tournaments.length > 0) {
      console.log('Testing create operation for tournament registration...');
      
      // Créer une nouvelle inscription
      const registration = new TournamentRegistration();
      registration.id = v4();
      registration.user = users[0];
      registration.tournament = tournaments[0];
      registration.status = 'pending';
      registration.createdAt = new Date();
      registration.updatedAt = new Date();
      
      await em.persistAndFlush(registration);
      console.log('Successfully created a tournament registration!');
      
      // Essayer de lire cette inscription
      const savedRegistration = await em.findOne(TournamentRegistration, { id: registration.id });
      if (savedRegistration) {
        console.log('Successfully read the tournament registration');
        console.log(`User: ${savedRegistration.user.firstName} ${savedRegistration.user.lastName}`);
        console.log(`Tournament: ${savedRegistration.tournament.name}`);
      }
    }
  } catch (error) {
    console.error('Error testing relationships:', error);
  } finally {
    await orm.close();
    console.log('Database connection closed.');
  }
}

// Exécuter la fonction
testRelationships()
  .then(() => {
    console.log('Process completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
