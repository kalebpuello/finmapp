'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { translations, Language } from '@/lib/utils/translations'

interface AddTransactionModalProps {
  label: string
  language?: Language
}

export default function AddTransactionModal({ label, language = 'es' }: AddTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  
  const supabase = createClient()
  const router = useRouter()
  const t = translations[language].modals
  const catNames = translations[language].categories

  // Las opciones muestran el nombre traducido, pero el valor es el "slug" técnico
  const incomeCategories = [
    { slug: 'salary', name: catNames.salary },
    { slug: 'sale', name: catNames.sale },
    { slug: 'investment', name: catNames.investment },
    { slug: 'gift', name: catNames.gift },
    { slug: 'others', name: catNames.others }
  ]

  const expenseCategories = [
    { slug: 'food', name: catNames.food },
    { slug: 'transport', name: catNames.transport },
    { slug: 'housing', name: catNames.housing },
    { slug: 'entertainment', name: catNames.entertainment },
    { slug: 'health', name: catNames.health },
    { slug: 'education', name: catNames.education },
    { slug: 'utilities', name: catNames.utilities },
    { slug: 'others', name: catNames.others }
  ]

  const categories = {
    income: incomeCategories,
    expense: expenseCategories
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const numAmount = parseFloat(amount)

    const { error: txError } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: numAmount,
      type,
      category, // Aquí se guarda el 'slug' (ej. 'food')
      description,
    })

    if (txError) {
      alert('Error: ' + txError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase.from('profiles').select('total_balance').eq('id', user.id).single()
    const newBalance = type === 'income' 
      ? (profile?.total_balance || 0) + numAmount 
      : (profile?.total_balance || 0) - numAmount

    await supabase.from('profiles').update({ total_balance: newBalance }).eq('id', user.id)

    setLoading(false)
    setIsOpen(false)
    setAmount('')
    setCategory('')
    setDescription('')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={20} strokeWidth={3} />
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.add_tx_title}</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="0"
                  className="w-full bg-transparent text-4xl font-bold text-center outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800"
                  autoFocus
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
                  <option value="">{language === 'es' ? 'Selecciona una categoría' : 'Select a category'}</option>
                  {categories[type].map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
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

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                } disabled:opacity-50 shadow-lg shadow-emerald-500/10`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : t.save}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
