'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react'
import { translations, Language } from '@/lib/utils/translations'

interface SecurityCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  language?: Language
}

export default function SecurityCodeModal({ isOpen, onClose, onConfirm, language = 'es' }: SecurityCodeModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  
  const supabase = createClient()
  const t = translations[language].modals

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    // 1. Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      setLoading(false)
      return
    }

    // 2. Verificar contraseña re-autenticando al usuario
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    })

    if (authError) {
      setError(true)
      setLoading(false)
    } else {
      // Éxito: La contraseña es correcta
      onConfirm()
      setLoading(false)
      setPassword('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <ShieldCheck size={24} />
            <h2 className="text-xl font-black uppercase tracking-tighter">{t.auth_title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            {t.auth_desc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border ${error ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-gray-200 dark:border-gray-700'} rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white font-medium`}
              placeholder="••••••••"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {error && (
            <div className="flex items-center justify-center gap-2 text-rose-500 animate-bounce">
              <span className="text-xs font-black uppercase tracking-widest">{t.invalid_pwd}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : t.auth_btn}
          </button>
        </form>
      </div>
    </div>
  )
}
