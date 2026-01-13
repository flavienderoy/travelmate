# Guide de déploiement TravelMate

## Prérequis

### Outils nécessaires
- Node.js 18+
- npm ou yarn
- Google Cloud CLI
- AWS CLI
- Firebase CLI
- Docker
- Git

### Comptes requis
- Compte Google Cloud Platform
- Compte Amazon Web Services
- Compte Firebase
- Compte GitHub (pour CI/CD)

## Configuration Google Cloud Platform

### 1. Créer un projet GCP
```bash
# Créer un nouveau projet
gcloud projects create travelmate-project --name="TravelMate"

# Définir le projet par défaut
gcloud config set project travelmate-project

# Activer les APIs nécessaires
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### 2. Configurer l'authentification
```bash
# Créer un compte de service
gcloud iam service-accounts create travelmate-service-account \
    --description="Service account for TravelMate" \
    --display-name="TravelMate Service Account"

# Attribuer les rôles nécessaires
gcloud projects add-iam-policy-binding travelmate-project \
    --member="serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding travelmate-project \
    --member="serviceAccount:travelmate-service-account@travelmate-service-account@travelmate-project.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding travelmate-project \
    --member="serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Créer et télécharger la clé
gcloud iam service-accounts keys create gcp-key.json \
    --iam-account=travelmate-service-account@travelmate-project.iam.gserviceaccount.com
```

### 3. Configurer Firestore
```bash
# Initialiser Firestore
gcloud firestore databases create --region=europe-west1

# Déployer les règles de sécurité
firebase deploy --only firestore:rules
```

### 4. Configurer Cloud Storage
```bash
# Créer un bucket
gsutil mb gs://travelmate-storage-bucket

# Configurer les permissions
gsutil iam ch serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com:objectAdmin gs://travelmate-storage-bucket
```

### 5. Configurer Secret Manager
```bash
# Créer les secrets
echo -n "votre-jwt-secret-super-securise" | gcloud secrets create jwt-secret --data-file=-
echo -n "votre-google-maps-api-key" | gcloud secrets create google-maps-api-key --data-file=-
echo -n "votre-firebase-project-id" | gcloud secrets create firebase-project-id --data-file=-
```

## Configuration Amazon Web Services

### 1. Créer un bucket S3
```bash
# Créer le bucket
aws s3 mb s3://travelmate-frontend-bucket --region eu-west-1

# Configurer le bucket pour l'hébergement web
aws s3 website s3://travelmate-frontend-bucket \
    --index-document index.html \
    --error-document index.html
```

### 2. Configurer CloudFront
```bash
# Créer une distribution CloudFront
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

### 3. Configurer Route 53 (optionnel)
```bash
# Créer une zone hébergée
aws route53 create-hosted-zone \
    --name travelmate.com \
    --caller-reference $(date +%s)
```

## Configuration Firebase

### 1. Initialiser Firebase
```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser le projet
firebase init
```

### 2. Configurer l'authentification
- Aller dans la console Firebase
- Activer l'authentification Google
- Configurer les domaines autorisés

### 3. Configurer Firestore
- Créer une base de données Firestore
- Configurer les règles de sécurité
- Déployer les index

## Configuration des variables d'environnement

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
GOOGLE_CLOUD_PROJECT_ID=travelmate-project
FIREBASE_PROJECT_ID=travelmate-project
GOOGLE_MAPS_API_KEY=votre-google-maps-key
JWT_SECRET=votre-jwt-secret
GOOGLE_CLOUD_STORAGE_BUCKET=travelmate-storage-bucket
CORS_ORIGIN=https://travelmate-project.web.app
```

### Frontend (.env)
```env
VITE_API_URL=https://travelmate-backend-xxxxx-ew.a.run.app
VITE_FIREBASE_API_KEY=votre-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=travelmate-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=travelmate-project
VITE_FIREBASE_STORAGE_BUCKET=travelmate-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre-messaging-sender-id
VITE_FIREBASE_APP_ID=votre-firebase-app-id
VITE_GOOGLE_MAPS_API_KEY=votre-google-maps-key
```

## Déploiement

### 1. Déploiement du backend
```bash
cd backend

# Construire l'image Docker
docker build -t gcr.io/travelmate-project/travelmate-backend .

# Pousser l'image
docker push gcr.io/travelmate-project/travelmate-backend

# Déployer sur Cloud Run
gcloud run deploy travelmate-backend \
    --image gcr.io/travelmate-project/travelmate-backend \
    --platform managed \
    --region europe-west1 \
    --allow-unauthenticated \
    --set-env-vars NODE_ENV=production
```

### 2. Déploiement du frontend sur Firebase
```bash
cd frontend

# Installer les dépendances
npm install

# Construire l'application
npm run build

# Déployer sur Firebase Hosting
firebase deploy --only hosting
```

### 3. Déploiement du frontend sur AWS
```bash
cd frontend

# Construire l'application
npm run build

# Synchroniser avec S3
aws s3 sync dist/ s3://travelmate-frontend-bucket --delete

# Invalider le cache CloudFront
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
```

### 4. Déploiement sur App Engine
```bash
cd frontend

# Créer le fichier app.yaml
cat > app.yaml << EOF
runtime: nodejs18
service: frontend
automatic_scaling:
  min_instances: 1
  max_instances: 10
env_variables:
  NODE_ENV: production
EOF

# Déployer
gcloud app deploy
```

## Configuration CI/CD

### 1. Secrets GitHub
Configurer les secrets suivants dans GitHub :

**GCP Secrets:**
- `GOOGLE_CLOUD_PROJECT`: travelmate-project
- `GCP_SA_KEY`: Contenu du fichier gcp-key.json
- `FIREBASE_PROJECT_ID`: travelmate-project
- `FIREBASE_SERVICE_ACCOUNT`: Contenu du fichier firebase-service-account.json

**API Keys:**
- `GOOGLE_MAPS_API_KEY`: Votre clé Google Maps
- `FIREBASE_API_KEY`: Clé API Firebase
- `FIREBASE_AUTH_DOMAIN`: travelmate-project.firebaseapp.com
- `FIREBASE_STORAGE_BUCKET`: travelmate-project.appspot.com
- `FIREBASE_MESSAGING_SENDER_ID`: ID du sender Firebase
- `FIREBASE_APP_ID`: ID de l'app Firebase

**AWS Secrets:**
- `AWS_ACCESS_KEY_ID`: Votre clé d'accès AWS
- `AWS_SECRET_ACCESS_KEY`: Votre clé secrète AWS
- `AWS_S3_BUCKET`: travelmate-frontend-bucket
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`: ID de votre distribution CloudFront

**URLs:**
- `PRODUCTION_API_URL`: https://travelmate-backend-xxxxx-ew.a.run.app

### 2. Déclencher le déploiement
```bash
# Pousser sur la branche main pour déclencher le déploiement
git add .
git commit -m "Deploy to production"
git push origin main
```

## Monitoring et observabilité

### 1. Cloud Monitoring
- Configurer des tableaux de bord
- Créer des alertes
- Surveiller les métriques de performance

### 2. Cloud Logging
- Configurer les logs structurés
- Créer des filtres de logs
- Configurer les alertes sur les erreurs

### 3. Health Checks
```bash
# Vérifier la santé du backend
curl https://travelmate-backend-xxxxx-ew.a.run.app/health

# Vérifier la santé du frontend
curl https://travelmate-project.web.app/
```

## Tests de déploiement

### 1. Tests fonctionnels
- Tester l'authentification
- Tester la création de voyage
- Tester les fonctionnalités collaboratives

### 2. Tests de performance
- Tests de charge sur l'API
- Tests de latence
- Tests de montée en charge

### 3. Tests de sécurité
- Tests d'authentification
- Tests d'autorisation
- Tests de validation des données

## Maintenance

### 1. Mises à jour
- Mise à jour des dépendances
- Mise à jour des images Docker
- Mise à jour des configurations

### 2. Sauvegardes
- Sauvegarde automatique Firestore
- Sauvegarde des configurations
- Plan de récupération

### 3. Monitoring continu
- Surveillance des performances
- Surveillance des erreurs
- Surveillance des coûts
