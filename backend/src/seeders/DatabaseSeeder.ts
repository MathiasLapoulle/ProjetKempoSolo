import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AgeGroup } from '../entities/age-group.entity.ts';
import { AdminSeeder } from './AdminSeeder.ts';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    // Exécute le seeder pour créer un administrateur par défaut
    await this.call(em, [AdminSeeder]);
    
    const mini_poussin = em.create(AgeGroup, {
      name: "Mini-Poussin",
      age_min: 0,
      age_max: 5
  });

  const poussin = em.create(AgeGroup, {
      name: "Poussin",
      age_min: 6,
      age_max: 7
  });

  const pupille = em.create(AgeGroup, {
      name: "Pupille",
      age_min: 8,
      age_max: 9
  });

  const benjamin = em.create(AgeGroup, {
      name: "Benjamin",
      age_min: 10,
      age_max: 11
  });

  const minime = em.create(AgeGroup, {
      name: "Minime",
      age_min: 12,
      age_max: 13
  });

  const cadet = em.create(AgeGroup, {
      name: "Cadet",
      age_min: 14,
      age_max: 15
  });

  const junior = em.create(AgeGroup, {
      name: "Junior",
      age_min: 16,
      age_max: 17
  });

  const senior = em.create(AgeGroup, {
      name: "Senior",
      age_min: 18,
      age_max: 40
  });

  const veteran = em.create(AgeGroup, {
      name: "Vétéran",
      age_min: 41,
      age_max: 100
  });
  }

}
