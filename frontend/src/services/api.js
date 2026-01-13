import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
console.log('🌐 Connected to Backend at:', API_BASE_URL)


export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
})

// Fonction pour obtenir le token depuis Firebase Auth
const getAuthToken = async () => {
  try {
    // Import dynamique pour éviter les problèmes de cycle
    const { getAuth } = await import('firebase/auth')
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      return await user.getIdToken()
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error)
  }
  return null
}

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      console.error('Token d\'authentification invalide')
      // Vous pourriez rediriger vers la page de connexion ici
    }
    return Promise.reject(error)
  }
)
