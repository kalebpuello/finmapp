'use client'

import { useState } from 'react'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  Pencil,
  Trash2,
  ChevronDown
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { translations, Language } from '@/lib/utils/translations'
import EditTransactionModal from './EditTransactionModal'
import DeleteTransactionModal from './DeleteTransactionModal'

interface TransactionListProps {
  transactions: any[]
  currency?: string
  variant?: 'full' | 'compact'
  language?: Language
}

export default function TransactionList({ 
  transactions, 
  currency = 'COP', 
  variant = 'full',
  language = 'es' 
}: TransactionListProps) {
  const [editingTx, setEditingTx] = useState<any>(null)
  const [deletingTx, setDeletingTx] = useState<any>(null)
  const [expandedId, setExpandedTx] = useState<string | null>(null)

  const t = translations[language].modals
  const catNames = translations[language].categories
  const displayAmount = (amount: number) => formatCurrency(amount, currency)

  // Función para traducir la categoría guardada (el slug) al nombre legible
  const translateCategory = (slug: string) => {
    return (catNames as any)[slug] || slug
  }

  const toggleExpand = (id: string) => {
    setExpandedTx(expandedId === id ? null : id)
  }

  // --- VERSION PARA EL DASHBOARD (COMPACTA) ---
  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                tx.type === 'income' 
                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' 
                : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500'
              }`}>
                {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors truncate">
                  {tx.description || translateCategory(tx.category)}
                </p>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {translateCategory(tx.category)} • {new Date(tx.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                </p>
              </div>
            </div>
            <p className={`font-black text-sm sm:text-lg flex-shrink-0 ml-4 ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
              {tx.type === 'income' ? '+' : '-'}{displayAmount(tx.amount)}
            </p>
          </div>
        ))}
      </div>
    )
  }

  // --- VERSION PARA EL HISTORIAL COMPLETO ---
  return (
    <div className="w-full">
      {/* VISTA MÓVIL (Lista expandible) */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const isExpanded = expandedId === tx.id
          return (
            <div key={tx.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleExpand(tx.id)}
                className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800/50"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <p className={`font-black text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{displayAmount(tx.amount)}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(tx.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              <div className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-2 border-t border-gray-50 dark:border-gray-800 space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{language === 'es' ? 'Descripción y Categoría' : 'Description & Category'}</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {tx.description || (language === 'es' ? 'Sin nota' : 'No note')} <span className="text-emerald-500 ml-1">• {translateCategory(tx.category)}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditingTx(tx)} className="flex-1 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-xl text-xs font-black uppercase">{language === 'es' ? 'Editar' : 'Edit'}</button>
                    <button onClick={() => setDeletingTx(tx)} className="flex-1 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 rounded-xl text-xs font-black uppercase">{language === 'es' ? 'Borrar' : 'Delete'}</button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* VISTA DESKTOP */}
      <div className="hidden md:block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">{language === 'es' ? 'Fecha' : 'Date'}</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">{language === 'es' ? 'Descripción' : 'Description'}</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">{t.category}</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">{t.amount}</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">{language === 'es' ? 'Acciones' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {new Date(tx.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        tx.type === 'income' 
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' 
                        : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                        {tx.description || (language === 'es' ? 'Sin descripción' : 'No description')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {translateCategory(tx.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-black tracking-tight ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{displayAmount(tx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingTx(tx)}
                        className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => setDeletingTx(tx)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTx && <EditTransactionModal transaction={editingTx} isOpen={!!editingTx} onClose={() => setEditingTx(null)} language={language} />}
      {deletingTx && <DeleteTransactionModal transaction={deletingTx} isOpen={!!deletingTx} onClose={() => setDeletingTx(null)} language={language} />}
    </div>
  )
}
