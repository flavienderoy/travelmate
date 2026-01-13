const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, tripSchema, updateTripSchema } = require('../middleware/validation');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Récupérer tous les voyages de l'utilisateur
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des voyages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    console.log('🔍 === RÉCUPÉRATION DES VOYAGES ===');
    console.log('User:', req.user.uid);
    console.log('DB disponible:', !!db);
    
    // Récupérer tous les voyages (sans orderBy pour éviter les problèmes d'index)
    const tripsSnapshot = await db.collection('trips')
      .where('participants', 'array-contains', req.user.uid)
      .get();

    console.log('✅ Query Firestore réussie, nombre de documents:', tripsSnapshot.size);

    const trips = [];
    tripsSnapshot.forEach(doc => {
      const tripData = doc.data();
      trips.push({
        id: doc.id,
        ...tripData
      });
    });

    // Trier manuellement par date de création (plus récent d'abord)
    trips.sort((a, b) => {
      const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
      const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      return dateB - dateA;
    });

    console.log('✅ Voyages récupérés et triés:', trips.length);
    res.json(trips);
  } catch (error) {
    console.error('❌ === ERREUR LORS DE LA RÉCUPÉRATION DES VOYAGES ===');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    
    // Réponse d'erreur détaillée
    res.status(500).json({
      error: 'Erreur lors de la récupération des voyages',
      message: error.message,
      code: error.code
    });
  }
});

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Créer un nouveau voyage
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Voyage créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/', authenticateToken, validate(tripSchema), async (req, res, next) => {
  try {
    console.log('🔍 === CRÉATION DE VOYAGE ===');
    console.log('User:', req.user.uid);
    console.log('Body:', req.body);
    
    const tripData = {
      ...req.body,
      id: uuidv4(),
      createdBy: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      itinerary: [],
      budget: [],
      tasks: []
    };

    console.log('🔍 Tentative de sauvegarde dans Firestore...');
    console.log('DB disponible:', !!db);
    
    await db.collection('trips').doc(tripData.id).set(tripData);
    console.log('✅ Voyage sauvegardé dans Firestore');

    res.status(201).json({
      message: 'Voyage créé avec succès',
      trip: tripData
    });
  } catch (error) {
    console.error('❌ === ERREUR LORS DE LA CRÉATION DU VOYAGE ===');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    next(error);
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Récupérer un voyage par ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du voyage
 *       404:
 *         description: Voyage non trouvé
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.id).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json({
      id: tripDoc.id,
      ...trip
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Mettre à jour un voyage
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: Voyage mis à jour avec succès
 *       404:
 *         description: Voyage non trouvé
 */
router.put('/:id', authenticateToken, validate(updateTripSchema), async (req, res, next) => {
  try {
    console.log('🔍 === MODIFICATION DE VOYAGE ===');
    console.log('Trip ID:', req.params.id);
    console.log('User:', req.user.uid);
    console.log('Body:', req.body);
    
    const tripDoc = await db.collection('trips').doc(req.params.id).get();
    
    if (!tripDoc.exists) {
      console.log('❌ Voyage non trouvé');
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    console.log('🔍 Créateur du voyage:', trip.createdBy);
    
    if (trip.createdBy !== req.user.uid) {
      console.log('❌ Accès refusé - Pas le créateur');
      return res.status(403).json({ error: 'Seul le créateur peut modifier le voyage' });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    console.log('🔍 Données à mettre à jour:', updateData);
    await db.collection('trips').doc(req.params.id).update(updateData);
    console.log('✅ Voyage mis à jour avec succès');

    res.json({
      message: 'Voyage mis à jour avec succès',
      trip: { id: req.params.id, ...trip, ...updateData }
    });
  } catch (error) {
    console.error('❌ === ERREUR LORS DE LA MODIFICATION ===');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    next(error);
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Supprimer un voyage
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voyage supprimé avec succès
 *       404:
 *         description: Voyage non trouvé
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    console.log('🔍 === SUPPRESSION DE VOYAGE ===');
    console.log('Trip ID:', req.params.id);
    console.log('User:', req.user.uid);
    
    const tripDoc = await db.collection('trips').doc(req.params.id).get();
    
    if (!tripDoc.exists) {
      console.log('❌ Voyage non trouvé');
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    console.log('🔍 Créateur du voyage:', trip.createdBy);
    
    if (trip.createdBy !== req.user.uid) {
      console.log('❌ Accès refusé - Pas le créateur');
      return res.status(403).json({ error: 'Seul le créateur peut supprimer le voyage' });
    }

    console.log('🔍 Suppression du voyage...');
    await db.collection('trips').doc(req.params.id).delete();
    console.log('✅ Voyage supprimé avec succès');

    res.json({ message: 'Voyage supprimé avec succès' });
  } catch (error) {
    console.error('❌ === ERREUR LORS DE LA SUPPRESSION ===');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    next(error);
  }
});

/**
 * @swagger
 * /api/trips/{id}/invite:
 *   post:
 *     summary: Inviter un utilisateur à un voyage
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Invitation envoyée avec succès
 */
router.post('/:id/invite', authenticateToken, async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const tripDoc = await db.collection('trips').doc(req.params.id).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (trip.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Seul le créateur peut inviter des participants' });
    }

    // Ici, vous pourriez envoyer un email d'invitation
    // Pour l'instant, on simule juste la réponse
    res.json({
      message: `Invitation envoyée à ${email}`,
      email: email
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
