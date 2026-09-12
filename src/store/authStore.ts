import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  // L'utilisateur connecté, ou null si déconnecté
  user: User | null
  // Le token Bearer Sanctum
  token: string | null
  // Actions
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  // Vérifie si l'utilisateur est connecté
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // On initialise depuis localStorage pour persister la session après refresh
  user: (() => {
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })(),

  token: localStorage.getItem('auth_token'),

  // Appelée après login ou register — stocke user + token
  setAuth: (user: User, token: string) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ user, token })
  },

  // Appelée après logout — efface tout
  clearAuth: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null })
  },

  isAuthenticated: () => {
    return get().token !== null && get().user !== null
  },
}))
