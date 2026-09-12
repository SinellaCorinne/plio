import { getProject, deleteProject, updateProject } from '@/api/projects'
import { createTask, deleteTask, getTasks, updateTask } from '@/api/tasks'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { getErrorMessage } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ListTodo, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

type FilterStatus = TaskStatus | 'all'

const FILTER_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',         label: 'Toutes' },
  { value: 'todo',        label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done',        label: 'Terminées' },
]

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [page, setPage] = useState(1)

  const [createTaskOpen, setCreateTaskOpen]       = useState(false)
  const [editTask, setEditTask]                   = useState<Task | null>(null)
  const [deleteTaskTarget, setDeleteTaskTarget]   = useState<Task | null>(null)
  const [editProjectOpen, setEditProjectOpen]     = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)

  // ── Requêtes ───────────────────────────────────────────────
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
  })

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', projectId, statusFilter, page],
    queryFn: () => getTasks(projectId, {
      page, per_page: 10,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    enabled: !!projectId,
  })

  // ── Mutations ──────────────────────────────────────────────
  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })

  const createTaskMutation = useMutation({
    mutationFn: (data: Parameters<typeof createTask>[1]) => createTask(projectId, data),
    onSuccess: () => { invalidateTasks(); setCreateTaskOpen(false); toast.success('Tâche créée !') },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const updateTaskMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTask>[2]) =>
      updateTask(projectId, editTask!.id, data),
    onSuccess: () => { invalidateTasks(); setEditTask(null); toast.success('Tâche modifiée.') },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => deleteTask(projectId, taskId),
    onSuccess: () => { invalidateTasks(); setDeleteTaskTarget(null); toast.success('Tâche supprimée.') },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const updateProjectMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateProject>[1]) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setEditProjectOpen(false)
      toast.success('Projet modifié.')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/dashboard')
      toast.success('Projet supprimé.')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const handleFilterChange = (value: FilterStatus) => {
    setStatusFilter(value)
    setPage(1)
  }

  if (projectLoading) {
    return (
      <AppLayout>
        <div className="px-8 py-8 space-y-4 animate-pulse max-w-3xl">
          <div className="h-8 bg-indigo-100 rounded-xl w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
        </div>
      </AppLayout>
    )
  }

  if (!project) return null

  return (
    <AppLayout>
      <div className="px-8 py-8 max-w-3xl">

        {/* Retour */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400
                     hover:text-indigo-600 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Tableau de bord
        </Link>

        {/* Header projet */}
        <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-6
                        shadow-sm shadow-indigo-50">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-indigo-900">{project.title}</h1>
              {project.description && (
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditProjectOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600
                           hover:bg-indigo-50 transition-colors"
                aria-label="Modifier"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteProjectOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500
                           hover:bg-rose-50 transition-colors"
                aria-label="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {tasksData && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex gap-6 text-xs text-slate-400">
              <span><b className="text-indigo-700">{tasksData.total}</b> tâche{tasksData.total !== 1 ? 's' : ''}</span>
              <span>
                <b className="text-emerald-600">
                  {tasksData.data.filter((t) => t.status === 'done').length}
                </b> terminée{tasksData.data.filter((t) => t.status === 'done').length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Filtres + bouton */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex gap-0.5 bg-indigo-50 rounded-xl p-1">
            {FILTER_TABS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  statusFilter === f.value
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </Button>
        </div>

        {/* Liste tâches */}
        {tasksLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-indigo-100 p-4 animate-pulse">
                <div className="h-4 bg-indigo-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : tasksData?.data.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
              <ListTodo className="w-6 h-6 text-indigo-300" />
            </div>
            <p className="text-slate-400 text-sm">
              {statusFilter === 'all'
                ? 'Aucune tâche. Ajoutez-en une !'
                : 'Aucune tâche avec ce filtre.'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {tasksData?.data.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditTask}
                  onDelete={setDeleteTaskTarget}
                />
              ))}
            </div>

            {tasksData && tasksData.last_page > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button variant="secondary" size="sm" disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}>← Précédent</Button>
                <span className="text-sm text-slate-400">
                  {tasksData.current_page} / {tasksData.last_page}
                </span>
                <Button variant="secondary" size="sm" disabled={page === tasksData.last_page}
                  onClick={() => setPage((p) => p + 1)}>Suivant →</Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modales tâches ── */}
      <Modal open={createTaskOpen} onClose={() => setCreateTaskOpen(false)} title="Nouvelle tâche">
        <TaskForm onSubmit={(d) => createTaskMutation.mutate(d)}
          loading={createTaskMutation.isPending} submitLabel="Créer" />
      </Modal>

      <Modal open={!!editTask} onClose={() => setEditTask(null)} title="Modifier la tâche">
        {editTask && (
          <TaskForm defaultValues={editTask}
            onSubmit={(d) => updateTaskMutation.mutate(d)}
            loading={updateTaskMutation.isPending} submitLabel="Enregistrer" />
        )}
      </Modal>

      <Modal open={!!deleteTaskTarget} onClose={() => setDeleteTaskTarget(null)}
        title="Supprimer la tâche" size="sm">
        <p className="text-sm text-slate-500 mb-5">
          Supprimer <span className="font-semibold text-indigo-900">"{deleteTaskTarget?.title}"</span> ?
          Cette action est irréversible.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTaskTarget(null)}>Annuler</Button>
          <Button variant="danger" loading={deleteTaskMutation.isPending}
            onClick={() => deleteTaskMutation.mutate(deleteTaskTarget!.id)}>Supprimer</Button>
        </div>
      </Modal>

      {/* ── Modales projet ── */}
      <Modal open={editProjectOpen} onClose={() => setEditProjectOpen(false)} title="Modifier le projet">
        <ProjectForm defaultValues={project}
          onSubmit={(d) => updateProjectMutation.mutate(d)}
          loading={updateProjectMutation.isPending} submitLabel="Enregistrer" />
      </Modal>

      <Modal open={deleteProjectOpen} onClose={() => setDeleteProjectOpen(false)}
        title="Supprimer le projet" size="sm">
        <p className="text-sm text-slate-500 mb-5">
          Supprimer <span className="font-semibold text-indigo-900">"{project.title}"</span> et
          toutes ses tâches ? Cette action est irréversible.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteProjectOpen(false)}>Annuler</Button>
          <Button variant="danger" loading={deleteProjectMutation.isPending}
            onClick={() => deleteProjectMutation.mutate()}>Supprimer</Button>
        </div>
      </Modal>
    </AppLayout>
  )
}
