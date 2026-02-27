'use client'

import { useState, useEffect } from 'react'
import SupportModal from './SupportModal'
import WhatsNewModal from './WhatsNewModal'
import { createClient } from '@/lib/supabase/client'

const APP_VERSION = '1.2.0'

const GlobalModals = () => {
  const [mounted, setMounted] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, last_version_seen')
          .eq('id', user.id)
          .single()
        
        setUserProfile(data)
      }
    }
    fetchProfile()

    // Manejadores de eventos globales
    const handleOpenSupport = () => setIsSupportOpen(true)
    const handleOpenWhatsNew = () => setIsWhatsNewOpen(true)
    const handleTourFinished = () => {
      // Cuando el tour termina, simplemente refrescamos el perfil 
      // para asegurar que el punto rojo aparezca si la versión es vieja
      fetchProfile()
    }
    
    window.addEventListener('open-support-modal', handleOpenSupport)
    window.addEventListener('open-whats-new', handleOpenWhatsNew)
    window.addEventListener('tour-finished', handleTourFinished)
    
    return () => {
      window.removeEventListener('open-support-modal', handleOpenSupport)
      window.removeEventListener('open-whats-new', handleOpenWhatsNew)
      window.removeEventListener('tour-finished', handleTourFinished)
    }
  }, [userProfile?.last_version_seen]) // Re-ejecutar si cambia la versión

  if (!mounted) return null

  return (
    <>
      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
      />
      
      <WhatsNewModal 
        userProfile={userProfile} 
        isOpen={isWhatsNewOpen} 
        onClose={() => setIsWhatsNewOpen(false)} 
      />
    </>
  )
}

GlobalModals.displayName = 'GlobalModals'
export default GlobalModals
