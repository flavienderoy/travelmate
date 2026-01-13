# TravelMate - Planificateur de voyages collaboratif

## 🎯 Description du projet

TravelMate est une application web collaborative qui permet à plusieurs amis ou membres d'un groupe de planifier ensemble un voyage. L'application facilite la gestion des itinéraires, des logements, du budget et des listes de tâches partagées.

## 🏗️ Architecture

### Stack technique
- **Front-end** : React + Vite
- **Back-end** : Node.js / Express
- **Base de données** : Firestore (NoSQL)
- **Hébergement** :
  - Front : Firebase Hosting (GCP) + AWS S3/CloudFront
  - Back : Cloud Run (GCP)
- **Stockage** : Cloud Storage (GCP) + AWS S3
- **Authentification** : Firebase Auth (Google Sign-In)
- **API externe** : Google Maps Platform (Places, Directions)

### Architecture globale
- Architecture microservices légère (front + back séparés)
- Données synchronisées en temps réel via Firestore
- Stockage et CDN fournis par GCP et AWS
- Sécurité via authentification et gestion des secrets (Secret Manager)

## 🚀 Services utilisés

### Google Cloud Platform
- Cloud Run (déploiement du backend Express)
- Firebase (Hosting, Auth, Firestore)
- Cloud Storage (médias)
- Secret Manager (variables d'environnement)
- Cloud Monitoring & Logging
- App Engine (déploiement frontend alternatif)

### Amazon Web Services
- S3 (stockage statique)
- CloudFront (CDN)
- Route 53 (DNS)

## 📋 Fonctionnalités

### Pour chaque utilisateur
- ✅ Créer un voyage et inviter des participants
- ✅ Ajouter des étapes d'itinéraire avec carte interactive (Google Maps)
- ✅ Gérer un budget commun (hébergement, transport, activités)
- ✅ Créer et suivre une liste de tâches partagée
- ✅ Consulter un récapitulatif global (itinéraire + budget + checklist)

## 🛠️ Installation et développement local

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Google Cloud Platform
- Compte Amazon Web Services
- Compte Firebase

### Installation
```bash
# Cloner le repository
git clone <votre-repo>
cd travelmate

# Installer les dépendances
npm install

# Installer les dépendances du backend
cd backend && npm install && cd ..

# Installer les dépendances du frontend
cd frontend && npm install && cd ..

# Copier les fichiers d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Configuration des variables d'environnement

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
GOOGLE_CLOUD_PROJECT_ID=votre-project-id
FIREBASE_PROJECT_ID=votre-firebase-project
GOOGLE_MAPS_API_KEY=votre-google-maps-key
JWT_SECRET=votre-jwt-secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=votre-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=votre-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-project-id
VITE_GOOGLE_MAPS_API_KEY=votre-google-maps-key
```

### Démarrage en développement
```bash
# Démarrer les deux services en parallèle
npm run dev

# Ou séparément
npm run dev:backend  # Backend sur http://localhost:3001
npm run dev:frontend  # Frontend sur http://localhost:5173
```

## 🚀 Déploiement

### Backend (Cloud Run)
```bash
cd backend
npm run deploy
```

### Frontend (Firebase Hosting + AWS)
```bash
cd frontend
npm run deploy:firebase
npm run deploy:aws
```

## 🔄 CI/CD

Le projet utilise GitHub Actions pour automatiser :
1. Tests unitaires
2. Build du front et du back
3. Déploiement automatique sur Cloud Run et Firebase/AWS
4. Notifications de succès/erreur

## 📊 Monitoring

- Cloud Monitoring pour la supervision du backend
- Cloud Logging pour les journaux applicatifs
- Tableaux de bord (trafic, temps de réponse, erreurs)

## 🧪 Tests

```bash
# Tests backend
npm run test:backend

# Tests frontend
npm run test:frontend

# Tous les tests
npm test
```

## 📚 Documentation API

L'API REST est documentée avec Swagger disponible sur `/api-docs` en développement.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- Votre nom - Développement initial

## 🙏 Remerciements

- Google Cloud Platform
- Amazon Web Services
- Firebase
- Google Maps Platform
