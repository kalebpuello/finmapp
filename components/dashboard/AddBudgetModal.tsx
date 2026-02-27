'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, Loader2, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { Language } from '@/lib/utils/translations'

interface AddBudgetModalProps {
  language?: Language
}

export default function AddBudgetModal({ language = 'es' }: AddBudgetModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [limitAmount, setLimitAmount] = useState('')
  const [category, setCategory] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  const categories = language === 'es' 
    ? ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Otros']
    : ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Utilities', 'Others']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('budgets').insert({
      user_id: user.id,
      category,
      limit_amount: parseFloat(limitAmount),
      current_spent: 0
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setIsOpen(false)
      setLimitAmount('')
      setCategory('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
      >
        <Plus size={18} />
        {language === 'es' ? 'Planear Presupuesto' : 'Plan Budget'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                <Target size={20} />
                <h2 className="text-xl font-bold">{language === 'es' ? 'Planear Gasto Mensual' : 'Plan Monthly Expense'}</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              {language === 'es' ? 'Define cuánto planeas gastar en una categoría para el próximo mes.' : 'Define how much you plan to spend in a category for the next month.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">
                  {language === 'es' ? 'Presupuesto Límite' : 'Budget Limit'}
                </label>
                <CurrencyInput
                  value={limitAmount}
                  onChange={setLimitAmount}
                  placeholder="0"
                  className="w-full bg-transparent text-4xl font-bold text-center outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {language === 'es' ? 'Categoría a Controlar' : 'Category to Monitor'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white font-medium"
                  required
                >
                  <option value="">{language === 'es' ? 'Selecciona una categoría' : 'Select a category'}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (language === 'es' ? 'Establecer Presupuesto' : 'Set Budget')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
