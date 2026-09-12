import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Project } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(255),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ProjectFormProps {
  defaultValues?: Partial<Project>
  onSubmit: (data: FormData) => void
  loading?: boolean
  submitLabel?: string
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  loading = false,
  submitLabel = 'Enregistrer',
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Titre"
        placeholder="Mon projet"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Description <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors resize-none"
          rows={3}
          placeholder="Description du projet..."
          {...register('description')}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full mt-1">
        {submitLabel}
      </Button>
    </form>
  )
}
