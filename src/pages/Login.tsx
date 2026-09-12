import { login } from '@/api/auth'
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

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(`Bienvenue, ${data.user.name} !`)
      navigate('/dashboard')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche — dégradé Plio */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Cercles décoratifs */}
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
            Gérez vos projets et tâches avec clarté.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-3 text-left">
            {['Projets organisés', 'Tâches par statut', 'Suivi des échéances'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-indigo-200 text-sm">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f9ff]">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-indigo-900">Plio</span>
          </div>

          <h1 className="text-2xl font-bold text-indigo-900 mb-1">Connexion</h1>
          <p className="text-slate-500 text-sm mb-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
              S'inscrire
            </Link>
          </p>

          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />

            <Button type="submit" size="lg" loading={mutation.isPending} className="mt-2 w-full">
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
