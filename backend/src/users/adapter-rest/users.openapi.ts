// filepath: c:\Users\tverb\Documents\projet\app\backend\src\users\adapter-rest\users.openapi.ts
import { createRoute, z } from '@hono/zod-openapi';
import {
  AuthResponseSchema,
  LoginUserSchema,
  RegisterUserSchema,
  UserSchema,
  CreateAdminSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema
} from './users.schema.ts';

// Route pour l'enregistrement d'un nouveau utilisateur
export const registerUserRoute = createRoute({
  method: 'post',
  path: '/register',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RegisterUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: AuthResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input data',
    },
    409: {
      description: 'Email already exists',
    },
  },
});

// Route pour la connexion d'un utilisateur
export const loginUserRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User logged in successfully',
      content: {
        'application/json': {
          schema: AuthResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid credentials',
    },
  },
});

// Route pour récupérer le profil de l'utilisateur connecté
export const getMeRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'User profile retrieved successfully',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid or missing token',
    },
  },
});

// Route pour mettre à jour le profil utilisateur
export const updateProfileRoute = createRoute({
  method: 'put',
  path: '/update',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User profile updated successfully',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: 'Invalid input data',
    },
    401: {
      description: 'Unauthorized - Invalid or missing token',
    },
    409: {
      description: 'Email already exists',
    },
  },
});

// Route pour changer le mot de passe
export const changePasswordRoute = createRoute({
  method: 'put',
  path: '/password',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChangePasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password changed successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid current password',
    },
    401: {
      description: 'Unauthorized - Invalid or missing token',
    },
  },
});

// Route pour créer un compte administrateur
export const createAdminRoute = createRoute({
  method: 'post',
  path: '/create-admin',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAdminSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Admin user created successfully',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: 'Invalid input data',
    },
    401: {
      description: 'Unauthorized - Invalid or missing token',
    },
    403: {
      description: 'Forbidden - User does not have admin privileges',
    },
    409: {
      description: 'Email already exists',
    },
  },
});

// Route pour demander une réinitialisation de mot de passe
export const forgotPasswordRoute = createRoute({
  method: 'post',
  path: '/forgot-password',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ForgotPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset email sent successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input data',
    },
    500: {
      description: 'Server error',
    },
  },
});

// Route pour réinitialiser le mot de passe
export const resetPasswordRoute = createRoute({
  method: 'post',
  path: '/reset-password',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ResetPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset successful',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid or expired token',
    },
    500: {
      description: 'Server error',
    },
  },
});