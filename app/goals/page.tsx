import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Trophy
} from 'lucide-react'
import GoalList from '@/components/dashboard/GoalList'
import AddGoalModal from '@/components/dashboard/AddGoalModal'
import Navbar from '@/components/dashboard/Navbar'
import { translations, Language } from '@/lib/utils/translations'

export const dynamic = 'force-dynamic'

export default async function GoalsPage() {
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
  const t = translations[lang].goals

  // Obtener metas de ahorro
  const { data: goals, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching goals:', error)
  }

  return (
    <div className="min-h-screen pb-12 bg-white dark:bg-gray-950 transition-colors">
      <Navbar username={profile?.username || 'Usuario'} showBack title={translations[lang].nav.goals} language={lang} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-gray-900 dark:text-white">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              {t.subtitle}
            </p>
          </div>
          <AddGoalModal language={lang} />
        </div>

        {!goals || goals.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem] p-24 text-center flex flex-col items-center">
            <div className="bg-emerald-100 dark:bg-emerald-500/10 p-5 rounded-full mb-6 text-emerald-600">
              <Trophy size={48} />
            </div>
            <p className="font-black text-xl text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{t.no_goals}</p>
          </div>
        ) : (
          <GoalList goals={goals} currency={profile?.currency} language={lang} />
        )}
      </main>
    </div>
  )
}
