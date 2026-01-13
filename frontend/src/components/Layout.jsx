import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  Plus,
  User,
  LogOut,
  MapPin,
  Calendar,
} from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Tableau de bord', href: '/dashboard', icon: Calendar },
    { name: 'Nouveau voyage', href: '/create-trip', icon: Plus },
    { name: 'Profil', href: '/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-primary-50 selection:bg-primary-200 selection:text-primary-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-md shadow-glass border-r border-white/50">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-24 items-center px-8 border-b border-gray-100">
            <div className="flex items-center space-x-3 group">
              <div className="bg-primary-100 p-2 rounded-xl group-hover:bg-primary-200 transition-colors duration-300">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-2xl font-heading font-bold text-gray-900 tracking-tight">TravelMate</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-6 py-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 translate-x-2'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 hover:translate-x-1'
                    }`}
                >
                  <item.icon className={`mr-4 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-6 border-t border-gray-100 bg-white/50">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-primary-100"
                src={user?.picture || '/default-avatar.png'}
                alt={user?.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate font-heading">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200 group"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-72 transition-all duration-300">
        <main className="py-12">
          <div className="mx-auto max-w-7xl px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
