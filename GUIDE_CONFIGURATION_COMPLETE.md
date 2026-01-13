# 🎯 Configuration complète TravelMate - Guide étape par étape

## ✅ CE QUI EST DÉJÀ FAIT
- ✅ Authentification Firebase avec Google Sign-In
- ✅ Backend Node.js/Express configuré
- ✅ Frontend React fonctionnel
- ✅ Interface utilisateur complète

---

## 📋 ÉTAPES RESTANTES

### **1. 🔥 Activer Firestore (Base de données)**

**Objectif :** Permettre de sauvegarder les voyages, budgets, tâches, etc.

**Actions :**
1. Aller sur https://console.firebase.google.com/
2. Sélectionner le projet `travelmate-ynov`
3. Dans le menu gauche : **Firestore Database**
4. Cliquer sur **"Créer une base de données"**
5. Choisir :
   - Mode : **Test** (pour le développement)
   - Région : **europe-west1** (Belgium)
6. Cliquer **"Activer"**

---

### **2. 🔒 Configurer les règles de sécurité Firestore**

**Objectif :** Sécuriser l'accès aux données

**Actions :**
1. Dans Firestore, aller dans l'onglet **"Règles"**
2. Copier-coller ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture/écriture aux utilisateurs authentifiés
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permettre la lecture/écriture aux participants d'un voyage
    match /trips/{tripId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.createdBy;
    }
    
    // Règles par défaut (pour le développement)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Cliquer sur **"Publier"**

---

### **3. 🗺️ Configurer Google Maps API**

**Objectif :** Activer les fonctionnalités de carte et géolocalisation

**Actions :**
1. Aller sur https://console.cloud.google.com/
2. Sélectionner le projet `travelmate-ynov`
3. **APIs & Services** > **Library**
4. Activer ces APIs (rechercher et cliquer "ENABLE") :
   - ✅ **Maps JavaScript API**
   - ✅ **Places API**
   - ✅ **Directions API**
   - ✅ **Geocoding API**
5. **APIs & Services** > **Credentials**
6. **Create Credentials** > **API Key**
7. Copier la clé API générée
8. Mettre à jour `frontend/.env` :
   ```env
   VITE_GOOGLE_MAPS_API_KEY=votre-nouvelle-cle-api
   ```

---

### **4. 🔑 Configurer Firebase Admin SDK (Backend)**

**Objectif :** Permettre au backend d'accéder à Firestore

**Actions :**
1. Firebase Console > **Project Settings** ⚙️
2. Onglet **"Service accounts"**
3. Cliquer **"Generate new private key"**
4. Confirmer et télécharger le fichier JSON
5. Renommer le fichier : `firebase-service-account.json`
6. Placer dans le dossier `backend/`
7. ⚠️ **Ne pas commiter ce fichier dans Git !**

---

### **5. 🧪 Tester l'application complète**

**Tests à effectuer :**

1. **Connexion Google** ✅ (déjà fonctionnel)
2. **Créer un voyage :**
   - Aller sur "Nouveau voyage"
   - Remplir le formulaire
   - Vérifier dans Firestore Console qu'un document est créé
3. **Ajouter des étapes d'itinéraire :**
   - Aller dans un voyage
   - Onglet "Itinéraire"
   - Ajouter une étape
4. **Gérer le budget :**
   - Onglet "Budget"
   - Ajouter une dépense
5. **Créer des tâches :**
   - Onglet "Tâches"
   - Ajouter une tâche

---

## 🔍 Vérifications

### Vérifier que Firestore fonctionne :
```bash
# Démarrer le backend
cd backend
npm run dev

# Dans un autre terminal, tester l'API
curl http://localhost:3001/health
```

### Vérifier les données dans Firestore :
1. Firebase Console > Firestore Database
2. Vérifier que la collection `trips` existe après création d'un voyage
3. Vérifier que les données sont sauvegardées

---

## 🆘 Problèmes courants

### "Permission denied" dans Firestore
- **Solution :** Vérifier que les règles de sécurité sont bien publiées
- Vérifier que l'utilisateur est bien authentifié

### Google Maps ne s'affiche pas
- **Solution :** Vérifier que la clé API est correcte dans `.env`
- Vérifier que les APIs sont bien activées
- Redémarrer le serveur frontend

### Backend ne peut pas accéder à Firestore
- **Solution :** Vérifier que `firebase-service-account.json` est présent
- Vérifier les variables d'environnement dans `backend/.env`

---

## ✅ Checklist finale

- [ ] Firestore activé
- [ ] Règles de sécurité Firestore configurées
- [ ] Google Maps API activée avec clé API
- [ ] Firebase Admin SDK configuré (fichier JSON)
- [ ] Variables d'environnement mises à jour
- [ ] Test de création de voyage fonctionne
- [ ] Données visibles dans Firestore Console
- [ ] Google Maps s'affiche (si implémenté)

---

**Bonne chance pour la configuration ! 🚀**

