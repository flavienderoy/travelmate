import { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import toast from 'react-hot-toast'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Debug : Afficher la configuration Firebase complète
console.log('🔍 === FIREBASE CONFIG OBJECT ===')
console.log(JSON.stringify(firebaseConfig, null, 2))
console.log('================================')

// Vérifier si toutes les valeurs sont définies
const missingKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key] || firebaseConfig[key] === 'undefined')
if (missingKeys.length > 0) {
  console.error('❌ Variables Firebase manquantes ou undefined:', missingKeys)
} else {
  console.log('✅ Toutes les variables Firebase sont définies')
}

let app, auth, googleProvider

try {
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase app initialisée:', app.name)
  
  auth = getAuth(app)
  console.log('✅ Firebase Auth initialisé')
  
  googleProvider = new GoogleAuthProvider()
  console.log('✅ Google Auth Provider créé')
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation Firebase:', error)
  console.error('Erreur complète:', error.message)
}

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      console.error('❌ Auth n\'est pas initialisé !')
      setLoading(false)
      return
    }

    console.log('🔍 === LISTENING TO AUTH STATE ===')
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔍 Auth state changed:', user ? 'User logged in' : 'User logged out')
      if (user) {
        console.log('🔍 User details:', {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          picture: user.photoURL
        })
        try {
          const token = await user.getIdToken()
          console.log('🔍 Token obtenu:', token.substring(0, 20) + '...')
          setUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            picture: user.photoURL,
            token
          })
        } catch (error) {
          console.error('❌ Erreur lors de l\'obtention du token:', error)
        }
      } else {
        console.log('🔍 Aucun utilisateur connecté')
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async () => {
    console.log('🔍 === TENTATIVE DE CONNEXION ===')
    console.log('Auth disponible:', !!auth)
    console.log('Google Provider disponible:', !!googleProvider)
    
    if (!auth || !googleProvider) {
      console.error('❌ Auth ou Google Provider non initialisé !')
      toast.error('Erreur de connexion - Firebase non initialisé')
      return
    }

    try {
      console.log('🔍 Appel de signInWithPopup...')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ Popup de connexion réussie')
      console.log('🔍 User result:', {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
      })
      
      console.log('🔍 Récupération du token...')
      const token = await result.user.getIdToken()
      console.log('✅ Token obtenu:', token.substring(0, 20) + '...')
      
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        picture: result.user.photoURL,
        token
      }
      
      setUser(userData)
      console.log('✅ User state mis à jour:', userData.email)
      
      toast.success('Connexion réussie !')
      console.log('🔍 La redirection devrait se faire automatiquement via useEffect dans Login.jsx')
    } catch (error) {
      console.error('❌ === ERREUR DE CONNEXION ===')
      console.error('Code erreur:', error.code)
      console.error('Message:', error.message)
      console.error('Erreur complète:', error)
      
      // Messages d'erreur spécifiques avec solutions
      let errorMessage = 'Erreur de connexion'
      let solution = ''
      
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Configuration Firebase introuvable'
        solution = 'Vérifiez que l\'authentification Google est activée dans Firebase Console'
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Clé API Firebase invalide'
        solution = 'Vérifiez votre clé API dans Google Cloud Console'
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Connexion annulée'
        return // Ne pas afficher d'erreur
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Domaine non autorisé'
        solution = 'Ajoutez localhost dans les domaines autorisés Firebase'
      } else {
        errorMessage = `Erreur: ${error.message}`
      }
      
      console.error('Solution:', solution)
      toast.error(solution ? `${errorMessage}. ${solution}` : errorMessage)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      toast.success('Déconnexion réussie')
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      toast.error('Erreur de déconnexion')
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
