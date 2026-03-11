'use client'

import { Sparkles, Smartphone, Palette, AlertTriangle, ShieldCheck, Calendar, X, Chrome, MousePointer2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const APP_VERSION = '1.2.0'

interface WhatsNewModalProps {
  userProfile: any
  isOpen: boolean
  onClose: () => void
}

const WhatsNewModal = ({ userProfile, isOpen, onClose }: WhatsNewModalProps) => {
  const supabase = createClient()

  const handleConfirm = async () => {
    onClose()
    
    // Solo actualizamos la base de datos si el usuario realmente está "atrasado"
    if (userProfile && userProfile.last_version_seen !== APP_VERSION) {
      console.log('PWA: Actualizando versión de usuario en DB a', APP_VERSION)
      await supabase
        .from('profiles')
        .update({ last_version_seen: APP_VERSION })
        .eq('id', userProfile.id)
      
      // Avisamos a la app que la versión cambió para quitar el punto rojo
      window.dispatchEvent(new Event('version-updated'))
    }
  }

  if (!isOpen) return null

  const releases = [
    {
      version: "v1.3.0",
      date: "27 de Febrero, 2026",
      features: [
        {
          icon: <Chrome className="text-blue-500" />,
          title: "Acceso con Google",
          desc: "Inicia sesión de forma más rápida y segura usando tu cuenta de Google."
        },
        {
          icon: <MousePointer2 className="text-emerald-500" />,
          title: "Confirmación de Salida",
          desc: "Hemos añadido un paso de seguridad para evitar cierres de sesión accidentales."
        },
        {
          icon: <Palette className="text-violet-500" />,
          title: "Branding Renovado",
          desc: "Nuevo icono premium y mejoras visuales en el App Tour con colores dinámicos."
        }
      ]
    },
    {
      version: "v1.2.0",
      date: "26 Febrero 2026",
      features: [
        {
          icon: <Smartphone className="text-blue-500" />,
          title: "App Instalable",
          desc: "Usa Finmapp como una app nativa en PC y móvil sin barras de navegación."
        },
        {
          icon: <Palette className="text-violet-500" />,
          title: "Temas de Colores",
          desc: "Personaliza el color de la interfaz desde tu perfil."
        },
        {
          icon: <AlertTriangle className="text-rose-500" />,
          title: "Gestión de Deuda",
          desc: "Alertas visuales automáticas cuando tu saldo es negativo."
        }
      ]
    }
  ]

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={handleConfirm} />
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white relative flex-shrink-0 text-left">
          <Sparkles size={60} className="absolute right-4 bottom-2 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Actualización de Sistema</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Novedades</h2>
        </div>

        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1 text-left">
          {releases.map((rel, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">{rel.version}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Calendar size={12} /> {rel.date}
                </div>
              </div>
              <div className="space-y-4">
                {rel.features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl h-fit">{f.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight mb-1">{f.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 text-center">
          <button onClick={handleConfirm} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-widest text-sm">
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  )
}

WhatsNewModal.displayName = 'WhatsNewModal'
export default WhatsNewModal
