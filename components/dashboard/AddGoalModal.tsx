'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Trophy, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { translations, Language } from '@/lib/utils/translations'

interface AddGoalModalProps {
  language?: Language
}

export default function AddGoalModal({ language = 'es' }: AddGoalModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  
  const supabase = createClient()
  const router = useRouter()
  const t = translations[language].goals

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('goals').insert({
      user_id: user.id,
      name,
      target_amount: parseFloat(targetAmount),
      current_saved: 0
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setIsOpen(false)
      setName('')
      setTargetAmount('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
      >
        <Plus size={20} />
        {t.add_btn}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                <Trophy size={20} />
                <h2 className="text-xl font-bold">{language === 'es' ? 'Crear Nueva Meta' : 'Create New Goal'}</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{language === 'es' ? '¿Qué quieres lograr?' : 'What do you want to achieve?'}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Viaje, PC..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t.target} (COP/USD)</label>
                <CurrencyInput
                  value={targetAmount}
                  onChange={setTargetAmount}
                  placeholder="0"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (language === 'es' ? 'Empezar a Ahorrar' : 'Start Saving')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
