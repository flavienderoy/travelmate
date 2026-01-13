const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, budgetItemSchema } = require('../middleware/validation');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /api/budget/{tripId}:
 *   get:
 *     summary: Récupérer le budget d'un voyage
 *     tags: [Budget]
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
 *         description: Budget du voyage
 */
router.get('/:tripId', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const budget = trip.budget || [];
    
    // Calculer le total par catégorie
    const summary = budget.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.amount;
      return acc;
    }, {});

    const total = Object.values(summary).reduce((sum, amount) => sum + amount, 0);

    res.json({
      items: budget,
      summary: summary,
      total: total,
      participants: trip.participants
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budget/{tripId}:
 *   post:
 *     summary: Ajouter un élément au budget
 *     tags: [Budget]
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
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [transport, accommodation, food, activities, shopping, other]
 *               date:
 *                 type: string
 *                 format: date
 *               paidBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Élément ajouté au budget
 */
router.post('/:tripId', authenticateToken, validate(budgetItemSchema), async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const newItem = {
      id: uuidv4(),
      ...req.body,
      addedBy: req.user.uid,
      addedAt: new Date()
    };

    const updatedBudget = [...(trip.budget || []), newItem];
    
    await db.collection('trips').doc(req.params.tripId).update({
      budget: updatedBudget,
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Élément ajouté au budget',
      item: newItem
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budget/{tripId}/{itemId}:
 *   put:
 *     summary: Modifier un élément du budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élément modifié avec succès
 */
router.put('/:tripId/:itemId', authenticateToken, validate(budgetItemSchema), async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const budget = trip.budget || [];
    const itemIndex = budget.findIndex(item => item.id === req.params.itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Élément non trouvé' });
    }

    budget[itemIndex] = {
      ...budget[itemIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    await db.collection('trips').doc(req.params.tripId).update({
      budget: budget,
      updatedAt: new Date()
    });

    res.json({
      message: 'Élément modifié avec succès',
      item: budget[itemIndex]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budget/{tripId}/{itemId}:
 *   delete:
 *     summary: Supprimer un élément du budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élément supprimé avec succès
 */
router.delete('/:tripId/:itemId', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const budget = trip.budget || [];
    const filteredBudget = budget.filter(item => item.id !== req.params.itemId);
    
    await db.collection('trips').doc(req.params.tripId).update({
      budget: filteredBudget,
      updatedAt: new Date()
    });

    res.json({ message: 'Élément supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budget/{tripId}/summary:
 *   get:
 *     summary: Récupérer le résumé du budget
 *     tags: [Budget]
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
 *         description: Résumé du budget
 */
router.get('/:tripId/summary', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const budget = trip.budget || [];
    
    // Calculer les statistiques
    const categoryTotals = budget.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.amount;
      return acc;
    }, {});

    const participantTotals = budget.reduce((acc, item) => {
      if (!acc[item.paidBy]) {
        acc[item.paidBy] = 0;
      }
      acc[item.paidBy] += item.amount;
      return acc;
    }, {});

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const averagePerPerson = total / trip.participants.length;

    res.json({
      total: total,
      averagePerPerson: averagePerPerson,
      categoryTotals: categoryTotals,
      participantTotals: participantTotals,
      itemCount: budget.length
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
