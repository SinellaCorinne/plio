import { logout } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useMutation } from '@tanstack/react-query'
import { CheckSquare, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth()
      navigate('/login')
      toast.success('Déconnecté.')
    },
    onError: () => {
      // On déconnecte quand même côté client si l'API échoue
      clearAuth()
      navigate('/login')
    },
  })

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-gray-900">
          <CheckSquare className="w-5 h-5 text-violet-600" />
          Task Manager
        </Link>

        {/* Profil + déconnexion */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-violet-600" />
            </div>
            <span className="hidden sm:block">{user?.name}</span>
          </div>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
