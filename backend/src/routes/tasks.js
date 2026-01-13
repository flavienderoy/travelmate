const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, taskSchema } = require('../middleware/validation');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * @swagger
 * /api/tasks/{tripId}:
 *   get:
 *     summary: Récupérer les tâches d'un voyage
 *     tags: [Tasks]
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
 *         description: Liste des tâches
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

    const tasks = trip.tasks || [];
    
    // Trier par priorité et date d'échéance
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    res.json(sortedTasks);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{tripId}:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               assignedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 */
router.post('/:tripId', authenticateToken, validate(taskSchema), async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const newTask = {
      id: uuidv4(),
      ...req.body,
      createdBy: req.user.uid,
      createdAt: new Date(),
      completed: false
    };

    const updatedTasks = [...(trip.tasks || []), newTask];
    
    await db.collection('trips').doc(req.params.tripId).update({
      tasks: updatedTasks,
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Tâche créée avec succès',
      task: newTask
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{tripId}/{taskId}:
 *   put:
 *     summary: Modifier une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche modifiée avec succès
 */
router.put('/:tripId/:taskId', authenticateToken, validate(taskSchema), async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const tasks = trip.tasks || [];
    const taskIndex = tasks.findIndex(task => task.id === req.params.taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    await db.collection('trips').doc(req.params.tripId).update({
      tasks: tasks,
      updatedAt: new Date()
    });

    res.json({
      message: 'Tâche modifiée avec succès',
      task: tasks[taskIndex]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{tripId}/{taskId}/complete:
 *   patch:
 *     summary: Marquer une tâche comme terminée/non terminée
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
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
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Statut de la tâche mis à jour
 */
router.patch('/:tripId/:taskId/complete', authenticateToken, async (req, res, next) => {
  try {
    const { completed } = req.body;
    
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Le statut completed doit être un booléen' });
    }

    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const tasks = trip.tasks || [];
    const taskIndex = tasks.findIndex(task => task.id === req.params.taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: completed,
      completedAt: completed ? new Date() : null,
      completedBy: completed ? req.user.uid : null,
      updatedAt: new Date()
    };
    
    await db.collection('trips').doc(req.params.tripId).update({
      tasks: tasks,
      updatedAt: new Date()
    });

    res.json({
      message: `Tâche ${completed ? 'marquée comme terminée' : 'marquée comme non terminée'}`,
      task: tasks[taskIndex]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{tripId}/{taskId}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 */
router.delete('/:tripId/:taskId', authenticateToken, async (req, res, next) => {
  try {
    const tripDoc = await db.collection('trips').doc(req.params.tripId).get();
    
    if (!tripDoc.exists) {
      return res.status(404).json({ error: 'Voyage non trouvé' });
    }

    const trip = tripDoc.data();
    
    if (!trip.participants.includes(req.user.uid)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const tasks = trip.tasks || [];
    const filteredTasks = tasks.filter(task => task.id !== req.params.taskId);
    
    await db.collection('trips').doc(req.params.tripId).update({
      tasks: filteredTasks,
      updatedAt: new Date()
    });

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tasks/{tripId}/summary:
 *   get:
 *     summary: Récupérer le résumé des tâches
 *     tags: [Tasks]
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
 *         description: Résumé des tâches
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

    const tasks = trip.tasks || [];
    
    const summary = {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length,
      overdue: tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate) < new Date()
      ).length,
      byPriority: {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length
      },
      byAssignee: {}
    };

    // Compter par assigné
    tasks.forEach(task => {
      if (task.assignedTo) {
        if (!summary.byAssignee[task.assignedTo]) {
          summary.byAssignee[task.assignedTo] = 0;
        }
        summary.byAssignee[task.assignedTo]++;
      }
    });

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
