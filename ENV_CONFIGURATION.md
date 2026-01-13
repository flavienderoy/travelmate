# ✅ Configuration des variables d'environnement

## 📋 Modifications effectuées

### **Fichiers modifiés :**

1. **`frontend/src/contexts/AuthContext.jsx`**
   - ✅ Utilise maintenant `import.meta.env.VITE_FIREBASE_*`
   - ✅ Valeurs en dur remplacées par variables d'environnement

2. **`frontend/src/utils/googleMaps.js`**
   - ✅ Utilise maintenant `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`
   - ✅ Valeur en dur remplacée

3. **`frontend/src/config/firebase.js`**
   - ✅ Utilise maintenant `import.meta.env.VITE_FIREBASE_*`

4. **`frontend/src/services/api.js`**
   - ✅ Déjà configuré avec `import.meta.env.VITE_API_URL`

---

## 🔧 Configuration requise

### **Fichier `.env` dans `frontend/`**

Créez ou vérifiez que le fichier `frontend/.env` contient :

```env
VITE_API_URL=http://localhost:3001

VITE_FIREBASE_API_KEY=AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg
VITE_FIREBASE_AUTH_DOMAIN=travelmate-ynov.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=travelmate-ynov
VITE_FIREBASE_STORAGE_BUCKET=travelmate-ynov.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148242971237
VITE_FIREBASE_APP_ID=1:148242971237:web:f482c16d3be70cefb5648c
VITE_FIREBASE_MEASUREMENT_ID=G-MP53CN5H9T

VITE_GOOGLE_MAPS_API_KEY=AIzaSyD8rnH3ciHKJFI-Y8Ux9yeWpPKYGDc1IYU
```

---

## 🚀 Actions nécessaires

### **Option 1 : Script automatique**

Exécutez le script pour créer le fichier `.env` :

```powershell
.\setup-env-frontend.ps1
```

### **Option 2 : Création manuelle**

```powershell
cd frontend
copy env.local .env
```

### **Option 3 : Copier depuis env.local**

Le fichier `frontend/env.local` contient déjà toutes les bonnes valeurs, copiez-le vers `.env`.

---

## ⚠️ IMPORTANT : Redémarrer le serveur

**Vite charge les variables d'environnement uniquement au démarrage !**

Après avoir créé/modifié le fichier `.env` :
1. **Arrêter** le serveur frontend (Ctrl+C)
2. **Redémarrer** : `npm run dev`

Sinon les changements ne seront pas pris en compte !

---

## ✅ Vérification

Après redémarrage, dans la console du navigateur, vous devriez voir :

```
🔍 === FIREBASE CONFIG OBJECT ===
{
  "apiKey": "AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg",
  "authDomain": "travelmate-ynov.firebaseapp.com",
  ...
}
================================
✅ Toutes les variables Firebase sont définies
```

Si vous voyez des valeurs `undefined`, c'est que le fichier `.env` n'est pas chargé correctement.

---

## 📝 Notes

- Le fichier `.env` est dans `.gitignore` (ne sera pas commité)
- Utilisez `env.example` comme template pour la documentation
- En production, utilisez les variables d'environnement du déploiement (Vercel, Netlify, etc.)

