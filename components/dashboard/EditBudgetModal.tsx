'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecurityCodeModal from './SecurityCodeModal'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { translations, Language } from '@/lib/utils/translations'

interface EditBudgetModalProps {
  budget: any
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function EditBudgetModal({ budget, isOpen, onClose, language = 'es' }: EditBudgetModalProps) {
  const [loading, setLoading] = useState(false)
  const [limitAmount, setLimitAmount] = useState(budget.limit_amount.toString())
  const [category, setCategory] = useState(budget.category)
  const [showSecurity, setShowSecurity] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const t = translations[language].modals

  const categories = language === 'es' ? ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Otros'] : ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Utilities', 'Others']

  const handleAttemptSave = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSecurity(true)
  }

  const handleConfirmedSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('budgets')
      .update({
        limit_amount: parseFloat(limitAmount),
        category,
      })
      .eq('id', budget.id)

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
              <Target size={20} />
              <h2 className="text-xl font-bold">{language === 'es' ? 'Editar Presupuesto' : 'Edit Budget'}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAttemptSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">{t.amount}</label>
              <CurrencyInput
                value={limitAmount}
                onChange={setLimitAmount}
                className="w-full bg-transparent text-4xl font-bold text-center outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t.category}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase text-xs tracking-widest"
            >
              {t.update}
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
