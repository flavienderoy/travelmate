# 🌍 TravelMate - Cloud Native Travel Planner

![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Deployed-success) ![Cloud](https://img.shields.io/badge/Cloud-Native-blue)

TravelMate est une application web full-stack moderne permettant de planifier des voyages, de gérer des budgets et des itinéraires en temps réel. Ce projet a été conçu selon les principes **Cloud Native** : scalabilité, résilience et automatisation.

---

## 🔗 Accès au Projet

*   **Frontend (Public)** : [https://travelmate-pi-eight.vercel.app](https://travelmate-pi-eight.vercel.app)
*   **Backend (API)** : [https://travelmate-api-148242971237.europe-west1.run.app](https://travelmate-api-148242971237.europe-west1.run.app)
*   **Documentation API** : [/api-docs](https://travelmate-api-148242971237.europe-west1.run.app/api-docs)

---

## 🏗️ Architecture Technique (Multi-Cloud)

L'application repose sur une architecture découplée et serverless pour maximiser la performance et optimiser les coûts.

| Composant | Technologie | Hébergement (PaaS/BaaS) | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) | **Vercel** | Application SPA rapide servie via CDN mondial. |
| **Backend** | Node.js (Express) | **Google Cloud Run** | API REST conteneurisée (Docker), auto-scaling de 0 à N. |
| **Base de données** | Firestore | **Firebase** | DB NoSQL temps réel pour les trajets et budgets. |
| **Authentification** | Firebase Auth | **Firebase** | Gestion sécurisée des identités (Google Sign-In). |
| **Stockage** | Cloud Storage | **GCP** | Stockage d'images et documents de voyage. |

---

## 🔄 Automatisation CI/CD

Une pipeline **GitHub Actions** (`ci-cd.yml`) gère entièrement le cycle de vie du projet :

1.  **CI (Intégration Continue)** : À chaque `push`, des tests automatisés sont lancés pour le Frontend et le Backend.
2.  **Build** : L'application est compilée et packagée (Conteneur Docker pour le back).
3.  **CD (Déploiement Continu)** : 
    *   Le backend est poussé automatiquement sur **Cloud Run**.
    *   Le frontend est déployé sur **Vercel** via l'intégration native Git.

---

## 📊 Monitoring & Observabilité

L'application intègre plusieurs couches de surveillance pour garantir sa disponibilité :

*   **Route de santé (Health Check)** : `/health` pour vérifier l'uptime et l'état des ressources (CPU/RAM).
*   **Logging** : Logs structurés via **Winston** envoyés vers Google Cloud Logging.
*   **Dashboard GCP** : Un tableau de bord Cloud Monitoring personnalisé suit en temps réel le trafic, la latence et la consommation des ressources.

---

## 🛠️ Installation Locale

### Prérequis
*   Node.js 18+
*   Compte Firebase & Google Cloud CLI

### Démarrage
```bash
# 1. Cloner le projet
git clone <votre-repo>

# 2. Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install

# 3. Lancer le projet en local
npm run dev
```

---

## 📝 Auteurs
Projet réalisé dans le cadre du module **"Développer pour le Cloud"**.🏅
