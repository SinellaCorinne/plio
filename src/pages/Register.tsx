import { register as registerApi } from '@/api/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z
  .object({
    name: z.string().min(2, 'Au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Au moins 8 caractères'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  })

type FormData = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success('Compte créé !')
      navigate('/dashboard')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-3xl tracking-tight">Plio</span>
          </div>
          <p className="text-indigo-200 text-lg max-w-xs leading-relaxed">
            Rejoignez Plio et prenez le contrôle de vos projets.
          </p>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f9ff]">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-indigo-900">Plio</span>
          </div>

          <h1 className="text-2xl font-bold text-indigo-900 mb-1">Créer un compte</h1>
          <p className="text-slate-500 text-sm mb-8">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>

          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input label="Nom complet" type="text" placeholder="Votre nom"
              error={errors.name?.message} autoComplete="name" {...register('name')} />
            <Input label="Email" type="email" placeholder="vous@exemple.com"
              error={errors.email?.message} autoComplete="email" {...register('email')} />
            <Input label="Mot de passe" type="password" placeholder="8 caractères minimum"
              error={errors.password?.message} autoComplete="new-password" {...register('password')} />
            <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••"
              error={errors.password_confirmation?.message} autoComplete="new-password"
              {...register('password_confirmation')} />

            <Button type="submit" size="lg" loading={mutation.isPending} className="mt-2 w-full">
              Créer mon compte
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
