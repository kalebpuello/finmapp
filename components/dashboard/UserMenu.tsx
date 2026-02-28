'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, LogOut, Settings, ChevronDown, ShieldQuestion, Sparkles } from 'lucide-react'
import SupportModal from './SupportModal'
import InstallPWA from './InstallPWA'
import { translations, Language } from '@/lib/utils/translations'

interface UserMenuProps {
  username: string
  language?: Language
  hasNewUpdates?: boolean
}

export default function UserMenu({ username, language = 'es', hasNewUpdates = false }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const t = translations[language].nav

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowLogoutConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* ... (botón de perfil se mantiene igual) ... */}
        <button
          id="tour-profile"
          onClick={() => {
            setIsOpen(!isOpen)
            setShowLogoutConfirm(false)
          }}
          className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
        >
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20 relative">
            <User size={18} />
            {hasNewUpdates && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white dark:border-gray-950 rounded-full animate-pulse"></span>
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t.profile}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-none">{username}</p>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-100 origin-top-right">
            <div className="p-2">
              {!showLogoutConfirm ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 rounded-xl transition-colors"
                  >
                    <Settings size={18} />
                    {t.edit_profile}
                  </Link>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event('open-whats-new'))
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles size={18} className="text-amber-500" />
                      {language === 'es' ? 'Novedades' : 'What\'s New'}
                    </div>
                    {hasNewUpdates && <span className="w-2 h-2 bg-rose-500 rounded-full"></span>}
                  </button>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event('open-support-modal'))
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-500 rounded-xl transition-colors"
                  >
                    <ShieldQuestion size={18} />
                    {t.support}
                  </button>

                  <InstallPWA />
                  
                  <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1 mx-2"></div>
                  
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    {t.logout}
                  </button>
                </>
              ) : (
                <div className="p-4 text-center animate-in slide-in-from-right-2 duration-200">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">¿Cerrar Sesión?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      No
                    </button>
                    <form action="/auth/signout" method="post" className="flex-1">
                      <button
                        type="submit"
                        className="w-full py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20"
                      >
                        Sí, salir
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
