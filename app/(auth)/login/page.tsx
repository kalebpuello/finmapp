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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

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
