# Guide de Déploiement Frontend sur Railway 🚂

Ce guide explique comment héberger votre React Frontend gratuitement sur Railway.

## Préalable

Vous devez avoir vos changements (avec le `Dockerfile` et `nginx.conf` que je viens de créer) sur GitHub.

**1. Poussez les modifications sur GitHub :**
```powershell
git add .
git commit -m "Add Dockerfile and nginx config for Railway"
git push
```

## Étapes sur Railway

1.  Allez sur [Railway.app](https://railway.app/) et connectez-vous (avec GitHub).
2.  Cliquez sur **New Project** > **Deploy from GitHub repo**.
3.  Sélectionnez votre repo `travelmate`.
4.  Cliquez sur **Deploy Now**.
    *   *Note: Il va peut-être échouer au début car il faut configurer le dossier racine.*

## Configuration du Service

Une fois le projet créé :

1.  Cliquez sur la carte de votre service (le carré "travelmate").
2.  Allez dans l'onglet **Settings**.
3.  Cherchez **Root Directory** et mettez : `/frontend`
    *   *(C'est crucial car votre code frontend n'est pas à la racine du repo mais dans le sous-dossier)*.
4.  Allez dans l'onglet **Variables**.
5.  Ajoutez vos variables d'environnement (copiez-les depuis votre fichier `.env` local) :
    *   `VITE_API_URL` : `https://travelmate-api-148242971237.europe-west1.run.app`
    *   `VITE_FIREBASE_API_KEY` : `...`
    *   `VITE_FIREBASE_AUTH_DOMAIN` : `...`
    *   ... (ajoutez toutes les clés Firebase).

## Finalisation

Railway va redéployer automatiquement dès que vous changez une variable ou le Root Directory.
Une fois le build (construction) fini, il vous donnera une URL publique (ex: `travelmate-production.up.railway.app`).

C'est tout ! Votre frontend est en ligne et connecté à votre backend Google Cloud. 🚀
