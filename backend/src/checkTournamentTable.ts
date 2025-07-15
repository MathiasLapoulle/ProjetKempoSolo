import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';

async function checkTournamentTable() {
  const orm = await MikroORM.init(config);
  
  try {
    const connection = orm.em.getConnection();
    const result = await connection.execute('DESCRIBE tournament');
    console.log('Tournament table structure:');
    console.table(result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await orm.close();
  }
}

checkTournamentTable();
