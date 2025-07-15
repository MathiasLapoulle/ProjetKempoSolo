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

export default defineConfig({
  dbName: 'kempo_db',
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: 3306, // Port MySQL par défaut
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