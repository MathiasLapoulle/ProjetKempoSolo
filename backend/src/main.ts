import { serve } from '@hono/node-server';
import { registerAppRoutes } from './api/register-app-routes.ts'
import { getApp } from './api/get-app.ts'
import { EntityManager } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { Tournament } from './entities/Tournament.entity.ts';
import { contextStorage } from 'hono/context-storage';
import { cors } from 'hono/cors';
import * as dotenv from 'dotenv';
import { SERVER_CONFIG } from './config/environment.ts';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

const orm = await MikroORM.init(config);
const em = orm.em;

const httpApp = getApp();

httpApp.use(contextStorage())

httpApp.use(async (c, next) => {
  c.set('em', em)
  await next()
})

// Configuration CORS pour production
httpApp.use(cors({
  origin: SERVER_CONFIG.nodeEnv === 'production' 
    ? [SERVER_CONFIG.corsOrigin]
    : ['http://localhost:3000'],
  credentials: true
}))

// Health check endpoint
httpApp.get('/health', (c) => {
  return c.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: SERVER_CONFIG.nodeEnv
  });
});

const app = registerAppRoutes(httpApp)

const port = SERVER_CONFIG.port;

serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  console.log(`API documentation is available on http://localhost:${info.port}/docs`)
  console.log(`Health check available on http://localhost:${info.port}/health`)
})