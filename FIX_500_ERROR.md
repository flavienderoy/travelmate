# 🔧 Résolution erreur 500 - Backend Firestore

## ❌ Problème
Erreur 500 lors de la création/récupération des voyages - Backend ne peut pas accéder à Firestore

## 🔍 Diagnostic

J'ai ajouté des logs de debug dans le backend. **Regardez les logs du terminal backend** pour voir l'erreur exacte.

## ✅ Solutions

### **Solution 1 : Télécharger le fichier firebase-service-account.json**

**IMPORTANT** : C'est la solution la plus probable !

1. **Aller sur Firebase Console** : https://console.firebase.google.com/
2. **Sélectionner** le projet `travelmate-ynov`
3. **Project Settings** ⚙️ > **Service accounts**
4. **Cliquer** "Generate new private key"
5. **Télécharger** le fichier JSON
6. **Renommer** en `firebase-service-account.json`
7. **Placer** dans le dossier `backend/`
8. **Redémarrer** le backend

### **Solution 2 : Vérifier que Firestore est activé**

1. Firebase Console > **Firestore Database**
2. Vérifier qu'une base de données existe
3. Si pas de base, créer une base en **mode test**

### **Solution 3 : Vérifier les variables d'environnement backend**

Vérifier que `backend/.env` contient :
```env
FIREBASE_PROJECT_ID=travelmate-ynov
GOOGLE_CLOUD_PROJECT_ID=travelmate-ynov
```

### **Solution 4 : Vérifier les logs backend**

Dans le terminal backend, vous devriez voir :
```
🔍 === DEBUG FIREBASE BACKEND ===
FIREBASE_PROJECT_ID: travelmate-ynov
...

🔍 Initialisation Firebase...
✅ Firebase Admin SDK initialisé
✅ Firestore initialisé
```

Si vous voyez des erreurs, copiez-les ici.

---

## 🚀 Actions immédiates

1. **Regarder les logs backend** dans le terminal
2. **Télécharger firebase-service-account.json** (Solution 1)
3. **Redémarrer le backend** après avoir ajouté le fichier
4. **Tester à nouveau** la création de voyage

---

## 📋 Checklist

- [ ] Fichier `backend/firebase-service-account.json` existe
- [ ] Firestore Database activé dans Firebase Console
- [ ] Variables d'environnement `backend/.env` correctes
- [ ] Backend redémarré après modifications
- [ ] Logs backend vérifiés pour les erreurs

