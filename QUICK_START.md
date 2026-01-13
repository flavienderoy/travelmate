# 🚀 Démarrage rapide TravelMate

## Configuration automatique

J'ai tout configuré pour vous ! Voici comment démarrer :

### **Option 1 : Script automatique (recommandé)**

```bash
# Copier les fichiers de configuration
npm run setup

# Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Démarrer l'application
npm run dev
```

### **Option 2 : Script PowerShell (Windows)**

```powershell
# Exécuter le script PowerShell
.\setup.ps1

# Puis démarrer
npm run dev
```

### **Option 3 : Manuel**

```bash
# Copier les fichiers d'environnement
cp backend/env.local backend/.env
cp frontend/env.local frontend/.env

# Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Démarrer l'application
npm run dev
```

## 🌐 URLs de l'application

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3001
- **API Docs** : http://localhost:3001/api-docs

## 🔥 Configuration Firebase

Votre projet Firebase `travelmate-ynov` est déjà configuré avec :
- ✅ Authentification Google activée
- ✅ Firestore activé
- ✅ Configuration complète

## 🗺️ Google Maps

J'ai utilisé votre clé Firebase comme clé Google Maps temporaire. 
Pour une vraie clé Google Maps :
1. Aller sur https://console.cloud.google.com/
2. Activer "Maps JavaScript API" et "Places API"
3. Créer une nouvelle clé API
4. Remplacer dans `frontend/.env` et `backend/.env`

## ✅ Test de l'application

1. Ouvrir http://localhost:5173
2. Cliquer "Se connecter avec Google"
3. Autoriser l'application
4. Créer un voyage de test

## 🆘 Dépannage

### Erreur de port
Si le port 3001 est occupé, changer dans `backend/.env` :
```
PORT=3002
```

### Erreur Firebase
Vérifier que votre projet Firebase est bien `travelmate-ynov`

### Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

**Tout est prêt ! Lancez `npm run dev` et testez l'application ! 🎉**

