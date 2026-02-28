'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Wallet, UserPlus, Loader2, Eye, EyeOff, Coins, Globe, AlertTriangle } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [currency, setCurrency] = useState('COP')
  const [language, setLanguage] = useState('es') // MANTENER SIEMPRE EN 'es' SEGÚN SOLICITUD
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          currency,
          language: 'es' // Forzamos español en el registro
        },
      },
    })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
      setLoading(false)
    } else {
      setMessage({ text: '¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...', type: 'success' })
      setLoading(false)
      
      // Redirigir al login después de 2 segundos para que el usuario lea el mensaje
      setTimeout(() => {
        router.push('/login')
      }, 2500)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 transition-colors p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
            <Wallet size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">ÚNETE A FINMAPP</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center font-medium">Configura tu cuenta y empieza a ahorrar</p>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}>
            <div className={`p-2 rounded-xl flex-shrink-0 ${message.type === 'error' ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-emerald-100 dark:bg-emerald-500/20'}`}>
              <AlertTriangle size={20} />
            </div>
            <p className="text-xs font-bold">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 ml-1">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
              placeholder="Ej. juanito_finanzas"
              required
            />
          </div>
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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
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

          <div className="grid grid-cols-1 gap-4 pt-2">
            <div>
              <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 ml-1 flex items-center gap-1">
                <Coins size={14} /> Moneda Inicial
              </label>
              <div className="grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setCurrency('COP')}
                  className={`py-2 rounded-xl text-[10px] font-black transition-all ${
                    currency === 'COP' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  COP
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`py-2 rounded-xl text-[10px] font-black transition-all ${
                    currency === 'USD' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
            
            {/* OCULTAMOS SELECTOR DE IDIOMA SEGÚN SOLICITUD PERO MANTENEMOS LÓGICA INTERNA */}
            <div className="hidden">
              <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 ml-1 flex items-center gap-1">
                <Globe size={14} /> Idioma
              </label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> Crear Cuenta</>}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-500 font-black hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
