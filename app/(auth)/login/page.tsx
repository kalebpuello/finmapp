'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Wallet, LogIn, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validación manual de email para evitar formatos incorrectos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Por favor, ingresa un correo electrónico válido.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Mensaje amigable para credenciales inválidas
      if (error.message.includes('Invalid login credentials')) {
        setMessage('El correo o la contraseña son incorrectos.')
      } else {
        setMessage(error.message)
      }
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 transition-colors p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
            <Wallet size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">FINMAPP</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center font-medium">Inicia sesión para gestionar tus finanzas</p>
        </div>
        
        {message && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-rose-100 dark:bg-rose-500/20 p-2 rounded-xl text-rose-600 dark:text-rose-500 flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{message}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-xs font-bold text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /> Entrar</>}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 font-bold tracking-widest">O continúa con</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-700 dark:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-emerald-600 dark:text-emerald-500 font-black hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
