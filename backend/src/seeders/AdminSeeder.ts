import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity.ts';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Vérifie si un admin existe déjà
    const existingAdmin = await em.findOne(User, { role: 'admin' });
    
    if (!existingAdmin) {
      // Crée un administrateur par défaut
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
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
      
      console.log('Compte administrateur créé avec succès');
      console.log('Email: admin@kenpo.com');
      console.log('Mot de passe: admin123');
    } else {
      console.log('Un compte administrateur existe déjà');
    }
  }
}
