import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  HandCoins
} from 'lucide-react'
import TransactionList from '@/components/dashboard/TransactionList'
import Navbar from '@/components/dashboard/Navbar'
import Link from 'next/link'

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; query?: string }>
}) {
  const supabase = await createClient()
  const { type } = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener perfil para la moneda y nombre
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, currency')
    .eq('id', user.id)
    .single()

  // Construir la query de Supabase
  let dbQuery = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (type) dbQuery = dbQuery.eq('type', type)

  const { data: transactions } = await dbQuery

  return (
    <div className="min-h-screen pb-12 bg-white dark:bg-gray-950 transition-colors">
      <Navbar username={profile?.username || 'Usuario'} showBack title="Historial" />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Link 
              href="/transactions" 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!type ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
            >
              Todos
            </Link>
            <Link 
              href="/transactions?type=income" 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${type === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
            >
              Ingresos
            </Link>
            <Link 
              href="/transactions?type=expense" 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${type === 'expense' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
            >
              Gastos
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {!transactions || transactions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-20 text-center flex flex-col items-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <HandCoins size={40} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="font-bold text-gray-500 dark:text-gray-400">No se encontraron movimientos</p>
            </div>
          ) : (
            <TransactionList transactions={transactions} currency={profile?.currency} variant="full" />
          )}
        </div>
      </main>
    </div>
  )
}
