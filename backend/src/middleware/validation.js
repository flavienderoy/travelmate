const Joi = require('joi');

// Schémas de validation pour les voyages
const tripSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  destination: Joi.string().min(2).max(100).required(),
  participants: Joi.array().items(Joi.string()).min(1).required()
});

const updateTripSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  destination: Joi.string().min(2).max(100).optional(),
  participants: Joi.array().items(Joi.string()).min(1).optional()
});

// Schémas de validation pour les étapes d'itinéraire
const itineraryStepSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    address: Joi.string().max(200).required()
  }).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  category: Joi.string().valid('transport', 'accommodation', 'activity', 'restaurant', 'other').required(),
  cost: Joi.number().min(0).optional()
});

// Schémas de validation pour le budget
const budgetItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().valid('transport', 'accommodation', 'food', 'activities', 'shopping', 'other').required(),
  date: Joi.date().iso().required(),
  paidBy: Joi.string().required()
});

// Schémas de validation pour les tâches
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(500).optional(),
  dueDate: Joi.date().iso().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  assignedTo: Joi.string().optional(),
  completed: Joi.boolean().default(false)
});

// Middleware de validation
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Erreur de validation',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  tripSchema,
  updateTripSchema,
  itineraryStepSchema,
  budgetItemSchema,
  taskSchema,
  validate
};
