/**
 * Middleware de gestion des erreurs global
 * @param {Error} err - Erreur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.details.map(detail => detail.message)
    });
  }

  // Erreur Firebase
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({
      error: 'Erreur d\'authentification',
      message: err.message
    });
  }

  // Erreur Firestore
  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(400).json({
      error: 'Erreur de base de données',
      message: err.message
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
