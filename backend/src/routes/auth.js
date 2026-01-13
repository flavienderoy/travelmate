const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../config/firebase');

const router = express.Router();

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    // Le middleware authenticateToken a déjà vérifié le token et ajouté req.user
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 */
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      name: name || req.user.name,
      picture: req.user.picture,
      preferences: preferences || {},
      updatedAt: new Date()
    };

    // Sauvegarder ou mettre à jour le profil dans Firestore
    await db.collection('users').doc(req.user.uid).set(userData, { merge: true });

    res.json({
      message: 'Profil mis à jour avec succès',
      user: userData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Vérifier un token Firebase
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token valide
 *       401:
 *         description: Token invalide
 */
router.post('/verify', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const { admin } = require('../config/firebase');
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    res.json({
      valid: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      }
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Token invalide'
    });
  }
});

module.exports = router;
