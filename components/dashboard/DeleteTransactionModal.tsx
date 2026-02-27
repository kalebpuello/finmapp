'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecurityCodeModal from './SecurityCodeModal'
import { translations, Language } from '@/lib/utils/translations'

interface DeleteTransactionModalProps {
  transaction: any
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function DeleteTransactionModal({ transaction, isOpen, onClose, language = 'es' }: DeleteTransactionModalProps) {
  const [loading, setLoading] = useState(false)
  const [showSecurity, setShowSecurity] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const t = translations[language].modals

  const handleConfirmedDelete = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: txError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transaction.id)

    if (txError) {
      alert('Error: ' + txError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase.from('profiles').select('total_balance').eq('id', user.id).single()
    const amount = parseFloat(transaction.amount)
    const newBalance = transaction.type === 'income' 
      ? (profile?.total_balance || 0) - amount 
      : (profile?.total_balance || 0) + amount

    await supabase.from('profiles').update({ total_balance: newBalance }).eq('id', user.id)

    setLoading(false)
    setShowSecurity(false)
    onClose()
    router.refresh()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white text-center">
          <div className="bg-rose-100 dark:bg-rose-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600 dark:text-rose-500">
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-xl font-bold mb-2">{t.confirm_delete}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t.delete_warning}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowSecurity(true)}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase text-xs tracking-widest"
            >
              <Trash2 size={20} />
              {t.delete_btn}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-xs tracking-widest"
            >
              {t.cancel}
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
