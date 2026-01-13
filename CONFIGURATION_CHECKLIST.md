# 🚀 Configuration complète TravelMate - Checklist de déploiement

## 📋 Prérequis généraux

### Outils à installer
- [ ] Node.js 18+ installé
- [ ] npm ou yarn installé
- [ ] Google Cloud CLI installé et configuré
- [ ] AWS CLI installé et configuré
- [ ] Firebase CLI installé (`npm install -g firebase-tools`)
- [ ] Docker installé
- [ ] Git installé

### Comptes requis
- [ ] Compte Google Cloud Platform avec facturation activée
- [ ] Compte Amazon Web Services avec facturation activée
- [ ] Compte Firebase (lié à GCP)
- [ ] Compte GitHub (pour CI/CD)

---

## 🔧 Configuration Google Cloud Platform

### 1. Création du projet
```bash
# Créer un nouveau projet (remplacez travelmate-project par votre nom)
gcloud projects create travelmate-project --name="TravelMate"

# Définir le projet par défaut
gcloud config set project travelmate-project

# Activer la facturation (obligatoire)
# Aller dans la console GCP > Facturation et activer la facturation
```

### 2. Activation des APIs
```bash
# Activer toutes les APIs nécessaires
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable maps-backend.googleapis.com
gcloud services enable places-backend.googleapis.com
```

### 3. Configuration de l'authentification
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
    --member="serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding travelmate-project \
    --member="serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding travelmate-project \
    --member="serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com" \
    --role="roles/firebase.admin"

# Créer et télécharger la clé
gcloud iam service-accounts keys create gcp-key.json \
    --iam-account=travelmate-service-account@travelmate-project.iam.gserviceaccount.com
```

### 4. Configuration Firestore
```bash
# Initialiser Firestore (choisir europe-west1)
gcloud firestore databases create --region=europe-west1

# Activer l'authentification Firebase
# Aller dans Firebase Console > Authentication > Sign-in method
# Activer "Google" comme fournisseur
```

### 5. Configuration Cloud Storage
```bash
# Créer un bucket pour le stockage
gsutil mb gs://travelmate-storage-bucket

# Configurer les permissions
gsutil iam ch serviceAccount:travelmate-service-account@travelmate-project.iam.gserviceaccount.com:objectAdmin gs://travelmate-storage-bucket

# Configurer le bucket pour l'hébergement web (optionnel)
gsutil web set -m index.html -e 404.html gs://travelmate-storage-bucket
```

### 6. Configuration Secret Manager
```bash
# Créer les secrets (remplacez par vos vraies valeurs)
echo -n "votre-jwt-secret-super-securise-ici" | gcloud secrets create jwt-secret --data-file=-
echo -n "votre-google-maps-api-key" | gcloud secrets create google-maps-api-key --data-file=-
echo -n "travelmate-project" | gcloud secrets create firebase-project-id --data-file=-
```

### 7. Configuration App Engine
```bash
# Initialiser App Engine
gcloud app create --region=europe-west1

# Créer le fichier app.yaml pour le frontend
cat > frontend/app.yaml << EOF
runtime: nodejs18
service: frontend
automatic_scaling:
  min_instances: 1
  max_instances: 10
env_variables:
  NODE_ENV: production
EOF
```

---

## 🔥 Configuration Firebase

### 1. Initialisation Firebase
```bash
# Se connecter à Firebase
firebase login

# Initialiser le projet dans le dossier frontend
cd frontend
firebase init

# Sélectionner :
# - Firestore
# - Hosting
# - Storage
# - Functions (optionnel)
```

### 2. Configuration Firebase Hosting
```bash
# Dans le dossier frontend, créer firebase.json (déjà créé dans le projet)
# Configurer les domaines autorisés dans Firebase Console
# Aller dans Authentication > Settings > Authorized domains
# Ajouter votre domaine de production
```

### 3. Configuration Firestore
```bash
# Déployer les règles de sécurité
firebase deploy --only firestore:rules

# Déployer les index
firebase deploy --only firestore:indexes
```

---

## ☁️ Configuration Amazon Web Services

### 1. Configuration AWS CLI
```bash
# Configurer AWS CLI
aws configure

# Entrer :
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: eu-west-1
# - Default output format: json
```

### 2. Création du bucket S3
```bash
# Créer le bucket (nom unique requis)
aws s3 mb s3://travelmate-frontend-bucket-unique --region eu-west-1

# Configurer le bucket pour l'hébergement web
aws s3 website s3://travelmate-frontend-bucket-unique \
    --index-document index.html \
    --error-document index.html

# Configurer les permissions publiques
aws s3api put-bucket-policy --bucket travelmate-frontend-bucket-unique \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::travelmate-frontend-bucket-unique/*"
            }
        ]
    }'
```

### 3. Configuration CloudFront
```bash
# Créer une distribution CloudFront
# Aller dans AWS Console > CloudFront > Create Distribution
# Origin Domain: travelmate-frontend-bucket-unique.s3.eu-west-1.amazonaws.com
# Default Root Object: index.html
# Error Pages: 404 -> /index.html (pour SPA)
```

### 4. Configuration Route 53 (optionnel)
```bash
# Créer une zone hébergée
aws route53 create-hosted-zone \
    --name travelmate.com \
    --caller-reference $(date +%s)

# Créer un enregistrement A pointant vers CloudFront
# Aller dans Route 53 > Hosted zones > travelmate.com
# Créer un enregistrement A avec alias vers votre distribution CloudFront
```

---

## 🗝️ Configuration des clés API

### 1. Google Maps API
- [ ] Aller dans Google Cloud Console > APIs & Services > Credentials
- [ ] Créer une clé API
- [ ] Restreindre la clé aux APIs suivantes :
  - Maps JavaScript API
  - Places API
  - Directions API
  - Geocoding API
- [ ] Restreindre par référent HTTP (domaines autorisés)

### 2. Firebase Configuration
- [ ] Aller dans Firebase Console > Project Settings
- [ ] Copier la configuration web
- [ ] Noter tous les identifiants nécessaires

---

## 🔐 Configuration des secrets GitHub

### Secrets GCP
- [ ] `GOOGLE_CLOUD_PROJECT`: travelmate-project
- [ ] `GCP_SA_KEY`: Contenu du fichier gcp-key.json
- [ ] `FIREBASE_PROJECT_ID`: travelmate-project
- [ ] `FIREBASE_SERVICE_ACCOUNT`: Contenu du fichier firebase-service-account.json

### Secrets API
- [ ] `GOOGLE_MAPS_API_KEY`: Votre clé Google Maps
- [ ] `FIREBASE_API_KEY`: Clé API Firebase
- [ ] `FIREBASE_AUTH_DOMAIN`: travelmate-project.firebaseapp.com
- [ ] `FIREBASE_STORAGE_BUCKET`: travelmate-project.appspot.com
- [ ] `FIREBASE_MESSAGING_SENDER_ID`: ID du sender Firebase
- [ ] `FIREBASE_APP_ID`: ID de l'app Firebase

### Secrets AWS
- [ ] `AWS_ACCESS_KEY_ID`: Votre clé d'accès AWS
- [ ] `AWS_SECRET_ACCESS_KEY`: Votre clé secrète AWS
- [ ] `AWS_S3_BUCKET`: travelmate-frontend-bucket-unique
- [ ] `AWS_CLOUDFRONT_DISTRIBUTION_ID`: ID de votre distribution CloudFront

### URLs de production
- [ ] `PRODUCTION_API_URL`: https://travelmate-backend-xxxxx-ew.a.run.app

---

## 📝 Configuration des variables d'environnement

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
GOOGLE_CLOUD_PROJECT_ID=travelmate-project
FIREBASE_PROJECT_ID=travelmate-project
GOOGLE_MAPS_API_KEY=votre-google-maps-key
JWT_SECRET=votre-jwt-secret-super-securise
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

---

## 🚀 Déploiement

### 1. Premier déploiement du backend
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

### 2. Premier déploiement du frontend Firebase
```bash
cd frontend

# Installer les dépendances
npm install

# Construire l'application
npm run build

# Déployer sur Firebase Hosting
firebase deploy --only hosting
```

### 3. Premier déploiement du frontend AWS
```bash
cd frontend

# Construire l'application
npm run build

# Synchroniser avec S3
aws s3 sync dist/ s3://travelmate-frontend-bucket-unique --delete

# Invalider le cache CloudFront
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
```

### 4. Premier déploiement sur App Engine
```bash
cd frontend

# Déployer sur App Engine
gcloud app deploy
```

---

## 📊 Configuration du monitoring

### 1. Cloud Monitoring
- [ ] Aller dans Google Cloud Console > Monitoring
- [ ] Créer des tableaux de bord pour :
  - Performance des APIs
  - Utilisation des ressources
  - Erreurs applicatives
- [ ] Configurer des alertes pour :
  - Temps de réponse élevé
  - Taux d'erreur élevé
  - Utilisation mémoire élevée

### 2. Cloud Logging
- [ ] Configurer les logs structurés
- [ ] Créer des filtres de logs
- [ ] Configurer les alertes sur les erreurs

### 3. Health Checks
```bash
# Vérifier la santé du backend
curl https://travelmate-backend-xxxxx-ew.a.run.app/health

# Vérifier la santé du frontend Firebase
curl https://travelmate-project.web.app/

# Vérifier la santé du frontend AWS
curl https://votre-distribution-cloudfront.cloudfront.net/
```

---

## ✅ Tests de validation

### Tests fonctionnels
- [ ] Test d'authentification Google
- [ ] Test de création de voyage
- [ ] Test d'ajout d'étapes d'itinéraire
- [ ] Test de gestion du budget
- [ ] Test de création de tâches
- [ ] Test de collaboration en temps réel

### Tests de performance
- [ ] Test de charge sur l'API
- [ ] Test de latence
- [ ] Test de montée en charge

### Tests de sécurité
- [ ] Test d'authentification
- [ ] Test d'autorisation
- [ ] Test de validation des données

---

## 🔄 Configuration CI/CD

### 1. Configuration GitHub Actions
- [ ] Pousser le code sur GitHub
- [ ] Configurer tous les secrets GitHub
- [ ] Vérifier que le workflow CI/CD se déclenche

### 2. Tests automatisés
- [ ] Vérifier que les tests passent
- [ ] Vérifier que le build réussit
- [ ] Vérifier que le déploiement fonctionne

---

## 📋 Checklist finale

### Vérifications importantes
- [ ] Tous les services GCP sont actifs
- [ ] Tous les services AWS sont configurés
- [ ] Firebase est correctement configuré
- [ ] Les clés API sont valides et sécurisées
- [ ] Les secrets GitHub sont configurés
- [ ] Les variables d'environnement sont correctes
- [ ] Le déploiement fonctionne sur tous les environnements
- [ ] Le monitoring est opérationnel
- [ ] Les tests passent
- [ ] La documentation est à jour

### URLs de production
- [ ] Backend: https://travelmate-backend-xxxxx-ew.a.run.app
- [ ] Frontend Firebase: https://travelmate-project.web.app
- [ ] Frontend AWS: https://votre-distribution-cloudfront.cloudfront.net
- [ ] Frontend App Engine: https://travelmate-project.ew.r.appspot.com

---

## 🆘 Dépannage

### Problèmes courants
1. **Erreur de facturation GCP** : Vérifier que la facturation est activée
2. **Erreur de permissions** : Vérifier les rôles IAM
3. **Erreur de clés API** : Vérifier les restrictions et quotas
4. **Erreur de déploiement** : Vérifier les logs dans Cloud Run
5. **Erreur de CORS** : Vérifier les domaines autorisés

### Logs utiles
```bash
# Logs Cloud Run
gcloud logging read "resource.type=cloud_run_revision"

# Logs Firebase
firebase functions:log

# Logs AWS
aws logs describe-log-groups
```

---

## 📞 Support

En cas de problème :
1. Consulter les logs dans les consoles respectives
2. Vérifier la documentation officielle
3. Consulter les forums communautaires
4. Contacter le support technique si nécessaire

**Bon déploiement ! 🚀**
