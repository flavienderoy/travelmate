# 🗺️ Guide d'utilisation de la clé API Google Maps

## 📍 **Où est utilisée la clé API Google Maps ?**

### **1. Variable d'environnement**

**Fichier :** `frontend/.env`
```env
VITE_GOOGLE_MAPS_API_KEY=votre-cle-api-ici
```

### **2. Chargement dynamique (Frontend)**

**Fichier :** `frontend/src/utils/googleMaps.js`

Cette fonction charge Google Maps API de manière dynamique en utilisant la clé de votre `.env` :

```javascript
import { loadGoogleMaps } from '../utils/googleMaps'

// Utilisation dans un composant
loadGoogleMaps(() => {
  // Google Maps est maintenant disponible
  const map = new window.google.maps.Map(/* ... */)
})
```

### **3. Backend (API Routes)**

**Fichier :** `backend/src/routes/maps.js`

Le backend utilise la clé depuis `backend/.env` :
```env
GOOGLE_MAPS_API_KEY=votre-cle-api-ici
```

Utilisée dans les routes `/api/maps/*` pour les appels serveur vers Google Places API.

---

## 🔧 **Configuration actuelle**

### **Variables d'environnement à configurer :**

**Frontend (`frontend/.env`) :**
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg
```

**Backend (`backend/.env`) :**
```env
GOOGLE_MAPS_API_KEY=AIzaSyBa_0guO0p3caxmFze11bLJSt8BLRWN9sg
```

---

## 💡 **Comment utiliser Google Maps dans un composant**

### **Exemple d'utilisation dans TripDetails.jsx :**

```javascript
import { useEffect, useRef } from 'react'
import { loadGoogleMaps } from '../utils/googleMaps'

const TripDetails = () => {
  const mapRef = useRef(null)

  useEffect(() => {
    loadGoogleMaps(() => {
      // Initialiser la carte
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 48.8566, lng: 2.3522 },
          zoom: 10
        })
      }
    })
  }, [])

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
    </div>
  )
}
```

---

## 🔍 **Vérification**

Pour vérifier que la clé fonctionne :

1. Ouvrir la console du navigateur (F12)
2. Vérifier qu'il n'y a pas d'erreur "Google Maps API key not valid"
3. Si vous voyez "✅ Google Maps API chargée avec succès", c'est bon !

---

## 🆘 **Problèmes courants**

### "Google Maps API key not valid"
- **Solution :** Vérifier que la clé dans `.env` est correcte
- Vérifier que les APIs sont activées dans Google Cloud Console

### "Google Maps API not loaded"
- **Solution :** Vérifier que `VITE_GOOGLE_MAPS_API_KEY` est dans `frontend/.env`
- Redémarrer le serveur frontend après modification du `.env`

### La carte ne s'affiche pas
- **Solution :** Vérifier que `loadGoogleMaps()` est bien appelé
- Vérifier que le callback est exécuté

