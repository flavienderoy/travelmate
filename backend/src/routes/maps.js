const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, itineraryStepSchema } = require('../middleware/validation');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /api/maps/{tripId}/itinerary:
 *   get:
 *     summary: Récupérer l'itinéraire d'un voyage
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itinéraire du voyage
 */
router.get('/:tripId/itinerary', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(trip.itinerary || []);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/maps/{tripId}/itinerary:
 *   post:
 *     summary: Ajouter une étape à l'itinéraire
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *                   address:
 *                     type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *                 enum: [transport, accommodation, activity, restaurant, other]
 *               cost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Étape ajoutée avec succès
 */
router.post('/:tripId/itinerary', authenticateToken, validate(itineraryStepSchema), async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const newStep = {
      id: uuidv4(),
      ...req.body,
      addedBy: req.user.uid,
      addedAt: new Date()
    };

    const updatedItinerary = [...(trip.itinerary || []), newStep];
    
    await db.collection('trips').doc(req.params.tripId).update({
      itinerary: updatedItinerary,
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Étape ajoutée avec succès',
      step: newStep
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/maps/{tripId}/itinerary/{stepId}:
 *   put:
 *     summary: Modifier une étape de l'itinéraire
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stepId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étape modifiée avec succès
 */
router.put('/:tripId/itinerary/:stepId', authenticateToken, validate(itineraryStepSchema), async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const itinerary = trip.itinerary || [];
    const stepIndex = itinerary.findIndex(step => step.id === req.params.stepId);
    
    if (stepIndex === -1) {
      return res.status(404).json({ error: 'Étape non trouvée' });
    }

    itinerary[stepIndex] = {
      ...itinerary[stepIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    await db.collection('trips').doc(req.params.tripId).update({
      itinerary: itinerary,
      updatedAt: new Date()
    });

    res.json({
      message: 'Étape modifiée avec succès',
      step: itinerary[stepIndex]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/maps/{tripId}/itinerary/{stepId}:
 *   delete:
 *     summary: Supprimer une étape de l'itinéraire
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stepId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étape supprimée avec succès
 */
router.delete('/:tripId/itinerary/:stepId', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const itinerary = trip.itinerary || [];
    const filteredItinerary = itinerary.filter(step => step.id !== req.params.stepId);
    
    await db.collection('trips').doc(req.params.tripId).update({
      itinerary: filteredItinerary,
      updatedAt: new Date()
    });

    res.json({ message: 'Étape supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/maps/places:
 *   get:
 *     summary: Rechercher des lieux avec Google Places API
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/places', authenticateToken, async (req, res, next) => {
  try {
    const { query, location } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Paramètre de recherche requis' });
    }

    // Simulation de l'API Google Places
    // En production, vous utiliseriez la vraie API Google Places
    const mockResults = [
      {
        place_id: 'mock_place_1',
        name: `${query} - Restaurant`,
        formatted_address: '123 Rue Example, Paris, France',
        geometry: {
          location: {
            lat: 48.8566,
            lng: 2.3522
          }
        },
        rating: 4.5,
        types: ['restaurant', 'food']
      },
      {
        place_id: 'mock_place_2',
        name: `${query} - Hôtel`,
        formatted_address: '456 Avenue Example, Paris, France',
        geometry: {
          location: {
            lat: 48.8606,
            lng: 2.3376
          }
        },
        rating: 4.2,
        types: ['lodging']
      }
    ];

    res.json({
      results: mockResults,
      status: 'OK'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
