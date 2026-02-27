'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Wallet, Mail, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'Enlace enviado. Revisa tu correo electrónico.', type: 'success' })
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 transition-colors p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
            <Wallet size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">RECUPERAR</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center font-medium">Ingresa tu email para recibir un enlace de recuperación</p>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            message.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}>
            <div className={`p-2 rounded-xl flex-shrink-0 ${message.type === 'error' ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-emerald-100 dark:bg-emerald-500/20'}`}>
              {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <p className="text-xs font-bold">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enviar Enlace'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link href="/login" className="text-gray-500 dark:text-gray-400 text-sm font-black hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
