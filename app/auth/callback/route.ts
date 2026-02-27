import { NextResponse } from 'next/server'
// The client you created in Step 2
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const productionUrl = 'https://finmapp.vercel.app'
      const baseUrl = isLocalEnv ? origin : productionUrl
      
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  const isLocalEnv = process.env.NODE_ENV === 'development'
  const productionUrl = 'https://finmapp.vercel.app'
  const baseUrl = isLocalEnv ? origin : productionUrl
  return NextResponse.redirect(`${baseUrl}/login?error=Could not authenticate user`)
}
