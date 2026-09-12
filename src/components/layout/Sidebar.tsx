import { logout } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useMutation } from '@tanstack/react-query'
import { FolderKanban, LayoutDashboard, LogOut, Sparkles } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => { clearAuth(); navigate('/login'); toast.success('Déconnecté.') },
    onError: () => { clearAuth(); navigate('/login') },
  })

  // Initiales de l'utilisateur pour l'avatar
  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??'

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col z-30
      bg-gradient-to-b from-indigo-900 via-indigo-800 to-violet-900
      shadow-2xl shadow-indigo-950/50">

      {/* Logo Plio */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Plio</span>
        </div>
        <p className="text-indigo-300 text-xs mt-1 pl-11">Gestion de projets</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-indigo-200 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          Tableau de bord
        </NavLink>

        <NavLink
          to="/dashboard"
          end={false}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-200 hover:bg-white/10 hover:text-white transition-all"
          onClick={(e) => e.preventDefault()}
          aria-disabled
        >
          <FolderKanban className="w-4 h-4 shrink-0" />
          Mes projets
          <span className="ml-auto text-xs bg-white/10 text-indigo-200 px-2 py-0.5 rounded-full">
            bientôt
          </span>
        </NavLink>
      </nav>

      {/* Profil utilisateur */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          {/* Avatar initiales */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shrink-0 text-white text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-indigo-300 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
