import { StatusBadge } from '@/components/ui/Badge'
import { cn, formatDate } from '@/lib/utils'
import type { Task } from '@/types'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isOverdue =
    task.due_date &&
    task.status !== 'done' &&
    new Date(task.due_date) < new Date()

  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-4 flex items-start justify-between gap-3',
        'group transition-all duration-150 hover:shadow-md hover:shadow-indigo-100/50',
        task.status === 'done'
          ? 'border-slate-100 bg-slate-50/50'
          : 'border-indigo-100 hover:border-indigo-200',
      )}
    >
      {/* Barre colorée gauche selon statut */}
      <div
        className={cn(
          'w-0.5 h-full rounded-full shrink-0 self-stretch min-h-[20px]',
          task.status === 'todo'       && 'bg-slate-300',
          task.status === 'in_progress' && 'bg-indigo-400',
          task.status === 'done'       && 'bg-emerald-400',
        )}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={cn(
              'font-medium text-sm',
              task.status === 'done'
                ? 'line-through text-slate-400'
                : 'text-indigo-900',
            )}
          >
            {task.title}
          </p>
          <StatusBadge status={task.status} />
        </div>

        {task.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div
            className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              isOverdue ? 'text-rose-500' : 'text-slate-400',
            )}
          >
            <Calendar className="w-3 h-3" />
            <span>{isOverdue ? '⚠ En retard · ' : ''}{formatDate(task.due_date)}</span>
          </div>
        )}
      </div>

      {/* Actions au hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                      transition-opacity shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600
                     hover:bg-indigo-50 transition-colors"
          aria-label="Modifier"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500
                     hover:bg-rose-50 transition-colors"
          aria-label="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
