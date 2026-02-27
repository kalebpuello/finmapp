import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Target
} from 'lucide-react'
import BudgetProgress from '@/components/dashboard/BudgetProgress'
import AddBudgetModal from '@/components/dashboard/AddBudgetModal'
import Navbar from '@/components/dashboard/Navbar'
import { translations, Language } from '@/lib/utils/translations'

export default async function BudgetsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener perfil para la moneda y nombre
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, currency, language')
    .eq('id', user.id)
    .single()

  const lang: Language = (profile?.language as Language) || 'es'
  const t = translations[lang].budgets

  // 1. Obtener presupuestos planeados
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)

  // 2. Obtener gastos reales del mes actual
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  
  const { data: monthlyExpenses } = await supabase
    .from('transactions')
    .select('amount, category')
    .eq('user_id', user.id)
    .eq('type', 'expense')
    .gte('created_at', firstDayOfMonth)

  // 3. Agrupar gastos por categoría
  const expensesByCategory = monthlyExpenses?.reduce((acc: { [key: string]: number }, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount)
    return acc
  }, {}) || {}

  return (
    <div className="min-h-screen pb-12 bg-white dark:bg-gray-950 transition-colors">
      <Navbar username={profile?.username || 'Usuario'} showBack title={translations[lang].nav.budgets} language={lang} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-gray-900 dark:text-white">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.subtitle}</p>
          </div>
          <AddBudgetModal language={lang} />
        </div>

        {!budgets || budgets.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-20 text-center flex flex-col items-center">
            <div className="bg-emerald-100 dark:bg-emerald-500/10 p-4 rounded-full mb-4 text-emerald-600">
              <Target size={40} />
            </div>
            <p className="font-bold text-gray-500 dark:text-gray-400">{t.no_budgets}</p>
          </div>
        ) : (
          <BudgetProgress 
            budgets={budgets} 
            expensesByCategory={expensesByCategory} 
            currency={profile?.currency} 
            language={lang}
          />
        )}
      </main>
    </div>
  )
}
