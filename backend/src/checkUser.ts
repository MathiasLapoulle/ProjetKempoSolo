import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import config from './mikro-orm.config.ts';
import { User } from './entities/user.entity.ts';
import bcrypt from 'bcrypt';

async function checkAndCreateUser() {
  let orm: MikroORM<MySqlDriver>;
  
  try {
    console.log('Connecting to database...');
    orm = await MikroORM.init(config);
    
    const userRepo = orm.em.getRepository(User);
    
    // Check if user exists
    const existingUser = await userRepo.findOne({ email: 'john.doe@example.com' });
    
    if (existingUser) {
      console.log('User found:', {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role
      });
      
      // Verify password
      const isPasswordValid = await bcrypt.compare('mySecurePassword123', existingUser.password);
      console.log('Password is valid:', isPasswordValid);
      
    } else {
      console.log('User not found. Creating user...');
      
      // Create user
      const hashedPassword = await bcrypt.hash('mySecurePassword123', 10);
      const newUser = new User();
      newUser.email = 'john.doe@example.com';
      newUser.firstName = 'John';
      newUser.lastName = 'Doe';
      newUser.password = hashedPassword;
      newUser.role = 'user';
      
      await userRepo.persistAndFlush(newUser);
      console.log('User created successfully:', {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (orm) {
      await orm.close();
    }
  }
}

checkAndCreateUser();
