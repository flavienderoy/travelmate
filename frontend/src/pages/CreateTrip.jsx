import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import toast from 'react-hot-toast'

const CreateTrip = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const createTripMutation = useMutation(
    (tripData) => api.post('/trips', tripData),
    {
      onSuccess: (response) => {
        console.log('✅ Voyage créé avec succès:', response.data)
        // Invalider et rafraîchir les queries
        queryClient.invalidateQueries('trips')
        queryClient.refetchQueries('trips')
        toast.success('Voyage créé avec succès !')
        // Attendre un peu pour que la navigation soit fluide
        setTimeout(() => {
          navigate(`/trips/${response.data.trip.id}`)
        }, 500)
      },
      onError: (error) => {
        toast.error('Erreur lors de la création du voyage')
        console.error('❌ Erreur création voyage:', error)
      }
    }
  )

  const onSubmit = (data) => {
    const tripData = {
      ...data,
      participants: [user.uid] // L'utilisateur actuel est automatiquement ajouté
    }
    createTripMutation.mutate(tripData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Créer un nouveau voyage
          </h1>
          <p className="text-gray-600">
            Remplissez les informations de base pour votre voyage collaboratif.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom du voyage */}
          <div>
            <label className="label">
              <MapPin className="inline h-4 w-4 mr-1" />
              Nom du voyage
            </label>
            <input
              type="text"
              {...register('name', { required: 'Le nom du voyage est requis' })}
              className="input-field"
              placeholder="Ex: Vacances à Paris"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="label">
              Destination
            </label>
            <input
              type="text"
              {...register('destination', { required: 'La destination est requise' })}
              className="input-field"
              placeholder="Ex: Paris, France"
            />
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="Décrivez votre voyage..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date de début
              </label>
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
              <label className="label">
                Date de fin
              </label>
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

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createTripMutation.isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {createTripMutation.isLoading ? 'Création...' : 'Créer le voyage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTrip
