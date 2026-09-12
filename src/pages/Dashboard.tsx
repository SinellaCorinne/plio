import { createProject, getProjects } from '@/api/projects'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { getErrorMessage } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FolderOpen, Plus, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Dashboard() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => getProjects({ page, per_page: 9 }),
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowCreateModal(false)
      toast.success('Projet créé !')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  // Heure du jour pour le message d'accueil
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <AppLayout>
      <div className="px-8 py-8 max-w-5xl">

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-indigo-900">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Voici un aperçu de vos projets.
          </p>
        </div>

        {/* Stat rapide */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-indigo-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    Projets
                  </p>
                  <p className="text-3xl font-bold text-indigo-900 mt-1">{data.total}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Titre section + bouton */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-indigo-900">Tous les projets</h2>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-3.5 h-3.5" />
            Nouveau projet
          </Button>
        </div>

        {/* Grille projets */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-indigo-100 p-5 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 bg-indigo-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-indigo-300" />
            </div>
            <h2 className="text-base font-semibold text-indigo-900 mb-1">
              Aucun projet pour l'instant
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Créez votre premier projet pour commencer.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Créer un projet
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {data && data.last_page > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Précédent
                </Button>
                <span className="text-sm text-slate-500">
                  {data.current_page} / {data.last_page}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === data.last_page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant →
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouveau projet"
      >
        <ProjectForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          submitLabel="Créer le projet"
        />
      </Modal>
    </AppLayout>
  )
}
