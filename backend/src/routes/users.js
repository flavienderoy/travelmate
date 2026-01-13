const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../config/firebase');

const router = express.Router();

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Récupérer les informations d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:userId', authenticateToken, async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const userData = userDoc.data();
    
    // Ne pas exposer toutes les informations sensibles
    res.json({
      uid: userData.uid,
      name: userData.name,
      picture: userData.picture,
      preferences: userData.preferences || {}
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Rechercher des utilisateurs par email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/search', authenticateToken, async (req, res, next) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis pour la recherche' });
    }

    // Recherche simple par email dans Firestore
    // En production, vous pourriez utiliser Algolia ou Elasticsearch
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(5)
      .get();

    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      });
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{userId}/trips:
 *   get:
 *     summary: Récupérer les voyages d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des voyages de l'utilisateur
 */
router.get('/:userId/trips', authenticateToken, async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur demande ses propres voyages ou qu'il est autorisé
    if (req.params.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const tripsSnapshot = await db.collection('trips')
      .where('participants', 'array-contains', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const trips = [];
    tripsSnapshot.forEach(doc => {
      trips.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(trips);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
