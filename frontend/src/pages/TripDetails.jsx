import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  X,
  Save
} from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const TripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const { data: trip, isLoading, error } = useQuery(
    ['trip', id],
    () => api.get(`/trips/${id}`).then(res => res.data),
    {
      enabled: !!id
    }
  )

  const { data: budget } = useQuery(
    ['budget', id],
    () => api.get(`/budget/${id}`).then(res => res.data),
    {
      enabled: !!id
    }
  )

  const { data: tasks } = useQuery(
    ['tasks', id],
    () => api.get(`/tasks/${id}`).then(res => res.data),
    {
      enabled: !!id
    }
  )

  // Initialiser le formulaire avec les données du voyage
  useEffect(() => {
    if (trip && isEditing) {
      reset({
        name: trip.name,
        description: trip.description || '',
        destination: trip.destination,
        startDate: trip.startDate?.split('T')[0] || '',
        endDate: trip.endDate?.split('T')[0] || ''
      })
    }
  }, [trip, isEditing, reset])

  // Mutation pour modifier le voyage
  const updateTripMutation = useMutation(
    (tripData) => api.put(`/trips/${id}`, tripData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['trip', id])
        queryClient.invalidateQueries('trips')
        setIsEditing(false)
        toast.success('Voyage modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du voyage')
        console.error(error)
      }
    }
  )

  // Mutation pour supprimer le voyage
  const deleteTripMutation = useMutation(
    () => api.delete(`/trips/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trips')
        toast.success('Voyage supprimé avec succès !')
        navigate('/')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du voyage')
        console.error(error)
      }
    }
  )

  const handleEdit = () => {
    setIsEditing(true)
    if (trip) {
      reset({
        name: trip.name,
        description: trip.description || '',
        destination: trip.destination,
        startDate: trip.startDate?.split('T')[0] || '',
        endDate: trip.endDate?.split('T')[0] || ''
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const onSubmit = (data) => {
    updateTripMutation.mutate(data)
  }

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce voyage ? Cette action est irréversible.')) {
      deleteTripMutation.mutate()
    }
  }

  // Vérifier si l'utilisateur est le créateur
  const isOwner = trip && trip.createdBy === user?.uid

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Voyage non trouvé</h2>
        <p className="text-gray-600">Le voyage que vous recherchez n'existe pas.</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: MapPin },
    { id: 'itinerary', name: 'Itinéraire', icon: Calendar },
    { id: 'budget', name: 'Budget', icon: DollarSign },
    { id: 'tasks', name: 'Tâches', icon: CheckSquare },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass border border-white/50 p-8 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading font-bold text-gray-900">{trip.name}</h1>
            <p className="text-gray-600 mt-2 flex items-center text-lg"><MapPin className="h-5 w-5 mr-2 text-primary-500" /> {trip.destination}</p>
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              <span className="flex items-center px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">
                <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                {new Date(trip.startDate).toLocaleDateString('fr-FR')} - {new Date(trip.endDate).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">
                <Users className="h-4 w-4 mr-2 text-accent-500" />
                {trip.participants.length} participant(s)
              </span>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="btn-secondary flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteTripMutation.isLoading}
                    className="btn-danger flex items-center disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteTripMutation.isLoading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateTripMutation.isLoading}
                    className="btn-primary flex items-center disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateTripMutation.isLoading ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {!isEditing ? (
          <>
            {trip.description && (
              <p className="mt-6 text-gray-700 leading-relaxed max-w-3xl">{trip.description}</p>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-white/50 p-6 rounded-xl border border-white/60">
            <div>
              <label className="label">Nom du voyage</label>
              <input
                type="text"
                {...register('name', { required: 'Le nom est requis' })}
                className="input-field"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="label">Destination</label>
              <input
                type="text"
                {...register('destination', { required: 'La destination est requise' })}
                className="input-field"
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date de début</label>
                <input
                  type="date"
                  {...register('startDate', { required: 'La date de début est requise' })}
                  className="input-field"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="label">Date de fin</label>
                <input
                  type="date"
                  {...register('endDate', { required: 'La date de fin est requise' })}
                  className="input-field"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass border border-white/50 overflow-hidden">
        <div className="border-b border-gray-100 bg-white/50">
          <nav className="flex space-x-2 px-6 pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-medium text-sm rounded-t-xl transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-x border-white'
                  : 'text-gray-500 hover:text-primary-600 hover:bg-white/60'
                  }`}
              >
                <tab.icon className={`inline h-4 w-4 mr-2 ${activeTab === tab.id ? 'text-primary-500' : ''}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 bg-white/40">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                  <div className="flex items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <Calendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-primary-900">Durée</p>
                      <p className="text-xl font-bold text-primary-700">
                        {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} jours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent-50 rounded-2xl p-6 border border-accent-100">
                  <div className="flex items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <DollarSign className="h-6 w-6 text-accent-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-accent-900">Budget total</p>
                      <p className="text-xl font-bold text-accent-700">
                        {budget?.total ? `${budget.total}€` : '0€'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <CheckSquare className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Tâches</p>
                      <p className="text-xl font-bold text-gray-700">
                        {tasks?.length || 0} tâche(s)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Participants</h3>
                  <div className="space-y-3">
                    {trip.participants.map((participantId) => (
                      <div key={participantId} className="flex items-center p-3 hover:bg-primary-50 rounded-xl transition-colors border border-transparent hover:border-primary-100">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                          {/* Fallback avatar */}
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-gray-900">Participant</p>
                          <p className="text-xs text-gray-500">{participantId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Prochaines étapes</h3>
                  <div className="space-y-3">
                    {trip.itinerary?.slice(0, 3).map((step) => (
                      <div key={step.id} className="flex items-center p-3 hover:bg-accent-50 rounded-xl transition-colors border border-transparent hover:border-accent-100">
                        <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-accent-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-gray-900">{step.name}</p>
                          <p className="text-xs text-gray-500">{step.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-heading font-bold text-gray-900">Itinéraire</h3>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une étape
                </button>
              </div>

              {trip.itinerary?.length > 0 ? (
                <div className="space-y-4">
                  {trip.itinerary.map((step, index) => (
                    <div key={step.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-soft transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{step.name}</h4>
                          <p className="text-gray-600 mt-1">{step.description}</p>
                          <p className="text-sm text-primary-600 mt-2 font-medium">
                            <span className="bg-primary-50 px-2 py-1 rounded-md">
                              {new Date(step.startDate).toLocaleDateString('fr-FR')} - {new Date(step.endDate).toLocaleDateString('fr-FR')}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide bg-accent-100 text-accent-800 rounded-full">
                            {step.category}
                          </span>
                          <button className="text-gray-400 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-lg">
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun itinéraire</h3>
                  <p className="mt-1 text-gray-500">
                    Commencez par ajouter des étapes à votre voyage.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-heading font-bold text-gray-900">Budget</h3>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une dépense
                </button>
              </div>

              {budget?.items?.length > 0 ? (
                <div className="space-y-4">
                  {budget.items.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-soft transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                          <p className="text-gray-600 mt-1">{item.description}</p>
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(item.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-900">
                            {item.amount}€
                          </span>
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide bg-green-100 text-green-800 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune dépense</h3>
                  <p className="mt-1 text-gray-500">
                    Commencez par ajouter des dépenses à votre budget.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-heading font-bold text-gray-900">Tâches</h3>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une tâche
                </button>
              </div>

              {tasks?.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-soft transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                          />
                          <div className="ml-4">
                            <h4 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            <p className="text-gray-600 mt-1">{task.description}</p>
                            {task.dueDate && (
                              <p className="text-xs text-gray-400 mt-2">
                                Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune tâche</h3>
                  <p className="mt-1 text-gray-500">
                    Commencez par ajouter des tâches à votre voyage.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripDetails
