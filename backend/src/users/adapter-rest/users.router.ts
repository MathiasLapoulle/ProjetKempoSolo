import { User, UserSchema } from '../../entities/user.entity.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { 
  changePasswordRoute, 
  createAdminRoute, 
  getMeRoute, 
  loginUserRoute, 
  registerUserRoute, 
  updateProfileRoute,
  forgotPasswordRoute,
  resetPasswordRoute
} from './users.openapi.ts';
import type { 
  ChangePasswordInput, 
  CreateAdminInput, 
  LoginUserInput, 
  RegisterUserInput, 
  UpdateProfileInput,
  ForgotPasswordInput,
  ResetPasswordInput
} from './users.schema.ts';
import { getApp } from '../../api/get-app.ts';
import type { Context } from 'hono';
import type { AppEnv } from '../../api/get-app.ts';
import { sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../../utils/mailjet.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // À configurer dans un environnement de production
const JWT_EXPIRES_IN = '24h';

// Middleware pour vérifier le token JWT
const authMiddleware = async (ctx: Context<AppEnv>, next: () => Promise<void>) => {
  try {
    const authHeader = ctx.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.json({ message: 'Token non fourni ou format invalide' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Récupération de l'utilisateur depuis la base de données
    const em = ctx.get('em');
    const user = await em.findOne(User, { id: decoded.id });

    if (!user) {
      return ctx.json({ message: 'Utilisateur non trouvé' }, 401);
    }

    // Stocke l'utilisateur dans le contexte
    (ctx as any).user = user;
    await next();
  } catch (error) {
    return ctx.json({ message: 'Token invalide' }, 401);
  }
};

// Middleware pour vérifier les rôles
const roleMiddleware = (requiredRole: string) => {
  return async (ctx: Context<AppEnv>, next: () => Promise<void>) => {
    try {
      const authHeader = ctx.req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.json({ message: 'Token non fourni ou format invalide' }, 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Récupération de l'utilisateur depuis la base de données
      const em = ctx.get('em');
      const user = await em.findOne(User, { id: decoded.id });

      if (!user) {
        return ctx.json({ message: 'Utilisateur non trouvé' }, 401);
      }

      // Vérification du rôle
      if (user.role !== requiredRole) {
        return ctx.json({ message: 'Accès refusé - Vous n\'avez pas les privilèges nécessaires' }, 403);
      }      // Stocke l'utilisateur dans le contexte
      (ctx as any).user = user;
      await next();
    } catch (error) {
      return ctx.json({ message: 'Token invalide' }, 401);
    }
  };
};

export function buildUsersRouter() {
  const router = getApp();
  // Route d'enregistrement
  router.openapi(registerUserRoute, async (ctx) => {
    try {
      // Alternative approach to validation
      const body = await ctx.req.json();
      
      if (!body || !body.email || !body.password || !body.firstName || !body.lastName) {
        return ctx.json({ message: 'Tous les champs requis doivent être remplis' }, 400);
      }
        const { email, password, firstName, lastName, birthDate, club, city, grade } = body;
      const em = ctx.get("em");

      // Vérifie si l'email existe déjà
      const existingUser = await em.findOne(User, { email });
      if (existingUser) {
        return ctx.json({ message: 'Cet email est déjà utilisé' }, 409);
      }

      // Cryptage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);    // Création de l'utilisateur
    const user = em.create(User, {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user', // Par défaut, tous les nouveaux utilisateurs ont le rôle 'user'
      birthDate: birthDate ? new Date(birthDate) : undefined,
      club,
      city,
      grade, // Ajout du grade
      createdAt: new Date(),
      updatedAt: new Date(),
    });

      // Sauvegarde en base de données
      await em.persistAndFlush(user);

      // Génération du token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });      // Retourne le token et les informations utilisateur (sans le mot de passe)
      return ctx.json({
        message: 'Compte créé avec succès ! Bienvenue dans notre communauté.',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      }, 201);
    } catch (error) {
      console.error('Registration error:', error);
      return ctx.json({ message: 'Erreur lors de l\'enregistrement' }, 500);
    }
  });  // Route de connexion
  router.openapi(loginUserRoute, async (ctx) => {
    try {
      // Alternative approach to validation
      const body = await ctx.req.json();
      
      if (!body || !body.email || !body.password) {
        return ctx.json({ message: 'Email et mot de passe requis' }, 400);
      }
      
      const { email, password } = body;
      const em = ctx.get('em');

      // Recherche de l'utilisateur par email
      const user = await em.findOne(User, { email });

      if (!user) {
        return ctx.json({ message: 'Email ou mot de passe incorrect' }, 400);
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ctx.json({ message: 'Email ou mot de passe incorrect' }, 400);
      }

      // Génération du token JWT
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });      // Retourne le token et les informations utilisateur (sans le mot de passe)
      return ctx.json({
        message: 'Connexion réussie !',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return ctx.json({ message: 'Erreur lors de la connexion' }, 500);
    }
  });

  // Route pour récupérer le profil de l'utilisateur connecté
  router.openapi(getMeRoute, async (ctx) => {
    // Cette route nécessite une authentification
    try {
      // Nous avons intégré la logique d'authentification directement ici 
      // pour éviter les problèmes de typage avec le middleware
      const authHeader = ctx.req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.json({ message: 'Token non fourni ou format invalide' }, 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Récupération de l'utilisateur depuis la base de données
      const em = ctx.get('em');
      const user = await em.findOne(User, { id: decoded.id });

      if (!user) {
        return ctx.json({ message: 'Utilisateur non trouvé' }, 401);
      }      // Retourne les informations utilisateur complètes (sans le mot de passe)
      return ctx.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        birthDate: user.birthDate,
        club: user.club,
        city: user.city,
        grade: user.grade,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return ctx.json({ message: 'Erreur lors de la récupération du profil' }, 500);
    }
  });

  // Route pour mettre à jour le profil utilisateur
  router.openapi(updateProfileRoute, async (ctx) => {
    try {
      // Récupération du token et vérification
      const authHeader = ctx.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.json({ message: 'Token non fourni ou format invalide' }, 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const em = ctx.get('em');
      const user = await em.findOne(User, { id: decoded.id });

      if (!user) {
        return ctx.json({ message: 'Utilisateur non trouvé' }, 401);
      }      const body = await ctx.req.json();
      
      if (!body || !body.email || !body.firstName || !body.lastName) {
        return ctx.json({ message: 'Email, prénom et nom sont requis' }, 400);
      }
        const { email, firstName, lastName, birthDate, club, city, grade, currentPassword, newPassword } = body;
      
      // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
      if (email !== user.email) {
        const existingUser = await em.findOne(User, { email });
        if (existingUser) {
          return ctx.json({ message: 'Cet email est déjà utilisé' }, 409);
        }
      }
      
      // Mise à jour des champs de base
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      if (birthDate) {
        user.birthDate = new Date(birthDate);
      }
      if (club) user.club = club;
      if (city) user.city = city;
      if (grade) user.grade = grade;
      
      // Si changement de mot de passe demandé
      if (currentPassword && newPassword) {        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isPasswordValid) {
          return ctx.json({ message: 'Mot de passe actuel incorrect' }, 400);
        }
        
        // Cryptage du nouveau mot de passe
        user.password = await bcrypt.hash(newPassword, 10);
      }
      
      // Sauvegarde des modifications
      await em.persistAndFlush(user);
        // Retourne les données utilisateur mises à jour (sans le mot de passe)
      return ctx.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        birthDate: user.birthDate,
        club: user.club,
        city: user.city,
        grade: user.grade,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return ctx.json({ message: 'Erreur lors de la mise à jour du profil' }, 500);
    }
  });

  // Route pour changer le mot de passe
  router.openapi(changePasswordRoute, async (ctx) => {
    try {
      // Récupération du token et vérification
      const authHeader = ctx.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.json({ message: 'Token non fourni ou format invalide' }, 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const em = ctx.get('em');
      const user = await em.findOne(User, { id: decoded.id });

      if (!user) {
        return ctx.json({ message: 'Utilisateur non trouvé' }, 401);
      }      const body = await ctx.req.json();
      
      if (!body || !body.currentPassword || !body.newPassword) {
        return ctx.json({ message: 'Ancien et nouveau mot de passe requis' }, 400);
      }
      
      const { currentPassword, newPassword } = body;
      
      // Vérification du mot de passe actuel
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return ctx.json({ message: 'Mot de passe actuel incorrect' }, 400);
      }
      
      // Cryptage et enregistrement du nouveau mot de passe
      user.password = await bcrypt.hash(newPassword, 10);
      await em.persistAndFlush(user);
      
      return ctx.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      console.error('Change password error:', error);
      return ctx.json({ message: 'Erreur lors du changement de mot de passe' }, 500);
    }
  });

  // Route pour créer un compte administrateur
  router.openapi(createAdminRoute, async (ctx) => {
    try {
      // Vérification que l'utilisateur a les droits d'administrateur
      const authHeader = ctx.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.json({ message: 'Token non fourni ou format invalide' }, 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const em = ctx.get('em');
      const currentUser = await em.findOne(User, { id: decoded.id });

      if (!currentUser) {
        return ctx.json({ message: 'Utilisateur non trouvé' }, 401);
      }

      // Vérification du rôle
      if (currentUser.role !== 'admin') {
        return ctx.json({ message: 'Accès refusé - Vous n\'avez pas les privilèges nécessaires' }, 403);
      }      // Alternative approach to validation for admin creation
      const body = await ctx.req.json();
      
      if (!body || !body.email || !body.password || !body.firstName || !body.lastName) {
        return ctx.json({ message: 'Tous les champs requis doivent être remplis' }, 400);
      }
      
      const { email, password, firstName, lastName, birthDate, club, city } = body;
      
      // Vérifier si l'email existe déjà
      const existingUser = await em.findOne(User, { email });
      if (existingUser) {
        return ctx.json({ message: 'Cet email est déjà utilisé' }, 409);
      }
      
      // Cryptage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Création de l'utilisateur administrateur
      const newAdmin = em.create(User, {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'admin',
        birthDate: birthDate ? new Date(birthDate) : undefined,
        club,
        city,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      await em.persistAndFlush(newAdmin);
      
      // Retourne les informations de l'administrateur créé (sans le mot de passe)
      return ctx.json({
        id: newAdmin.id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: newAdmin.role,
        birthDate: newAdmin.birthDate,
        club: newAdmin.club,
        city: newAdmin.city,
        createdAt: newAdmin.createdAt,
        updatedAt: newAdmin.updatedAt,
      }, 201);
    } catch (error) {
      console.error('Create admin error:', error);
      return ctx.json({ message: 'Erreur lors de la création du compte administrateur' }, 500);
    }  });

  // Route pour demander une réinitialisation de mot de passe
  router.openapi(forgotPasswordRoute, async (ctx) => {
    try {
      const body = await ctx.req.json();
      
      if (!body || !body.email) {
        return ctx.json({ message: 'Email requis' }, 400);
      }
      
      const { email } = body;
      const em = ctx.get('em');
      
      // Recherche de l'utilisateur par email
      const user = await em.findOne(User, { email });
      
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      if (!user) {
        // Pour des raisons de sécurité, on renvoie un message générique même si l'email n'existe pas
        return ctx.json({ 
          message: 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous sera envoyé.' 
        });
      }
      
      // Génération d'un token aléatoire
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Définition de l'expiration du token (1 heure)
      const resetTokenExpiration = new Date();
      resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1);
      
      // Sauvegarde du token dans la base de données
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiration;
      
      await em.persistAndFlush(user);
      
      // Envoi de l'email avec Mailjet
      await sendPasswordResetEmail(
        user.email,
        resetToken,
        user.firstName,
        user.lastName
      );
      
      return ctx.json({ 
        message: 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous sera envoyé.' 
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return ctx.json({ message: 'Erreur lors de la demande de réinitialisation du mot de passe' }, 500);
    }
  });
  
  // Route pour réinitialiser le mot de passe avec un token
  router.openapi(resetPasswordRoute, async (ctx) => {
    try {
      const body = await ctx.req.json();
      
      if (!body || !body.token || !body.password) {
        return ctx.json({ message: 'Token et nouveau mot de passe requis' }, 400);
      }
      
      const { token, password } = body;
      const em = ctx.get('em');
      
      // Recherche de l'utilisateur par token
      const user = await em.findOne(User, { 
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }  // Vérifie que le token n'a pas expiré
      });
      
      if (!user) {
        return ctx.json({ message: 'Le token est invalide ou a expiré' }, 400);
      }
      
      // Hashage du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Mise à jour de l'utilisateur
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;  // Réinitialisation du token
      user.resetPasswordExpires = undefined;  // Réinitialisation de l'expiration
      
      await em.persistAndFlush(user);
      
      // Envoi d'un email de confirmation
      await sendPasswordResetConfirmationEmail(
        user.email,
        user.firstName,
        user.lastName
      );
      
      return ctx.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      console.error('Reset password error:', error);
      return ctx.json({ message: 'Erreur lors de la réinitialisation du mot de passe' }, 500);
    }
  });

  return router;
}