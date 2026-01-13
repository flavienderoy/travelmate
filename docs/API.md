# API Documentation TravelMate

## Base URL
- **Développement**: `http://localhost:3001/api`
- **Production**: `https://travelmate-backend-xxxxx-ew.a.run.app/api`

## Authentification

Toutes les routes protégées nécessitent un token Firebase dans l'en-tête Authorization :

```
Authorization: Bearer <firebase-token>
```

## Endpoints

### Authentification

#### GET /auth/profile
Récupérer le profil de l'utilisateur connecté.

**Réponse:**
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg"
}
```

#### PUT /auth/profile
Mettre à jour le profil utilisateur.

**Body:**
```json
{
  "name": "John Doe",
  "preferences": {
    "notifications": true,
    "language": "fr",
    "currency": "EUR"
  }
}
```

#### POST /auth/verify
Vérifier un token Firebase.

**Body:**
```json
{
  "token": "firebase-jwt-token"
}
```

**Réponse:**
```json
{
  "valid": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/avatar.jpg"
  }
}
```

### Voyages

#### GET /trips
Récupérer tous les voyages de l'utilisateur.

**Réponse:**
```json
[
  {
    "id": "trip123",
    "name": "Vacances à Paris",
    "description": "Week-end à Paris",
    "destination": "Paris, France",
    "startDate": "2024-01-01",
    "endDate": "2024-01-07",
    "participants": ["user123", "user456"],
    "createdBy": "user123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /trips
Créer un nouveau voyage.

**Body:**
```json
{
  "name": "Vacances à Paris",
  "description": "Week-end à Paris",
  "destination": "Paris, France",
  "startDate": "2024-01-01",
  "endDate": "2024-01-07",
  "participants": ["user123"]
}
```

**Réponse:**
```json
{
  "message": "Voyage créé avec succès",
  "trip": {
    "id": "trip123",
    "name": "Vacances à Paris",
    "description": "Week-end à Paris",
    "destination": "Paris, France",
    "startDate": "2024-01-01",
    "endDate": "2024-01-07",
    "participants": ["user123"],
    "createdBy": "user123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /trips/:id
Récupérer un voyage par ID.

**Réponse:**
```json
{
  "id": "trip123",
  "name": "Vacances à Paris",
  "description": "Week-end à Paris",
  "destination": "Paris, France",
  "startDate": "2024-01-01",
  "endDate": "2024-01-07",
  "participants": ["user123", "user456"],
  "createdBy": "user123",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "itinerary": [],
  "budget": [],
  "tasks": []
}
```

#### PUT /trips/:id
Mettre à jour un voyage.

**Body:**
```json
{
  "name": "Vacances à Paris - Modifié",
  "description": "Week-end à Paris avec visite des musées"
}
```

#### DELETE /trips/:id
Supprimer un voyage.

**Réponse:**
```json
{
  "message": "Voyage supprimé avec succès"
}
```

#### POST /trips/:id/invite
Inviter un utilisateur à un voyage.

**Body:**
```json
{
  "email": "friend@example.com"
}
```

### Itinéraire

#### GET /maps/:tripId/itinerary
Récupérer l'itinéraire d'un voyage.

**Réponse:**
```json
[
  {
    "id": "step123",
    "name": "Tour Eiffel",
    "description": "Visite de la Tour Eiffel",
    "location": {
      "lat": 48.8584,
      "lng": 2.2945,
      "address": "Champ de Mars, 7e arrondissement, Paris"
    },
    "startDate": "2024-01-01T10:00:00Z",
    "endDate": "2024-01-01T12:00:00Z",
    "category": "activity",
    "cost": 25,
    "addedBy": "user123",
    "addedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /maps/:tripId/itinerary
Ajouter une étape à l'itinéraire.

**Body:**
```json
{
  "name": "Tour Eiffel",
  "description": "Visite de la Tour Eiffel",
  "location": {
    "lat": 48.8584,
    "lng": 2.2945,
    "address": "Champ de Mars, 7e arrondissement, Paris"
  },
  "startDate": "2024-01-01T10:00:00Z",
  "endDate": "2024-01-01T12:00:00Z",
  "category": "activity",
  "cost": 25
}
```

#### PUT /maps/:tripId/itinerary/:stepId
Modifier une étape de l'itinéraire.

#### DELETE /maps/:tripId/itinerary/:stepId
Supprimer une étape de l'itinéraire.

#### GET /maps/places
Rechercher des lieux avec Google Places API.

**Query Parameters:**
- `query` (required): Terme de recherche
- `location` (optional): Localisation pour la recherche

**Réponse:**
```json
{
  "results": [
    {
      "place_id": "ChIJd8BlQ2BZwokRAFQEcDlJRAI",
      "name": "Tour Eiffel",
      "formatted_address": "Champ de Mars, 7e arrondissement, Paris",
      "geometry": {
        "location": {
          "lat": 48.8584,
          "lng": 2.2945
        }
      },
      "rating": 4.6,
      "types": ["tourist_attraction", "point_of_interest"]
    }
  ],
  "status": "OK"
}
```

### Budget

#### GET /budget/:tripId
Récupérer le budget d'un voyage.

**Réponse:**
```json
{
  "items": [
    {
      "id": "item123",
      "name": "Hôtel",
      "description": "Nuitée à l'hôtel",
      "amount": 150,
      "category": "accommodation",
      "date": "2024-01-01",
      "paidBy": "user123",
      "addedBy": "user123",
      "addedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "summary": {
    "accommodation": 150,
    "food": 75,
    "activities": 100
  },
  "total": 325,
  "participants": ["user123", "user456"]
}
```

#### POST /budget/:tripId
Ajouter un élément au budget.

**Body:**
```json
{
  "name": "Hôtel",
  "description": "Nuitée à l'hôtel",
  "amount": 150,
  "category": "accommodation",
  "date": "2024-01-01",
  "paidBy": "user123"
}
```

#### PUT /budget/:tripId/:itemId
Modifier un élément du budget.

#### DELETE /budget/:tripId/:itemId
Supprimer un élément du budget.

#### GET /budget/:tripId/summary
Récupérer le résumé du budget.

**Réponse:**
```json
{
  "total": 325,
  "averagePerPerson": 162.5,
  "categoryTotals": {
    "accommodation": 150,
    "food": 75,
    "activities": 100
  },
  "participantTotals": {
    "user123": 200,
    "user456": 125
  },
  "itemCount": 5
}
```

### Tâches

#### GET /tasks/:tripId
Récupérer les tâches d'un voyage.

**Réponse:**
```json
[
  {
    "id": "task123",
    "title": "Réserver l'hôtel",
    "description": "Réserver l'hôtel pour 2 nuits",
    "dueDate": "2024-01-15",
    "priority": "high",
    "assignedTo": "user123",
    "completed": false,
    "createdBy": "user123",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /tasks/:tripId
Créer une nouvelle tâche.

**Body:**
```json
{
  "title": "Réserver l'hôtel",
  "description": "Réserver l'hôtel pour 2 nuits",
  "dueDate": "2024-01-15",
  "priority": "high",
  "assignedTo": "user123"
}
```

#### PUT /tasks/:tripId/:taskId
Modifier une tâche.

#### PATCH /tasks/:tripId/:taskId/complete
Marquer une tâche comme terminée/non terminée.

**Body:**
```json
{
  "completed": true
}
```

#### DELETE /tasks/:tripId/:taskId
Supprimer une tâche.

#### GET /tasks/:tripId/summary
Récupérer le résumé des tâches.

**Réponse:**
```json
{
  "total": 10,
  "completed": 7,
  "pending": 3,
  "overdue": 1,
  "byPriority": {
    "high": 3,
    "medium": 5,
    "low": 2
  },
  "byAssignee": {
    "user123": 5,
    "user456": 5
  }
}
```

### Utilisateurs

#### GET /users/:userId
Récupérer les informations d'un utilisateur.

**Réponse:**
```json
{
  "uid": "user123",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg",
  "preferences": {
    "notifications": true,
    "language": "fr",
    "currency": "EUR"
  }
}
```

#### GET /users/search
Rechercher des utilisateurs par email.

**Query Parameters:**
- `email` (required): Email à rechercher

**Réponse:**
```json
[
  {
    "uid": "user456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "picture": "https://example.com/avatar2.jpg"
  }
]
```

#### GET /users/:userId/trips
Récupérer les voyages d'un utilisateur.

## Codes d'erreur

### 400 Bad Request
Erreur de validation des données.

```json
{
  "error": "Erreur de validation",
  "details": ["Le nom du voyage est requis"]
}
```

### 401 Unauthorized
Token d'authentification manquant ou invalide.

```json
{
  "error": "Token d'accès requis"
}
```

### 403 Forbidden
Accès non autorisé à la ressource.

```json
{
  "error": "Accès non autorisé"
}
```

### 404 Not Found
Ressource non trouvée.

```json
{
  "error": "Voyage non trouvé"
}
```

### 500 Internal Server Error
Erreur interne du serveur.

```json
{
  "error": "Erreur interne du serveur"
}
```

## Rate Limiting

L'API applique un rate limiting de 100 requêtes par 15 minutes par IP.

## Pagination

Pour les endpoints retournant des listes, utilisez les paramètres de pagination :

- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 20, max: 100)

**Exemple:**
```
GET /trips?page=2&limit=10
```

**Réponse:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Webhooks

L'API peut envoyer des webhooks pour certains événements :

- `trip.created`: Nouveau voyage créé
- `trip.updated`: Voyage modifié
- `trip.deleted`: Voyage supprimé
- `participant.added`: Nouveau participant ajouté
- `task.completed`: Tâche marquée comme terminée

**Format du webhook:**
```json
{
  "event": "trip.created",
  "data": {
    "tripId": "trip123",
    "name": "Vacances à Paris",
    "createdBy": "user123"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```
