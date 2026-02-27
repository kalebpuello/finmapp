'use client'

import { useEffect, useState, useRef } from 'react'
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
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  TriangleAlert
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import Navbar from '@/components/dashboard/Navbar'
import ColorThemePicker, { ColorThemePickerRef } from '@/components/theme/ColorThemePicker'
import { translations, Language } from '@/lib/utils/translations'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [currency, setCurrency] = useState('COP')
  const [language, setLanguage] = useState<Language>('es') // FORZAMOS ESTADO EN 'es'
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Estados para visibilidad
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeletePwd, setShowDeletePwd] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const colorPickerRef = useRef<ColorThemePickerRef>(null)

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

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    if (!deletePassword) {
      setDeleteError('Por favor, ingresa tu contraseña para confirmar.')
      return
    }

    setDeleting(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. VERIFICAR CONTRASEÑA ANTES DE ELIMINAR
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: deletePassword,
    })

    if (authError) {
      setDeleteError('La contraseña ingresada es incorrecta.')
      setDeleting(false)
      return
    }

    // 2. PROCEDER CON LA ELIMINACIÓN
    const { error } = await supabase.rpc('delete_user_account')

    if (error) {
      setDeleteError('Error al eliminar la cuenta: ' + error.message)
      setDeleting(false)
      return
    }

    // 3. CERRAR SESIÓN Y REDIRIGIR AL LOGIN
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. VALIDAR SI SE QUIERE CAMBIAR CONTRASEÑA
    if (newPassword) {
      if (!currentPassword) {
        setMessage({ text: 'Debes ingresar tu contraseña actual para cambiar la clave', type: 'error' })
        setUpdating(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setMessage({ text: 'Las nuevas contraseñas no coinciden', type: 'error' })
        setUpdating(false)
        return
      }

      // Re-autenticación solo si se cambia la clave
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      })

      if (authError) {
        setMessage({ text: 'La contraseña actual es incorrecta', type: 'error' })
        setUpdating(false)
        return
      }

      // Actualizar clave en Supabase
      const { error: pwdError } = await supabase.auth.updateUser({ password: newPassword })
      if (pwdError) {
        setMessage({ text: t.error + ': ' + pwdError.message, type: 'error' })
        setUpdating(false)
        return
      }
    }

    // 2. ACTUALIZAR PERFIL (Siempre permitido si la sesión es válida)
    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        currency,
        language: 'es', 
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      setMessage({ text: t.error + ': ' + error.message, type: 'error' })
    } else {
      // Éxito
      colorPickerRef.current?.save()
      setMessage({ text: t.success, type: 'success' })
      setCurrentPassword('')
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
      <Navbar 
        username={username || 'Usuario'} 
        showBack 
        title={t.title} 
        language={activeLang} 
        lastVersionSeen={profile?.last_version_seen} 
        userId={profile?.id}
      />

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

            <ColorThemePicker ref={colorPickerRef} />
          </section>

          {/* Seguridad */}
          <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-sm relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-rose-100 dark:bg-rose-500/10 p-2.5 rounded-xl text-rose-600">
                  <Lock size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tighter">{t.security}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-full transition-all"
              >
                <AlertCircle size={20} />
              </button>
            </div>

            {/* Modal de Ayuda para Contraseña */}
            {showHelp && (
              <div className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-[2rem] p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-200">
                <div className="bg-emerald-100 dark:bg-emerald-500/10 p-4 rounded-full text-emerald-600 mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black mb-2">Seguridad de Cuenta</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                  Para tu protección, solo pedimos tu <strong>Contraseña Actual</strong> si decides cambiar tu clave de acceso. 
                  <br/><br/>
                  Los cambios de color, moneda o nombre de usuario se pueden realizar sin restricciones.
                </p>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-colors"
                >
                  Entendido
                </button>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Contraseña Actual - Solo obligatoria si hay nueva contraseña */}
              <div className={`pb-6 border-b border-dashed border-gray-100 dark:border-gray-800 transition-opacity duration-300 ${newPassword ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-rose-500" /> Contraseña Actual {newPassword && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all text-gray-900 dark:text-white"
                    placeholder={newPassword ? "Confirma tu identidad" : "No requerida para cambios estéticos"}
                    required={!!newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <p className="text-[10px] text-gray-500 mb-4 italic flex items-center gap-2">
                  <AlertCircle size={10} /> Solo llena estos campos si quieres cambiar tu contraseña.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.new_password}</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
                        placeholder="••••••••"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.confirm_password}</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
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

        {/* Zona de Peligro - Eliminación de Cuenta */}
        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-black text-rose-600 dark:text-rose-500 uppercase tracking-tighter mb-1">Zona de Peligro</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xs">
                Si eliminas tu cuenta, todos tus datos (transacciones, metas y presupuestos) se borrarán permanentemente.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-500 font-black rounded-2xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all active:scale-95 flex items-center gap-2"
            >
              <Trash2 size={20} /> Eliminar mi Cuenta
            </button>
          </div>
        </div>

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !deleting && setShowDeleteConfirm(false)} />
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="bg-rose-100 dark:bg-rose-500/10 p-4 rounded-full text-rose-600 mb-6">
                  <TriangleAlert size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">¿Estás seguro?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
                  Esta acción es <strong>irreversible</strong>. Perderás todo tu historial financiero y acceso a Finmapp de inmediato.
                </p>

                {/* Confirmación con Contraseña */}
                <div className="w-full mb-8 text-left">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Confirma con tu Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePwd ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all text-gray-900 dark:text-white"
                      placeholder="Escribe tu contraseña"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePwd(!showDeletePwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      {showDeletePwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Mensaje de Error Interno en el Modal */}
                {deleteError && (
                  <div className="w-full mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="text-rose-600 shrink-0" />
                    <p className="text-xs font-bold text-rose-600 text-left">{deleteError}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    disabled={deleting}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                    className="py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="animate-spin" size={20} /> : 'Sí, Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
