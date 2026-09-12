import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TaskStatus } from '@/types'

// Utilitaire pour combiner des classes Tailwind sans conflits
// ex: cn('px-2 py-1', isActive && 'bg-blue-500', 'px-4') → 'py-1 bg-blue-500 px-4'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formate une date ISO en format lisible français
// "2026-12-31" → "31 déc. 2026"
export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Retourne les couleurs Tailwind selon le statut d'une tâche
export function statusConfig(status: TaskStatus) {
  const configs = {
    todo: {
      label: 'À faire',
      className: 'bg-slate-100 text-slate-600',
      dot: 'bg-slate-400',
    },
    in_progress: {
      label: 'En cours',
      className: 'bg-indigo-100 text-indigo-700',
      dot: 'bg-indigo-500',
    },
    done: {
      label: 'Terminé',
      className: 'bg-emerald-100 text-emerald-700',
      dot: 'bg-emerald-500',
    },
  }
  return configs[status]
}

// Extrait le message d'erreur d'une réponse Axios
export function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = error.response.data as { message?: string }
    return data?.message ?? 'Une erreur est survenue.'
  }
  return 'Une erreur est survenue.'
}
