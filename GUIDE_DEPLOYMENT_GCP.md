# Guide de Déploiement Backend sur Google Cloud (GCP)

Ce guide explique comment déployer l'API backend TravelMate sur **Google Cloud Run**, un service entièrement géré pour déployer des conteneurs.

## Prérequis

1.  Avoir un compte Google Cloud actif.
2.  Avoir installé le [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install).
3.  Avoir créé un projet sur la console Google Cloud.
4.  **Important** : Avoir activé la facturation (Billing) sur le projet (obligatoire pour Cloud Run, même pour l'offre gratuite).

## Étapes de Déploiement

### 1. Initialisation de gcloud

Ouvrez un terminal (Powershell ou Command Prompt) et connectez-vous :

```powershell
gcloud auth login
gcloud config set project [VOTRE_ID_PROJET]
```
*Remplacez `[VOTRE_ID_PROJET]` par l'ID de votre projet GCP (pas le nom, l'ID).*

### 2. Activation des services nécessaires

Activez les services Cloud Run et Cloud Build :

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### 3. Préparation des variables d'environnement

Le backend a besoin de plusieurs variables d'environnement (Firebase, etc.).
Vous pouvez les définir directement lors du déploiement ou créer un fichier `.env.yaml` (recommandé pour la clarté, mais attention à ne pas le committer sur git publique).

Créez un fichier `env_vars.yaml` à la racine de `backend/` :

```yaml
FIREBASE_PROJECT_ID: "votre-firebase-project-id"
FIREBASE_CLIENT_EMAIL: "votre-email@..."
FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----..."
CORS_ORIGIN: "https://votre-frontend.vercel.app" # À mettre à jour après le déploiement frontend
```

### 4. Déploiement direct depuis la source

Nous allons utiliser la commande `gcloud run deploy` qui va automatiquement builder votre image Docker (via Cloud Build) et la déployer.

Placez-vous dans le dossier `backend` :

```powershell
cd c:\DEV\travelmate\backend
```

Lancez la commande de déploiement :

```powershell
gcloud run deploy travelmate-api --source . --region europe-west1 --allow-unauthenticated --env-vars-file env_vars.yaml
```

**Explication des paramètres :**
*   `travelmate-api` : Nom du service sur Cloud Run.
*   `--source .` : Utilise le code actuel pour construire l'image.
*   `--region europe-west1` : Déploie en Belgique (choisissez une région proche de vos utilisateurs).
*   `--allow-unauthenticated` : Rend l'API publique (nécessaire pour que le frontend puisse l'appeler).
*   `--env-vars-file env_vars.yaml` : Injecte vos variables d'environnement.

### 5. Récupération de l'URL

Une fois le déploiement terminé, `gcloud` affichera l'URL de votre service (ex: `https://travelmate-api-xyz-ew.a.run.app`).

### 6. Mise à jour du Frontend

Une fois que vous avez cette URL :
1.  Allez dans votre projet Frontend.
2.  Mettez à jour le fichier `.env` (ou les variables d'env Vercel) :
    ```
    VITE_API_URL=https://travelmate-api-xyz-ew.a.run.app/api
    ```
3.  Redéployez le frontend.

---

## Notes importantes

*   **Firebase Admin SDK** : Assurez-vous que la clé privée Firebase est bien formatée. Si vous avez des erreurs de parsing JSON/Key, vérifiez que les sauts de ligne `\n` sont correctement gérés.
*   **Coûts** : Cloud Run a une offre gratuite généreuse, mais surveillez votre facturation.
