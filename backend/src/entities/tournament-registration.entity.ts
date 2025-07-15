import { EntitySchema } from "@mikro-orm/core";
import { v4 } from 'uuid';
import { User } from './user.entity.ts';
import { Tournament } from './Tournament.entity.ts';

// Statut d'une inscription à un tournoi
export enum RegistrationStatus {
  PENDING = 'pending',    // En attente de validation
  APPROVED = 'approved',  // Approuvé par un admin
  REJECTED = 'rejected',  // Rejeté par un admin
}

export class TournamentRegistration {
  id!: string;
  user!: User;          // L'utilisateur qui s'inscrit
  tournament!: Tournament; // Le tournoi auquel l'utilisateur s'inscrit
  status!: RegistrationStatus; // Statut de l'inscription
  adminComment?: string; // Commentaire éventuel de l'administrateur
  weight?: number;      // Poids de l'utilisateur pour ce tournoi
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export const TournamentRegistrationSchema = new EntitySchema({
  class: TournamentRegistration,
  properties: {
    id: { type: 'uuid', onCreate: () => v4(), primary: true },    user: { kind: 'm:1', entity: () => User, fieldName: 'user_id' },
    tournament: { kind: 'm:1', entity: () => Tournament, fieldName: 'tournament_id' },
    status: {
      enum: true, 
      items: () => Object.values(RegistrationStatus),
      default: RegistrationStatus.PENDING
    },
    adminComment: { type: 'string', nullable: true },
    weight: { type: 'number', nullable: true },
    createdAt: { type: 'Date', defaultRaw: 'now()' },
    updatedAt: { type: 'Date', defaultRaw: 'now()', onUpdate: () => new Date() }
  }
});
