// filepath: c:\Users\tverb\Documents\projet\app\backend\src\users\adapter-rest\users.schema.ts
import { z } from 'zod';

// Schéma pour l'enregistrement d'un utilisateur
export const RegisterUserSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  birthDate: z.string().optional(),
  club: z.string().optional(),
  city: z.string().optional(),
});

// Type dérivé du schéma d'enregistrement
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

// Schéma pour la création d'un administrateur
export const CreateAdminSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  birthDate: z.string().optional(),
  club: z.string().optional(),
  city: z.string().optional(),
});

// Type dérivé du schéma de création d'admin
export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;

// Schéma pour la connexion d'un utilisateur
export const LoginUserSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// Type dérivé du schéma de connexion
export type LoginUserInput = z.infer<typeof LoginUserSchema>;

// Schéma pour la réponse d'authentification
export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
  }),
});

// Schéma pour la demande de réinitialisation de mot de passe
export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
});

// Type dérivé du schéma de demande de réinitialisation
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

// Schéma pour la réinitialisation du mot de passe
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
  password: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
});

// Type dérivé du schéma de réinitialisation
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Schéma pour les informations utilisateur (sans mot de passe)
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  birthDate: z.date().nullable().optional(),
  club: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponse = z.infer<typeof UserSchema>;

// Schéma pour la mise à jour du profil utilisateur
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  club: z.string().optional(),
  city: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// Schéma pour le changement de mot de passe
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;