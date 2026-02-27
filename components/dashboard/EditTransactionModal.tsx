'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, ArrowUpCircle, ArrowDownCircle, Loader2, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SecurityCodeModal from './SecurityCodeModal'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { translations, Language } from '@/lib/utils/translations'

interface EditTransactionModalProps {
  transaction: any
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function EditTransactionModal({ transaction, isOpen, onClose, language = 'es' }: EditTransactionModalProps) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>(transaction.type)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [category, setCategory] = useState(transaction.category)
  const [description, setDescription] = useState(transaction.description || '')
  const [showSecurity, setShowSecurity] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const t = translations[language].modals

  const categories = {
    income: language === 'es' ? ['Salario', 'Venta', 'Inversión', 'Regalo', 'Otros'] : ['Salary', 'Sale', 'Investment', 'Gift', 'Others'],
    expense: language === 'es' ? ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Otros'] : ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Education', 'Utilities', 'Others']
  }

  const handleAttemptSave = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSecurity(true)
  }

  const handleConfirmedSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const numAmount = parseFloat(amount)
    const oldAmount = parseFloat(transaction.amount)
    const oldType = transaction.type

    const { error: txError } = await supabase
      .from('transactions')
      .update({
        amount: numAmount,
        type,
        category,
        description,
      })
      .eq('id', transaction.id)

    if (txError) {
      alert('Error: ' + txError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase.from('profiles').select('total_balance').eq('id', user.id).single()
    let currentBalance = profile?.total_balance || 0
    currentBalance = oldType === 'income' ? currentBalance - oldAmount : currentBalance + oldAmount
    const newBalance = type === 'income' ? currentBalance + numAmount : currentBalance - numAmount

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
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t.edit_tx_title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAttemptSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  type === 'income' 
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-500' 
                  : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500'
                }`}
              >
                <ArrowUpCircle size={20} />
                {t.income}
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  type === 'expense' 
                  ? 'bg-rose-100 dark:bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-500' 
                  : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500'
                }`}
              >
                <ArrowDownCircle size={20} />
                {t.expense}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">{t.amount}</label>
              <CurrencyInput
                value={amount}
                onChange={setAmount}
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
                {categories[type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t.note}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase text-xs tracking-widest"
              >
                {t.update}
              </button>
            </div>
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
