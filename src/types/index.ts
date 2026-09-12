// ─── Utilisateur ───────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

// ─── Projet ────────────────────────────────────────────────────
export interface Project {
  id: number
  user_id: number
  title: string
  description: string | null
  created_at: string
  updated_at: string
  tasks?: Task[] // présent seulement sur le show()
}

// ─── Tâche ─────────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  project_id: number
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  created_at: string
  updated_at: string
}

// ─── Réponses paginées ─────────────────────────────────────────
// Structure retournée par ->paginate() côté Laravel
export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
}

// ─── Auth ──────────────────────────────────────────────────────
export interface AuthResponse {
  user: User
  token: string
}

// ─── Erreurs API ───────────────────────────────────────────────
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
