import { GuestRoute, ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import ProjectDetail from '@/pages/ProjectDetail'
import Register from '@/pages/Register'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

// Instance TanStack Query — partagée dans toute l'app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry 1 fois en cas d'erreur (pas 3 fois par défaut)
      retry: 1,
      // Les données restent "fraîches" 30 secondes
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Redirection racine */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Routes publiques — redirige vers dashboard si déjà connecté */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Routes protégées — redirige vers login si non connecté */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Route>

          {/* 404 → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

      {/* Toasts de notification (succès, erreurs) */}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{ duration: 3000 }}
      />
    </QueryClientProvider>
  )
}
