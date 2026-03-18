# 🌍 TravelMate - Cloud Native Travel Planner

![TravelMate Banner](https://img.shields.io/badge/Travel-Mate-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Deployed-success)

TravelMate est une application **Cloud Native** permettant de planifier des voyages en groupe, de gérer des budgets et des itinéraires en temps réel.
Ce projet a été conçu pour valider les compétences de **Développement pour le Cloud**, **Architecture Microservices**, **CI/CD** et **Monitoring**.

🔗 **Accès Application** : [https://travelmate-pi-eight.vercel.app](https://travelmate-pi-eight.vercel.app)
🔗 **Documentation API** : [http://localhost:3001/api-docs](http://localhost:3001/api-docs) (Local)

---

## 🏗️ Architecture Cloud

L'application repose sur une architecture découplée et serverless pour maximiser la scalabilité et réduire les coûts.

| Composant | Technologie | Hébergement | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) | **Vercel** + Firebase Hosting | Application SPA rapide et optimisée CDN. |
| **Backend** | Node.js (Express) | **Google Cloud Run** | API REST conteneurisée (Docker), auto-scaling de 0 à N instances. |
| **Database** | Firestore | **Firebase** | Base de données NoSQL temps réel (synchronisation auto). |
| **Auth** | Firebase Auth | **Firebase** | Gestion des utilisateurs sécurisée (Google Sign-In). |
| **Storage** | Cloud Storage | **GCP** | Stockage des photos et documents de voyage. |

### Schéma de Communication
`Utilisateur` ↔ `Vercel (Frontend)` ↔ `Cloud Run (Backend)` ↔ `Firestore / Storage`

---

## 🚀 Déploiement

Le projet utilise deux fournisseurs Cloud majeurs (Multi-Cloud Approach) :

### 1. Backend (Google Cloud Platform)
Le backend est packagé dans un conteneur **Docker** et déployé sur **Cloud Run**.
- **Variables d'environnement** : Gérées via `env_vars.yaml` injecté au déploiement.
- **Commande de déploiement** :
  ```bash
  gcloud run deploy travelmate-api --source . --region europe-west1 --allow-unauthenticated
  ```

### 2. Frontend (Vercel)
Le frontend est connecté au dépôt GitHub.
- **Build** : `npm run build` (Vite)
- **Déploiement** : Automatique à chaque push sur `main`.

---

## 🔄 CI/CD (Intégration & Déploiement Continus)

Une pipeline **GitHub Actions** (`.github/workflows/ci-cd.yml`) est en place pour automatiser le cycle de vie de l'application.

### Étapes du Pipeline :
1.  **Tests (CI)** : À chaque Push/Pull Request, les tests unitaires (`backend` et `frontend`) sont exécutés.
2.  **Build** : Vérification que l'application compile sans erreur.
3.  **Deploy (CD)** : Si les tests passent sur la branche `main`, le backend est automatiquement déployé sur Cloud Run.

> 📘 **Guide de configuration** : Voir [GUIDE_CI_CD.md](./GUIDE_CI_CD.md) pour configurer les secrets GitHub.

---

## 📊 Monitoring & Observabilité

L'application intègre des sondes pour surveiller son état de santé en production.

### 1. Health Check Endpoint
Une route dédiée permet aux load balancers de vérifier l'état du service.
- **URL** : `/health`
- **Réponse** (JSON) :
  ```json
  {
    "uptime": 350.2,
    "timestamp": 1705342000,
    "message": "OK",
    "memoryUsage": { ... },
    "cpuUsage": { ... }
  }
  ```

### 2. Logging Structuré
Le backend utilise **Winston** pour générer des logs au format JSON.
- Cela permet l'intégration native avec **Google Cloud Logging**.
- Les erreurs sont tracées avec stacktrace et contexte (IP, Méthode, Path).

---

## 🛠️ Installation Locale

### Prérequis
- Node.js 18+
- Compte Google Cloud & Firebase

### Démarrage
```bash
# 1. Cloner le projet
git clone <url-du-repo>

# 2. Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install

# 3. Configurer les variables d'environnement
# (Créer .env dans backend et frontend selon les exemples)

# 4. Lancer le projet
cd ..
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:3001

---

## 📝 Auteurs
Projet réalisé dans le cadre du module "Développer pour le Cloud".
