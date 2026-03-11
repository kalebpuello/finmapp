'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, HandCoins } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import UserMenu from './UserMenu'
import AppTour from './AppTour'
import { translations, Language } from '@/lib/utils/translations'

interface NavbarProps {
  username: string
  showBack?: boolean
  title?: string
  language?: Language
  lastVersionSeen?: string
  userId?: string
}

export default function Navbar({ 
  username, 
  showBack = false, 
  title = "Finmapp", 
  language = 'es',
  lastVersionSeen = '1.0.0'
}: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [showDot, setShowDot] = useState(false)
  const t = translations[language].nav
  const CURRENT_VERSION = '1.3.0'

  useEffect(() => {
    setMounted(true)
    // Verificar si hay novedades al cargar
    setShowDot(lastVersionSeen !== CURRENT_VERSION)

    // Escuchar si el usuario marca las novedades como leídas
    const handleVersionUpdate = () => setShowDot(false)
    window.addEventListener('version-updated', handleVersionUpdate)
    
    return () => window.removeEventListener('version-updated', handleVersionUpdate)
  }, [lastVersionSeen])

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* ... */}
        <div className="flex items-center gap-4">
          {showBack ? (
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
                <HandCoins size={22} className="text-white" />
              </div>
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
            {showBack ? title : "Finmapp"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {!showBack && <AppTour />}
          
          <div id="tour-theme">
            <ThemeToggle />
          </div>
          
          <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1"></div>
          
          <UserMenu username={username} language={language} hasNewUpdates={mounted ? showDot : false} />
        </div>
      </div>
    </nav>
  )
}
