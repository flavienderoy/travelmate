import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page non trouvée
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
