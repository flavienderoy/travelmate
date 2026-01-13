import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import { MapPin, Calendar, Users, DollarSign, CheckSquare, RefreshCw } from 'lucide-react'
import { api } from '../services/api'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()

  const { data: trips, isLoading, error, refetch } = useQuery(
    'trips',
    () => api.get('/trips').then(res => res.data),
    {
      enabled: !!user,
      staleTime: 0, // Toujours rafraîchir les données
      cacheTime: 0 // Ne pas mettre en cache
    }
  )

  // Debug : Afficher les voyages reçus
  console.log('🔍 Dashboard - Voyages reçus:', trips)
  console.log('🔍 Dashboard - Nombre de voyages:', trips?.length || 0)
  if (error) {
    console.error('❌ Dashboard - Erreur:', error)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const upcomingTrips = trips?.filter(trip => new Date(trip.startDate) > new Date()) || []
  const pastTrips = trips?.filter(trip => new Date(trip.endDate) < new Date()) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600">
              Gérez tous vos voyages et suivez votre progression.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total voyages</p>
              <p className="text-2xl font-semibold text-gray-900">{trips?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Voyages à venir</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingTrips.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Participants totaux</p>
              <p className="text-2xl font-semibold text-gray-900">
                {trips?.reduce((acc, trip) => acc + trip.participants.length, 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckSquare className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tâches complétées</p>
              <p className="text-2xl font-semibold text-gray-900">
                {trips?.reduce((acc, trip) => acc + (trip.tasks?.filter(task => task.completed).length || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voyages à venir */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Voyages à venir</h2>
        </div>
        <div className="p-6">
          {upcomingTrips.length > 0 ? (
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{trip.name}</h3>
                      <p className="text-sm text-gray-500">{trip.destination}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(trip.startDate).toLocaleDateString('fr-FR')} - {new Date(trip.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{trip.participants.length}</p>
                        <p className="text-xs text-gray-500">participants</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))}
                        </p>
                        <p className="text-xs text-gray-500">jours</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun voyage à venir</h3>
              <p className="mt-1 text-sm text-gray-500">
                Créez votre prochain voyage pour commencer à planifier.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Voyages passés */}
      {pastTrips.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Voyages passés</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pastTrips.slice(0, 5).map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{trip.name}</h3>
                      <p className="text-sm text-gray-500">{trip.destination}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(trip.startDate).toLocaleDateString('fr-FR')} - {new Date(trip.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{trip.participants.length}</p>
                        <p className="text-xs text-gray-500">participants</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))}
                        </p>
                        <p className="text-xs text-gray-500">jours</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
