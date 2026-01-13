// Utilitaire pour charger Google Maps API
export const loadGoogleMaps = (callback) => {
  // Vérifier si Google Maps est déjà chargé
  if (window.google && window.google.maps) {
    callback()
    return
  }

  // Récupérer la clé API depuis les variables d'environnement
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error('❌ Clé API Google Maps manquante dans les variables d\'environnement')
    console.error('Veuillez ajouter VITE_GOOGLE_MAPS_API_KEY dans votre fichier .env')
    return
  }

  // Vérifier si le script est déjà en cours de chargement
  const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
  if (existingScript) {
    existingScript.addEventListener('load', callback)
    return
  }

  // Créer et charger le script Google Maps
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`
  script.async = true
  script.defer = true
  
  script.onload = () => {
    console.log('✅ Google Maps API chargée avec succès')
    callback()
  }
  
  script.onerror = () => {
    console.error('❌ Erreur lors du chargement de Google Maps API')
  }

  document.head.appendChild(script)
}

export default loadGoogleMaps
