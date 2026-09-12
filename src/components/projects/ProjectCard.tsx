import { formatDate } from '@/lib/utils'
import type { Project } from '@/types'
import { Calendar, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Couleurs de dot assignées par l'id du projet — donne de la variété visuelle
const COLORS = [
  'from-violet-500 to-purple-600',
  'from-indigo-500 to-blue-600',
  'from-sky-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
]

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const color = COLORS[project.id % COLORS.length]

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block bg-white rounded-2xl border border-indigo-100 p-5
                 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/60
                 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar coloré */}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color}
                           flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-white font-bold text-sm">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-indigo-900 truncate
                           group-hover:text-indigo-600 transition-colors text-sm">
              {project.title}
            </h3>
            {project.description ? (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            ) : (
              <p className="text-xs text-slate-300 mt-0.5 italic">Aucune description</p>
            )}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400
                                  shrink-0 mt-0.5 transition-colors" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-50
                      text-xs text-slate-400">
        <Calendar className="w-3 h-3" />
        <span>{formatDate(project.created_at)}</span>
      </div>
    </Link>
  )
}
