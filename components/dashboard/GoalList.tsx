'use client'

import { useState } from 'react'
import { 
  Trophy, 
  Pencil, 
  Trash2, 
  Plus, 
  ChevronRight,
  PiggyBank,
  CheckCircle2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { translations, Language } from '@/lib/utils/translations'
import EditGoalModal from './EditGoalModal'
import DeleteGoalModal from './DeleteGoalModal'
import AddGoalSavingModal from './AddGoalSavingModal'

interface GoalListProps {
  goals: any[]
  currency?: string
  language?: Language
}

export default function GoalList({ goals, currency = 'COP', language = 'es' }: GoalListProps) {
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [deletingGoal, setDeletingGoal] = useState<any>(null)
  const [addingSaving, setAddingSaving] = useState<any>(null)

  const t = translations[language].goals
  const displayAmount = (amount: number) => formatCurrency(amount, currency)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const percent = Math.min(((goal.current_saved || 0) / goal.target_amount) * 100, 100)
        const isCompleted = percent === 100

        return (
          <div key={goal.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm relative group transition-all hover:shadow-xl dark:hover:shadow-emerald-500/5">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-500 text-white animate-bounce' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 transition-colors'}`}>
                {isCompleted ? <CheckCircle2 size={24} /> : <Trophy size={24} />}
              </div>
              <div className="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingGoal(goal)}
                  className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => setDeletingGoal(goal)}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">
              {goal.name}
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{language === 'es' ? 'Meta de Ahorro' : 'Savings Goal'}</p>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-0.5 tracking-wider">{t.saved}</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">{displayAmount(goal.current_saved || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 tracking-wider">{t.target}</p>
                  <p className="text-sm font-bold text-gray-400">{displayAmount(goal.target_amount)}</p>
                </div>
              </div>

              <div className="relative h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                  {Math.round(percent)}% {t.completed}
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {t.missing} {displayAmount(Math.max(goal.target_amount - (goal.current_saved || 0), 0))}
                </span>
              </div>

              {!isCompleted && (
                <button 
                  onClick={() => setAddingSaving(goal)}
                  className="w-full mt-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all active:scale-95 group/btn shadow-lg shadow-black/10 text-xs uppercase tracking-widest"
                >
                  <PiggyBank size={18} className="group-hover/btn:rotate-12 transition-transform" />
                  {t.add_saving}
                </button>
              )}
            </div>

            {isCompleted && (
              <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] rounded-[2.5rem] pointer-events-none border-2 border-emerald-500/20"></div>
            )}
          </div>
        )
      })}

      {editingGoal && (
        <EditGoalModal goal={editingGoal} isOpen={!!editingGoal} onClose={() => setEditingGoal(null)} language={language} />
      )}
      {deletingGoal && (
        <DeleteGoalModal goal={deletingGoal} isOpen={!!deletingGoal} onClose={() => setDeletingGoal(null)} language={language} />
      )}
      {addingSaving && (
        <AddGoalSavingModal goal={addingSaving} isOpen={!!addingSaving} onClose={() => setAddingSaving(null)} language={language} />
      )}
    </div>
  )
}
