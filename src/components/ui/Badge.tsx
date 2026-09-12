import { cn, statusConfig } from '@/lib/utils'
import type { TaskStatus } from '@/types'

interface BadgeProps {
  status: TaskStatus
  className?: string
}

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig(status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
        config.className,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
