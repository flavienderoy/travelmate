# 🌍 TravelMate - Cloud Native Travel Planner

![TravelMate Banner](https://img.shields.io/badge/Travel-Mate-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Deployed-success)

TravelMate est une application **Cloud Native** permettant de planifier des voyages en groupe, de gérer des budgets et des itinéraires en temps réel.
Ce projet a été conçu pour valider les compétences de **Développement pour le Cloud**, **Architecture Microservices**, **CI/CD** et **Monitoring**.

*   🔗 **Accès Application (Frontend)** : [https://travelmate-pi-eight.vercel.app](https://travelmate-pi-eight.vercel.app)
*   🔗 **Documentation API (Backend)** : [https://travelmate-api-148242971237.europe-west1.run.app/api-docs](https://travelmate-api-148242971237.europe-west1.run.app/api-docs)
*   🔗 **Check de Santé** : [/health](https://travelmate-api-148242971237.europe-west1.run.app/health)

---

## 🏗️ Architecture Cloud

L'application repose sur une architecture découplée et **Serverless** pour maximiser la scalabilité et réduire les coûts.

| Composant | Technologie | Hébergement | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) | **Vercel** | Application SPA rapide et optimisée via CDN. |
| **Backend** | Node.js (Express) | **Google Cloud Run** | API REST conteneurisée (Docker), auto-scaling de 0 à N. |
| **Database** | Firestore | **Firebase** | Base de données NoSQL temps réel (synchronisation auto). |
| **Auth** | Firebase Auth | **Firebase** | Gestion des utilisateurs sécurisée (Google Sign-In). |
| **Storage** | Cloud Storage | **GCP** | Stockage des photos et documents de voyage. |

### Schéma de Communication
`Utilisateur` ↔ `Vercel (Frontend)` ↔ `Cloud Run (Backend)` ↔ `Firestore / Storage`

> 🖼️ **Note** : Un schéma détaillé est disponible dans [architecture_overview.md](./architecture_overview.md) (généré durant la phase finale du projet).

---

## 🚀 Déploiement & Automatisation CI/CD

Le projet utilise deux fournisseurs Cloud majeurs (**Multi-Cloud Approach**) avec une pipeline **GitHub Actions** (`.github/workflows/ci-cd.yml`) automatisant le cycle de vie :

### 1. Intégration Continue (CI)
À chaque `push` ou `Pull Request` sur `main` :
*   Exécution des **tests unitaires** automatisés (Jest pour le backend, Vitest pour le frontend).
*   Vérification que l'application **build** correctement sans erreurs de compilation.

### 2. Déploiement Continu (CD)
*   **Backend** : L'image Docker est automatiquement poussée et déployée sur **Cloud Run**.
    *   *Note : Par sécurité, les variables d'environnement sont injectées via les **GitHub Secrets** (`GCP_SA_KEY`, etc.) et non via des fichiers versionnés.*
*   **Frontend** : Déploiement automatique sur **Vercel** via l'intégration native avec le dépôt Git.

---

## 📊 Monitoring & Observabilité

L'application intègre des sondes pour surveiller son état de santé en production :

### 1. Health Check & Logs
*   **Endpoint `/health`** : Retourne l'uptime, l'utilisation mémoire et CPU du conteneur en temps réel.
*   **Logs Structurés** : Utilisation de **Winston** pour générer des logs JSON compatibles avec **Google Cloud Logging**.

### 2. Dashboard Personnalisé (GCP)
Un tableau de bord spécifique a été configuré dans **Cloud Monitoring** pour suivre :
*   Le nombre de requêtes API reçues.
*   La latence moyenne des réponses.
*   La charge CPU et Mémoire de l'instance Cloud Run.

---

## 🛠️ Installation Locale

### Prérequis
- Node.js 18+
- Compte Google Cloud & Firebase

### Démarrage
```bash
# 1. Cloner le projet
git clone <votre-repo-github>

# 2. Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install

# 3. Configurer les variables d'environnement
# (Créer .env.local dans backend et frontend en suivant les exemples .env.example)

# 4. Lancer le projet
npm run dev
```

L'application sera accessible localement sur :
- Frontend : `http://localhost:5173`
- Backend : `http://localhost:3001`

---

## 📝 Auteurs
Projet réalisé dans le cadre du module **"Développer pour le Cloud"** (Soutenance de fin de module).🏅
