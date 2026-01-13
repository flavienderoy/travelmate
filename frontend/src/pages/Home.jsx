import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import { MapPin, Plus, Calendar, Users, DollarSign } from 'lucide-react'
import { api } from '../services/api'

const Home = () => {
  const { user } = useAuth()

  const { data: trips, isLoading, error } = useQuery(
    'trips',
    () => api.get('/trips').then(res => res.data),
    {
      enabled: !!user,
      staleTime: 0, // Toujours rafraîchir les données
      cacheTime: 0 // Ne pas mettre en cache
    }
  )

  // Debug : Afficher les voyages reçus
  console.log('🔍 Home - Voyages reçus:', trips)
  console.log('🔍 Home - Nombre de voyages:', trips?.length || 0)
  if (error) {
    console.error('❌ Home - Erreur:', error)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bonjour {user?.name} ! 👋
        </h1>
        <p className="text-gray-600">
          Prêt à planifier votre prochain voyage ? Découvrez vos voyages ou créez-en un nouveau.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/create-trip"
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 p-3 rounded-xl group-hover:bg-primary-200 transition-colors">
              <Plus className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-heading font-bold text-gray-900">Nouveau voyage</h3>
              <p className="text-sm text-gray-500">Créer un voyage</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard"
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accent-100 p-3 rounded-xl group-hover:bg-accent-200 transition-colors">
              <Calendar className="h-8 w-8 text-accent-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-heading font-bold text-gray-900">Tableau de bord</h3>
              <p className="text-sm text-gray-500">Voir tous les voyages</p>
            </div>
          </div>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-6 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-50 p-3 rounded-xl">
              <MapPin className="h-8 w-8 text-primary-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-heading font-bold text-gray-900">Mes voyages</h3>
              <p className="text-sm text-gray-500">{trips?.length || 0} voyage(s)</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-6 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-50 p-3 rounded-xl">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-heading font-bold text-gray-900">Collaboration</h3>
              <p className="text-sm text-gray-500">Planification en groupe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent trips */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-heading font-bold text-gray-900">Vos voyages récents</h2>
        </div>
        <div className="p-8">
          {trips && trips.length > 0 ? (
            <div className="space-y-4">
              {trips.slice(0, 3).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="block p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{trip.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {trip.destination}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(trip.startDate).toLocaleDateString('fr-FR')} - {new Date(trip.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{trip.participants.length}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Aucun voyage</h3>
              <p className="mt-2 text-gray-500">
                Commencez par créer votre premier voyage.
              </p>
              <div className="mt-8">
                <Link
                  to="/create-trip"
                  className="btn-primary"
                >
                  Créer un voyage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
