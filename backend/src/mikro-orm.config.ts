// mikro-orm.config.ts
import { MikroORM } from '@mikro-orm/core';
import { defineConfig, MySqlDriver } from '@mikro-orm/mysql';
import { Tournament } from './entities/Tournament.entity.ts';
import { Category } from './entities/Category.entity.ts';
import { Competitor } from './entities/Competitor.entity.ts';
import { Match } from './entities/match.entity.ts';
import { TournamentCompetitorCategory } from './entities/tournament-competitor-category.entity.ts';
import { AgeGroup } from './entities/age-group.entity.ts';
import { WeightCategory } from './entities/weight-category.ts';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { UserSchema } from './entities/user.entity.ts';

// Parse DATABASE_URL for production
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      dbName: url.pathname.substring(1), // Remove leading slash
    };
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dbName: process.env.DB_NAME || 'kempo_db',
  };
};

const dbConfig = getDatabaseConfig();

export default defineConfig({
  ...dbConfig,
  entities: [
    Tournament, 
    Category, 
    Competitor, 
    Match, 
    TournamentCompetitorCategory,
    AgeGroup,
    WeightCategory,
    UserSchema
  ],
  discovery: {
    warnWhenNoEntities: false, // Désactive l'avertissement quand aucune entité n'est trouvée via discovery
    requireEntitiesArray: true, // Force l'utilisation du tableau d'entités explicite
  },
  driver: MySqlDriver,
  allowGlobalContext: true,
  extensions: [Migrator, SeedManager],
})