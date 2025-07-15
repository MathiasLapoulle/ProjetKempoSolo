import { Collection, EntitySchema } from "@mikro-orm/core";
import { EnumRank } from "./Tournament.entity.ts";
// Import supprimé pour éviter la dépendance circulaire
// Utilisera un import dynamique dans le schéma

export class User {
  id!: number;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  birthDate?: Date;
  club?: string;
  city?: string;
  grade?: string; // Grade de l'utilisateur (ceinture blanche, jaune, etc.)
  resetPasswordToken?: string; // Mappée à reset_password_token
  resetPasswordExpires?: Date; // Mappée à reset_password_expires
  // Ne pas initialiser la collection ici pour éviter la dépendance circulaire
  tournamentRegistrations?: Collection<any>;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export const UserSchema = new EntitySchema({
  class: User,
  properties: {    
    id: { type: 'number', primary: true, autoincrement: true },
    email: { type: 'string', unique: true },
    password: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    role: { type: 'string', default: 'user' },
    birthDate: { type: 'Date', nullable: true },
    club: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    grade: { enum: true, items: () => Object.values(EnumRank), nullable: true, fieldName: 'grade' },
    resetPasswordToken: { type: 'string', nullable: true, fieldName: 'reset_password_token' },
    resetPasswordExpires: { type: 'Date', nullable: true, fieldName: 'reset_password_expires' },
    // Suppression temporaire de la relation pour éviter les problèmes
    // Nous l'ajouterons via une migration si nécessaire plus tard
    createdAt: { type: 'Date', defaultRaw: 'now()' },
    updatedAt: { type: 'Date', defaultRaw: 'now()', onUpdate: () => new Date() }
  }
});