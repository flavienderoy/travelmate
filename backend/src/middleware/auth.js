const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');

/**
 * Middleware d'authentification Firebase
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    // Vérifier le token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

/**
 * Middleware d'autorisation pour vérifier si l'utilisateur est propriétaire d'une ressource
 * @param {string} resourceField - Champ contenant l'ID du propriétaire
 */
const authorizeOwner = (resourceField = 'createdBy') => {
  return (req, res, next) => {
    const resource = req.resource || req.trip || req.budget || req.task;
    
    if (!resource) {
      return res.status(404).json({ error: 'Ressource non trouvée' });
    }

    if (resource[resourceField] !== req.user.uid) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    next();
  };
};

/**
 * Middleware pour vérifier si l'utilisateur est participant d'un voyage
 */
const authorizeParticipant = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.body.tripId;
    
    if (!tripId) {
      return res.status(400).json({ error: 'ID du voyage requis' });
    }

    const { db } = require('../config/firebase');
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Vous n\'êtes pas participant de ce voyage' });
    }

    req.trip = trip;
    next();
  } catch (error) {
    console.error('Erreur d\'autorisation participant:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  authenticateToken,
  authorizeOwner,
  authorizeParticipant
};
