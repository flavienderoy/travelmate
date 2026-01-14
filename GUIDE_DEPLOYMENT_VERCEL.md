# 🚀 Guide de Déploiement Frontend sur Vercel

Vercel est la solution la plus simple et robuste pour héberger une application React/Vite gratuitement.

## 1. Préparer le Code

J'ai déjà fait le ménage dans votre projet (suppression des fichiers Railway inutiles) et ajouté un fichier `vercel.json` pour que le site fonctionne parfaitement.

**Envoyez ces changements sur GitHub :**

```powershell
git add .
git commit -m "Switch to Vercel configuration"
git push
```

## 2. Configurer Vercel

1.  Allez sur [Vercel.com](https://vercel.com) et connectez-vous (avec GitHub).
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  À côté de votre repo `travelmate`, cliquez sur **"Import"**.

## 3. Réglages Importants (⚠️ NE PAS RATER)

Dans l'écran de configuration "Configure Project" :

1.  **Framework Preset** : Vercel devrait détecter `Vite`. Sinon, choisissez `Vite`.
2.  **Root Directory** : Cliquez sur `Edit` et sélectionnez le dossier **`frontend`**.
    *   *C'est crucial car votre site React est dans ce sous-dossier !*
3.  **Environment Variables** : Dépliez cette section et ajoutez les variables de votre fichier `.env` local :
    *   `VITE_API_URL` : `https://travelmate-api-148242971237.europe-west1.run.app`
    *   `VITE_FIREBASE_API_KEY` : (Votre clé...)
    *   `VITE_FIREBASE_AUTH_DOMAIN` : (Votre domaine...)
    *   `VITE_FIREBASE_PROJECT_ID` : (L'ID...)
    *   *...et toutes les autres (Storage Bucket, Messaging Sender ID, App ID).*

## 4. Déployer

1.  Cliquez sur **Deploy**.
2.  Attendez ~1 minute. Vous devriez voir un feu d'artifice ! 🎉
3.  Cliquez sur l'image de votre site pour voir l'URL (ex: `travelmate.vercel.app`).

## 5. Connecter le Backend

Une fois que vous avez votre URL Vercel (ex: `https://travelmate.vercel.app`) :

1.  Mettez à jour le Backend (CORS) afin qu'il accepte les requêtes venant de Vercel.

## 6. 🛡️ Configuration Firebase (Google Auth)

C'est l'erreur "Domaine non autorisé" ! Par sécurité, Firebase bloque les tentatives de connexion venant de sites inconnus.

1.  Allez sur la [Console Firebase](https://console.firebase.google.com/).
2.  Ouvrez votre projet **travelmate-ynov**.
3.  Dans le menu de gauche, allez dans **Authentication**.
4.  Allez dans l'onglet **Settings** (Paramètres).
5.  Cherchez la section **Authorized Domains**.
6.  Cliquez sur **Add Domain**.
7.  Ajoutez votre domaine Vercel (sans `https://`) :
    *   Exemple : `travelmate-pi-eight.vercel.app`
8.  Cliquez sur **Add**.

C'est instantané. Réessayez de vous connecter sur votre site, ça marchera ! 🎉
