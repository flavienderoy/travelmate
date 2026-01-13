# Guide de développement TravelMate

## Structure du projet

```
travelmate/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middlewares
│   │   ├── config/        # Configuration
│   │   └── tests/         # Tests unitaires
│   ├── Dockerfile         # Image Docker
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages
│   │   ├── contexts/      # Contextes React
│   │   └── services/      # Services API
│   ├── firebase.json      # Configuration Firebase
│   └── package.json
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD GitHub Actions
└── README.md
```

## Développement local

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Firebase
- Clé API Google Maps

### Installation

1. **Cloner le repository**
```bash
git clone <votre-repo>
cd travelmate
```

2. **Installer les dépendances**
```bash
# Dépendances racine
npm install

# Dépendances backend
cd backend
npm install
cd ..

# Dépendances frontend
cd frontend
npm install
cd ..
```

3. **Configuration des variables d'environnement**

**Backend:**
```bash
cd backend
cp env.example .env
# Éditer .env avec vos valeurs
```

**Frontend:**
```bash
cd frontend
cp env.example .env
# Éditer .env avec vos valeurs
```

4. **Démarrer les services**
```bash
# Démarrer backend et frontend en parallèle
npm run dev

# Ou séparément
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:5173
```

## Architecture du code

### Backend

#### Structure des routes
```javascript
// Exemple de route
router.get('/trips', authenticateToken, async (req, res, next) => {
  try {
    // Logique métier
    const trips = await getTrips(req.user.uid);
    res.json(trips);
  } catch (error) {
    next(error);
  }
});
```

#### Middlewares
- `authenticateToken`: Vérification des tokens Firebase
- `authorizeOwner`: Vérification des droits de propriété
- `validate`: Validation des données avec Joi

#### Configuration
- `firebase.js`: Configuration Firebase Admin SDK
- `storage.js`: Configuration Cloud Storage
- `swagger.js`: Documentation API

### Frontend

#### Structure des composants
```javascript
// Exemple de composant
const TripCard = ({ trip }) => {
  const { data, isLoading } = useQuery(['trip', trip.id], () => 
    api.get(`/trips/${trip.id}`)
  );

  if (isLoading) return <Loading />;
  
  return (
    <div className="trip-card">
      <h3>{trip.name}</h3>
      <p>{trip.destination}</p>
    </div>
  );
};
```

#### Contextes
- `AuthContext`: Gestion de l'authentification
- `TripContext`: État global des voyages (optionnel)

#### Services
- `api.js`: Client HTTP avec intercepteurs
- `firebase.js`: Configuration Firebase client

## Bonnes pratiques

### Backend

1. **Gestion des erreurs**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);
  
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.details.map(detail => detail.message)
    });
  }
  
  res.status(500).json({ error: 'Erreur interne du serveur' });
};
```

2. **Validation des données**
```javascript
const tripSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  destination: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
});
```

3. **Sécurité**
- Validation de tous les inputs
- Sanitisation des données
- Rate limiting
- Headers de sécurité

### Frontend

1. **Gestion d'état**
```javascript
// Utiliser React Query pour les données serveur
const { data, isLoading, error } = useQuery(
  'trips',
  () => api.get('/trips').then(res => res.data)
);

// Utiliser useState pour l'état local
const [isEditing, setIsEditing] = useState(false);
```

2. **Gestion des erreurs**
```javascript
const { mutate, error } = useMutation(
  (tripData) => api.post('/trips', tripData),
  {
    onError: (error) => {
      toast.error('Erreur lors de la création du voyage');
    }
  }
);
```

3. **Accessibilité**
- Labels appropriés
- Navigation au clavier
- Contraste des couleurs
- Textes alternatifs

## Tests

### Backend

1. **Tests unitaires**
```javascript
describe('Trip API', () => {
  it('should create a trip', async () => {
    const tripData = {
      name: 'Test Trip',
      destination: 'Paris',
      startDate: '2024-01-01',
      endDate: '2024-01-07'
    };
    
    const res = await request(app)
      .post('/api/trips')
      .send(tripData)
      .expect(201);
    
    expect(res.body.trip.name).toBe('Test Trip');
  });
});
```

2. **Tests d'intégration**
```javascript
describe('Authentication', () => {
  it('should protect routes', async () => {
    await request(app)
      .get('/api/trips')
      .expect(401);
  });
});
```

### Frontend

1. **Tests de composants**
```javascript
import { render, screen } from '@testing-library/react';
import { TripCard } from './TripCard';

test('renders trip name', () => {
  const trip = { name: 'Test Trip', destination: 'Paris' };
  render(<TripCard trip={trip} />);
  expect(screen.getByText('Test Trip')).toBeInTheDocument();
});
```

2. **Tests d'intégration**
```javascript
test('user can create a trip', async () => {
  render(<App />);
  
  fireEvent.click(screen.getByText('Nouveau voyage'));
  fireEvent.change(screen.getByLabelText('Nom du voyage'), {
    target: { value: 'Mon voyage' }
  });
  fireEvent.click(screen.getByText('Créer'));
  
  await waitFor(() => {
    expect(screen.getByText('Mon voyage')).toBeInTheDocument();
  });
});
```

## Débogage

### Backend

1. **Logs**
```javascript
console.log('Debug info:', { userId, tripId });
```

2. **Outils**
- Node.js debugger
- Postman pour tester les APIs
- Firebase console pour Firestore

### Frontend

1. **DevTools**
- React DevTools
- Redux DevTools (si utilisé)
- Network tab pour les requêtes

2. **Logs**
```javascript
console.log('Component state:', { trip, isLoading });
```

## Performance

### Backend

1. **Optimisations**
- Pagination des résultats
- Index Firestore appropriés
- Cache des requêtes fréquentes
- Compression des réponses

2. **Monitoring**
- Métriques de performance
- Temps de réponse
- Utilisation mémoire

### Frontend

1. **Optimisations**
- Lazy loading des composants
- Memoization avec useMemo/useCallback
- Optimisation des images
- Code splitting

2. **Bundle analysis**
```bash
npm run build
npm run analyze
```

## Déploiement

### Environnements

1. **Développement**
- Variables d'environnement locales
- Base de données de test
- Logs détaillés

2. **Staging**
- Environnement de test
- Données de test
- Tests automatisés

3. **Production**
- Variables d'environnement sécurisées
- Monitoring complet
- Sauvegardes automatiques

### Processus de déploiement

1. **Tests**
```bash
npm test
npm run test:e2e
```

2. **Build**
```bash
npm run build
```

3. **Déploiement**
```bash
npm run deploy
```

## Maintenance

### Mises à jour

1. **Dépendances**
```bash
npm update
npm audit fix
```

2. **Sécurité**
- Audit régulier des dépendances
- Mise à jour des clés API
- Rotation des secrets

### Monitoring

1. **Métriques**
- Performance des APIs
- Erreurs applicatives
- Utilisation des ressources

2. **Alertes**
- Seuils de performance
- Erreurs critiques
- Disponibilité des services
