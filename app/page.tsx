import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Target,
  Trophy,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import AddTransactionModal from '@/components/dashboard/AddTransactionModal'
import { formatCurrency } from '@/lib/utils/currency'
import { translations, Language } from '@/lib/utils/translations'
import TransactionList from '@/components/dashboard/TransactionList'
import Navbar from '@/components/dashboard/Navbar'
import WhatsNewModal from '@/components/dashboard/WhatsNewModal'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // FORZAMOS ESPAÑOL SEGÚN SOLICITUD
  const lang: Language = 'es'
  const t = translations[lang].dashboard

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()
  
  // Transacciones mes actual
  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', firstDayOfMonth)

  // Transacciones mes anterior para comparación
  const { data: prevMonthlyTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', firstDayOfPrevMonth)
    .lte('created_at', lastDayOfPrevMonth)

  const monthlyIncome = monthlyTransactions
    ?.filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + Number(tx.amount), 0) || 0

  const monthlyExpense = monthlyTransactions
    ?.filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + Number(tx.amount), 0) || 0

  const prevMonthlyIncome = prevMonthlyTransactions
    ?.filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + Number(tx.amount), 0) || 0

  // Cálculo de rendimiento (Comparación de ingresos)
  let performancePercent = 0
  if (prevMonthlyIncome > 0) {
    performancePercent = Math.round(((monthlyIncome - prevMonthlyIncome) / prevMonthlyIncome) * 100)
  }

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: topGoal } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('current_saved', { ascending: false })
    .limit(1)
    .maybeSingle()

  const rawBalance = Number(profile?.total_balance || 0)
  const isNegative = rawBalance < 0
  const displayBalance = isNegative ? 0 : rawBalance

  const displayAmount = (amount: number) => formatCurrency(amount, profile?.currency || 'COP')

  return (
    <div className="min-h-screen pb-12 bg-white dark:bg-gray-950 transition-colors">
      <Navbar 
        username={profile?.username || 'Usuario'} 
        language={lang} 
        lastVersionSeen={profile?.last_version_seen} 
        userId={user.id}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-6 mb-10">
          <div 
            id="tour-balance" 
            className={`${isNegative ? 'bg-rose-600 dark:bg-rose-700' : 'bg-emerald-600 dark:bg-emerald-700'} rounded-3xl p-8 text-white shadow-xl transition-colors duration-500 relative overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-widest">{t.balance}</p>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" suppressHydrationWarning>
                    {displayAmount(displayBalance)}
                  </h1>
                </div>
                {performancePercent !== 0 && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md ${performancePercent > 0 ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100'}`} suppressHydrationWarning>
                    {performancePercent > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(performancePercent)}% {lang === 'es' ? 'vs mes anterior' : 'vs prev month'}
                  </div>
                )}
              </div>

              {isNegative && (
                <div className="mt-4 flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 animate-pulse">
                  <AlertCircle size={20} className="text-rose-200" />
                  <p className="text-xs font-bold">
                    {lang === 'es' 
                      ? `Tienes una deuda de ${displayAmount(Math.abs(rawBalance))}` 
                      : `You have a debt of ${displayAmount(Math.abs(rawBalance))}`}
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2" suppressHydrationWarning>
                  <span className="text-sm font-medium uppercase" suppressHydrationWarning>
                    {now.toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <Wallet size={180} className="absolute -right-12 -bottom-12 text-white/10 -rotate-12" />
          </div>

          <div id="tour-add-btn" className="w-full max-w-md mx-auto">
            <AddTransactionModal label={t.add_transaction} language={lang} />
          </div>
        </div>

        <div id="tour-stats" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-500">
                <TrendingUp size={20} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.income}</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500" suppressHydrationWarning>{displayAmount(monthlyIncome)}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-rose-100 dark:bg-rose-500/10 p-2 rounded-lg text-rose-600 dark:text-rose-500">
                <TrendingDown size={20} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t.expense}</p>
            </div>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-500" suppressHydrationWarning>{displayAmount(monthlyExpense)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div id="tour-recent" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight uppercase">{t.recent}</h3>
              <Link href="/transactions" className="text-sm font-bold text-emerald-600 dark:text-emerald-500 hover:underline flex items-center gap-1">
                {t.view_all} <ChevronRight size={16} />
              </Link>
            </div>
            
            {!recentTransactions || recentTransactions.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center text-gray-500">
                <p className="font-medium">{t.no_transactions}</p>
              </div>
            ) : (
              <TransactionList transactions={recentTransactions} currency={profile?.currency} variant="compact" language={lang} />
            )}
          </div>

          <div className="space-y-6">
            <div id="tour-budgets" className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm">{t.budgets}</h4>
                <Link href="/budgets" className="text-emerald-600 dark:text-emerald-500">
                  <Target size={18} />
                </Link>
              </div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${Math.min((monthlyExpense / (monthlyIncome || 1)) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{t.usage}</span>
                <span className="text-[10px] font-bold text-emerald-500">{Math.round((monthlyExpense / (monthlyIncome || 1)) * 100)}%</span>
              </div>
            </div>

            <div id="tour-goals" className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">{t.goals}</h4>
                <Link href="/goals" className="text-emerald-600 dark:text-emerald-500">
                  <Trophy size={18} />
                </Link>
              </div>
              
              {topGoal ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{topGoal.name}</p>
                    <span className="text-[10px] font-black text-emerald-600">{Math.round(((topGoal.current_saved || 0) / topGoal.target_amount) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${Math.min(((topGoal.current_saved || 0) / topGoal.target_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">{t.no_goals}</p>
              )}
              
              <Link href="/goals" className="block w-full text-center mt-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                {t.ver_metas}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
