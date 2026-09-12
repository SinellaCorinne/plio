import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white text-indigo-900',
            'placeholder-slate-300 transition-all',
            'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent',
            error
              ? 'border-rose-300 focus:ring-rose-400'
              : 'border-indigo-100 hover:border-indigo-200',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
