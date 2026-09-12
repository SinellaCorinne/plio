import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Overlay */}
      <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm"
        onClick={onClose} aria-hidden="true" />
      {/* Panneau */}
      <div className={cn(
        'relative w-full bg-white rounded-2xl shadow-2xl shadow-indigo-200/50 p-6 z-10',
        'border border-indigo-100',
        sizes[size],
      )}>
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-base font-semibold text-indigo-900">
            {title}
          </h2>
          <button onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600
                       hover:bg-indigo-50 transition-colors"
            aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
