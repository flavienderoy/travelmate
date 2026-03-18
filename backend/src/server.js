const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const userRoutes = require('./routes/users');
const mapsRoutes = require('./routes/maps');
const budgetRoutes = require('./routes/budget');
const taskRoutes = require('./routes/tasks');
const { errorHandler } = require('./middleware/errorHandler');
const { swaggerSpec, swaggerUi } = require('./config/swagger');

const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de sécurité
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use(limiter);

// Middleware
// Utiliser logger.stream pour morgan si nécessaire, ou garder morgan pour les logs HTTP standard
app.use(morgan('combined'));
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim());

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('Blocked by CORS:', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/tasks', taskRoutes);

// Route de santé
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    message: 'OK',
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  res.status(200).json(healthcheck);
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'TravelMate API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  logger.info(`🚀 Serveur TravelMate démarré sur le port ${PORT}`);
  logger.info(`📚 Documentation API disponible sur http://localhost:${PORT}/api-docs`);
});

module.exports = app;
