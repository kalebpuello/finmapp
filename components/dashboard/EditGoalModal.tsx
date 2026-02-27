'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecurityCodeModal from './SecurityCodeModal'
import { translations, Language } from '@/lib/utils/translations'

interface EditGoalModalProps {
  goal: any
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function EditGoalModal({ goal, isOpen, onClose, language = 'es' }: EditGoalModalProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(goal.name)
  const [targetAmount, setTargetAmount] = useState(goal.target_amount.toString())
  const [showSecurity, setShowSecurity] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const t = translations[language].goals

  const handleAttemptSave = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSecurity(true)
  }

  const handleConfirmedSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('goals')
      .update({
        name,
        target_amount: parseFloat(targetAmount),
      })
      .eq('id', goal.id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      onClose()
      router.refresh()
    }
    setLoading(false)
    setShowSecurity(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
              <Trophy size={20} />
              <h2 className="text-xl font-bold">{language === 'es' ? 'Editar Meta' : 'Edit Goal'}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAttemptSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{language === 'es' ? 'Nombre de la Meta' : 'Goal Name'}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 text-center font-bold">{t.target}</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-transparent text-4xl font-bold text-center outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase text-xs tracking-widest"
            >
              {translations[language].modals.update}
            </button>
          </form>
        </div>
      </div>

      <SecurityCodeModal 
        isOpen={showSecurity} 
        onClose={() => setShowSecurity(false)} 
        onConfirm={handleConfirmedSave} 
        language={language}
      />
    </>
  )
}
