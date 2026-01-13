# 🔧 Guide de diagnostic erreur 500 - Récupération voyages

## 🔍 Vérifier les logs backend

**Regardez le terminal où tourne le backend** et cherchez ces messages :

```
❌ === ERREUR LORS DE LA RÉCUPÉRATION DES VOYAGES ===
```

Copiez l'erreur exacte qui apparaît.

---

## 🔧 Solutions possibles

### **Solution 1 : Index Firestore manquant (le plus probable)**

Si vous voyez une erreur comme "The query requires an index", il faut créer l'index :

1. **Firebase Console** > Firestore Database > Indexes
2. Cliquer sur le lien dans l'erreur pour créer l'index automatiquement
3. OU créer manuellement :
   - Collection ID: `trips`
   - Fields to index:
     - `participants` (Array, Ascending)
     - `createdAt` (Timestamp, Descending)
4. Attendre que l'index soit créé (quelques minutes)
5. Tester à nouveau

### **Solution 2 : Requête simplifiée**

J'ai déjà simplifié la requête pour éviter le besoin d'index. Le tri se fait maintenant côté serveur.

### **Solution 3 : Vérifier Firestore**

1. Firebase Console > Firestore Database
2. Vérifier que la collection `trips` existe
3. Vérifier qu'il y a des documents
4. Vérifier que les documents ont un champ `participants` (array)
5. Vérifier que votre `uid` est bien dans le array `participants`

---

## 🚀 Test après correction

1. **Redémarrer le backend** si vous avez modifié le code
2. **Rafraîchir la page** Dashboard (F5)
3. **Vérifier les logs backend** pour voir si l'erreur persiste

---

## 📋 Ce que je dois savoir

**Dites-moi exactement ce que vous voyez dans les logs backend** :
- Le message d'erreur complet
- Le code d'erreur (si présent)
- Le type d'erreur

Cela m'aidera à donner la solution exacte !

