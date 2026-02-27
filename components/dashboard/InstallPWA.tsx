'use client'

import { useState, useEffect } from 'react'
import { Download, Info } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    // Detectar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true)
      return
    }

    const handler = (e: any) => {
      e.preventDefault()
      console.log('PWA: Capturado evento de instalación')
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      // Si no hay prompt automático (Safari/iPhone o ya instalada pero en navegador)
      setShowGuide(!showGuide)
    }
  }

  // Si ya estamos dentro de la App, no mostrar nada
  if (isStandalone) return null

  return (
    <div className="px-2 py-1">
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-emerald-100 dark:border-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <Download size={18} />
          <span>Versión App</span>
        </div>
        {!deferredPrompt && <Info size={14} className="opacity-50" />}
      </button>

      {showGuide && !deferredPrompt && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-1 duration-200">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            Para instalar: Haz clic en el icono de <strong>Compartir</strong> o en los <strong>tres puntos</strong> de tu navegador y selecciona <strong>"Instalar"</strong> o <strong>"Añadir a inicio"</strong>.
          </p>
        </div>
      )}
    </div>
  )
}
