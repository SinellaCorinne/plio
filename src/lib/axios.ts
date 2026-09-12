import axios from 'axios'

// On crée une instance Axios configurée pour notre API
const api = axios.create({
  // L'URL de base vient du fichier .env — Vite expose les variables VITE_*
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Intercepteur de requête ─────────────────────────────────────
// Avant chaque requête, on ajoute automatiquement le token Bearer
// si l'utilisateur est connecté — plus besoin de le passer manuellement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Intercepteur de réponse ─────────────────────────────────────
// Si le serveur retourne 401, le token est expiré/invalide
// On nettoie le localStorage et on redirige vers /login
api.interceptors.response.use(
  // Succès : on retourne la réponse telle quelle
  (response) => response,
  // Erreur
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirection vers login si on n'y est pas déjà
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
