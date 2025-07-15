import { createRoute, z } from '@hono/zod-openapi';
import { ForgotPasswordSchema, ResetPasswordSchema } from './users.schema.ts';

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
    404: {
      description: 'Email not found',
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
