// Database configuration
export const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  dbName: process.env.DB_NAME || 'kempo_db',
  url: process.env.DATABASE_URL
};

// JWT configuration
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-default-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

// Server configuration
export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '4000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Mail configuration
export const MAIL_CONFIG = {
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
  fromEmail: process.env.FROM_EMAIL || 'noreply@kemposolo.com',
  fromName: process.env.FROM_NAME || 'KempoSolo'
};
