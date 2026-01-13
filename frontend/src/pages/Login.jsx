import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { MapPin, LogIn } from 'lucide-react'

const Login = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  // Rediriger vers la page d'accueil si l'utilisateur est déjà connecté
  useEffect(() => {
    console.log('🔍 Login page - User state:', user ? 'Connected' : 'Not connected')
    if (user) {
      console.log('✅ Utilisateur connecté, redirection vers /')
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  // Afficher un message si l'utilisateur est déjà connecté
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MapPin className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Bienvenue sur TravelMate
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Planifiez vos voyages en groupe de manière collaborative
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Connectez-vous pour commencer
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Utilisez votre compte Google pour accéder à toutes les fonctionnalités de TravelMate
            </p>
            
            <button
              onClick={login}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Se connecter avec Google
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              En vous connectant, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
