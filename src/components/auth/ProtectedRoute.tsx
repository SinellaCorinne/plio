import { useAuthStore } from '@/store/authStore'
import { Navigate, Outlet } from 'react-router-dom'

// Guard pour les routes protégées :
// si non connecté → redirige vers /login
// si connecté → affiche la page demandée via <Outlet />
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

// Guard pour les routes publiques (login/register) :
// si déjà connecté → redirige vers /dashboard
// sinon → affiche la page
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}
