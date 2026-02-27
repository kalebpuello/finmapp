'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, PiggyBank } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { Language } from '@/lib/utils/translations'

interface AddGoalSavingModalProps {
  goal: any
  isOpen: boolean
  onClose: () => void
  language?: Language
}

export default function AddGoalSavingModal({ goal, isOpen, onClose, language = 'es' }: AddGoalSavingModalProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  // FORZAMOS ESPAÑOL SEGÚN SOLICITUD
  const activeLang = 'es'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const savingAmount = parseFloat(amount)

    const { error: goalError } = await supabase
      .from('goals')
      .update({
        current_saved: (goal.current_saved || 0) + savingAmount
      })
      .eq('id', goal.id)

    if (goalError) {
      alert('Error: ' + goalError.message)
      setLoading(false)
      return
    }

    await supabase.from('transactions').insert({
      user_id: user.id,
      amount: savingAmount,
      type: 'expense',
      category: 'saving', // Guardamos el slug técnico
      description: `Ahorro para: ${goal.name}`,
    })

    const { data: profile } = await supabase.from('profiles').select('total_balance').eq('id', user.id).single()
    const newBalance = (profile?.total_balance || 0) - savingAmount
    await supabase.from('profiles').update({ total_balance: newBalance }).eq('id', user.id)

    setLoading(false)
    onClose()
    setAmount('')
    router.refresh()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <PiggyBank size={20} />
            <h2 className="text-xl font-bold">{activeLang === 'es' ? 'Abonar a la Meta' : 'Save for Goal'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
          {activeLang === 'es' ? `Ingresa cuánto dinero vas a separar hoy para ${goal.name}.` : `Enter how much money you will set aside today for ${goal.name}.`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">
              {activeLang === 'es' ? 'Monto a Abonar' : 'Amount to Save'}
            </label>
            <CurrencyInput
              value={amount}
              onChange={setAmount}
              placeholder="0"
              className="w-full bg-transparent text-4xl font-bold text-center outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (activeLang === 'es' ? 'Confirmar Abono' : 'Confirm Saving')}
          </button>
        </form>
      </div>
    </div>
  )
}
