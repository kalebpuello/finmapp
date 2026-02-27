'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Lock, 
  Globe, 
  Coins, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import Navbar from '@/components/dashboard/Navbar'
import { translations, Language } from '@/lib/utils/translations'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [currency, setCurrency] = useState('COP')
  const [language, setLanguage] = useState<Language>('es') // FORZAMOS ESTADO EN 'es'
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const supabase = createClient()
  const router = useRouter()
  
  // FORZAMOS DICCIONARIO ESPAÑOL SEGÚN SOLICITUD
  const activeLang: Language = 'es'
  const t = translations[activeLang].profile

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
      setUsername(data.username || '')
      setCurrency(data.currency || 'COP')
      setLanguage('es') // Ignoramos el valor de la DB para la UI por ahora
    }
    setLoading(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        currency,
        language: 'es', // Siempre guardamos es
        updated_at: new Date().toISOString()
      })
      .eq('id', user?.id)

    if (error) {
      setMessage({ text: t.error + ': ' + error.message, type: 'error' })
    } else {
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage({ text: 'Las contraseñas no coinciden', type: 'error' })
          setUpdating(false)
          return
        }
        const { error: pwdError } = await supabase.auth.updateUser({ password: newPassword })
        if (pwdError) {
          setMessage({ text: t.error + ': ' + pwdError.message, type: 'error' })
          setUpdating(false)
          return
        }
      }
      setMessage({ text: t.success, type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
      router.refresh()
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12 bg-white dark:bg-gray-950 transition-colors text-gray-900 dark:text-white">
      <Navbar username={username || 'Usuario'} showBack title={t.title} language={activeLang} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* Información Básica */}
          <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600">
                <User size={20} />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tighter">{t.personal_info}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.username}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </section>

          {/* Preferencias */}
          <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tighter">{t.preferences}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                  <Coins size={14} /> {t.currency}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
                >
                  <option value="COP">Pesos Colombianos (COP)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </div>
              
              {/* OCULTAMOS SELECTOR DE IDIOMA PERO MANTENEMOS LÓGICA */}
              <div className="hidden">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                  <Globe size={14} /> {t.language}
                </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-100 dark:bg-rose-500/10 p-2.5 rounded-xl text-rose-600">
                <Lock size={20} />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tighter">{t.security}</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-4 italic">{t.security_note}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.new_password}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.confirm_password}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Mensajes de feedback */}
          {message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {updating ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> {t.save_changes}</>}
          </button>

        </form>
      </main>
    </div>
  )
}
