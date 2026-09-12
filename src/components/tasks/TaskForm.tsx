import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Task, TaskStatus } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  due_date: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface TaskFormProps {
  defaultValues?: Partial<Task>
  onSubmit: (data: FormData) => void
  loading?: boolean
  submitLabel?: string
}

export function TaskForm({
  defaultValues,
  onSubmit,
  loading = false,
  submitLabel = 'Enregistrer',
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      status: (defaultValues?.status as TaskStatus) ?? 'todo',
      due_date: defaultValues?.due_date ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Titre"
        placeholder="Nom de la tâche"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Description <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          rows={2}
          placeholder="Détails de la tâche..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Statut</label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            {...register('status')}
          >
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé</option>
          </select>
        </div>

        <Input
          label="Échéance"
          type="date"
          error={errors.due_date?.message}
          {...register('due_date')}
        />
      </div>

      <Button type="submit" loading={loading} className="w-full mt-1">
        {submitLabel}
      </Button>
    </form>
  )
}
