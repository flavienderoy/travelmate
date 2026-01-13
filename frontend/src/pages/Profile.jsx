import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { User, Mail, Settings, Save } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      preferences: {
        notifications: true,
        language: 'fr',
        currency: 'EUR'
      }
    }
  })

  const updateProfileMutation = useMutation(
    (profileData) => api.put('/auth/profile', profileData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile')
        toast.success('Profil mis à jour avec succès !')
        setIsEditing(false)
      },
      onError: (error) => {
        toast.error('Erreur lors de la mise à jour du profil')
        console.error(error)
      }
    }
  )

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <img
            className="h-16 w-16 rounded-full"
            src={user?.picture || '/default-avatar.png'}
            alt={user?.name}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Informations du profil</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Modifier
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="label">
              <User className="inline h-4 w-4 mr-1" />
              Nom complet
            </label>
            <input
              type="text"
              {...register('name', { required: 'Le nom est requis' })}
              className="input-field"
              disabled={!isEditing}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="input-field bg-gray-50"
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">
              L'email ne peut pas être modifié
            </p>
          </div>

          <div>
            <label className="label">
              Préférences de notification
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('preferences.notifications')}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  disabled={!isEditing}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Recevoir des notifications par email
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">
              Langue préférée
            </label>
            <select
              {...register('preferences.language')}
              className="input-field"
              disabled={!isEditing}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="label">
              Devise préférée
            </label>
            <select
              {...register('preferences.currency')}
              className="input-field"
              disabled={!isEditing}
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar US ($)</option>
              <option value="GBP">Livre Sterling (£)</option>
            </select>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="btn-primary disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du compte</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">ID utilisateur</span>
            <span className="text-sm font-mono text-gray-900">{user?.uid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Membre depuis</span>
            <span className="text-sm text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
