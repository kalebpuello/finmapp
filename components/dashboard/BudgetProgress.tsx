'use client'

import { useState } from 'react'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts'
import { Target, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { translations, Language } from '@/lib/utils/translations'
import EditBudgetModal from './EditBudgetModal'
import DeleteBudgetModal from './DeleteBudgetModal'

interface BudgetProgressProps {
  budgets: any[]
  expensesByCategory: { [key: string]: number }
  currency?: string
  language?: Language
}

export default function BudgetProgress({ 
  budgets, 
  expensesByCategory, 
  currency = 'COP',
  language = 'es'
}: BudgetProgressProps) {
  const [editingBudget, setEditingBudget] = useState<any>(null)
  const [deletingBudget, setDeletingBudget] = useState<any>(null)

  const t = translations[language].budgets
  const displayAmount = (amount: number) => formatCurrency(amount, currency)

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }))

  const barData = budgets.map(b => ({
    category: b.category,
    planeado: b.limit_amount,
    gastado: expensesByCategory[b.category] || 0
  }))

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a']

  return (
    <div className="space-y-10">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">{t.distribution}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => displayAmount(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">{t.vs_real}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }} formatter={(value: number) => displayAmount(value)} />
                <Bar dataKey="planeado" fill="#374151" radius={[4, 4, 0, 0]} opacity={0.2} name={language === 'es' ? 'Planeado' : 'Planned'} />
                <Bar dataKey="gastado" fill="#10b981" radius={[4, 4, 0, 0]} name={language === 'es' ? 'Gastado' : 'Spent'} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Listado de Presupuestos con Acciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const spent = expensesByCategory[budget.category] || 0
          const percent = Math.min((spent / budget.limit_amount) * 100, 100)
          const isOver = spent > budget.limit_amount

          return (
            <div key={budget.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{budget.category}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.limit}</p>
                </div>
                <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingBudget(budget)}
                    className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-emerald-500 rounded-xl transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => setDeletingBudget(budget)}
                    className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{t.spent}</p>
                    <p className={`text-lg font-black ${isOver ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>{displayAmount(spent)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{t.limit}</p>
                    <p className="text-sm font-bold text-gray-500">{displayAmount(budget.limit_amount)}</p>
                  </div>
                </div>

                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
                </div>

                <div className="flex justify-between">
                  <span className={`text-[10px] font-bold uppercase ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isOver ? t.over : `${Math.round(percent)}% ${language === 'es' ? 'utilizado' : 'used'}`}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {t.remaining} {displayAmount(Math.max(budget.limit_amount - spent, 0))}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editingBudget && (
        <EditBudgetModal budget={editingBudget} isOpen={!!editingBudget} onClose={() => setEditingBudget(null)} language={language} />
      )}
      {deletingBudget && (
        <DeleteBudgetModal budget={deletingBudget} isOpen={!!deletingBudget} onClose={() => setDeletingBudget(null)} language={language} />
      )}
    </div>
  )
}
