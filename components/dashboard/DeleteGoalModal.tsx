'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecurityCodeModal from './SecurityCodeModal'
import { Language } from '@/lib/utils/translations'

interface DeleteGoalModalProps {
  goal: any
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function DeleteGoalModal({ goal, isOpen, onClose, language = 'es' }: DeleteGoalModalProps) {
  const [loading, setLoading] = useState(false)
  const [showSecurity, setShowSecurity] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleConfirmedDelete = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const amountToReturn = parseFloat(goal.current_saved || 0)

      if (amountToReturn > 0) {
        const { data: profile } = await supabase.from('profiles').select('total_balance').eq('id', user.id).single()
        const newBalance = (profile?.total_balance || 0) + amountToReturn
        await supabase.from('profiles').update({ total_balance: newBalance }).eq('id', user.id)
      }

      await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id)
        .or(`description.ilike.%Ahorro para: ${goal.name}%,description.ilike.%Abono a: ${goal.name}%`)

      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('id', goal.id)

      if (deleteError) throw deleteError

      onClose()
      router.refresh()
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
      setShowSecurity(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white text-center">
          <div className="bg-rose-100 dark:bg-rose-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-500">
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-xl font-bold mb-2">{language === 'es' ? '¿Eliminar esta meta?' : 'Delete this goal?'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
            {language === 'es' ? 'Esta acción no se puede deshacer y el dinero ahorrado volverá a tu saldo.' : 'This action cannot be undone and saved money will return to your balance.'}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowSecurity(true)}
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest"
            >
              <Trash2 size={20} />
              {language === 'es' ? 'Eliminar y Limpiar' : 'Delete and Clean'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-black py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-xs tracking-widest"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>

      <SecurityCodeModal 
        isOpen={showSecurity} 
        onClose={() => setShowSecurity(false)} 
        onConfirm={handleConfirmedDelete} 
        language={language}
      />
    </>
  )
}
