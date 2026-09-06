import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        return NextResponse.json({
          authenticated: true,
          user: { id: user.id, email: user.email },
        })
      }
    }

    if (sessionCookie?.value === 'authenticated') {
      return NextResponse.json({
        authenticated: true,
        user: { email: 'mm6408682@gmail.com' },
      })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
