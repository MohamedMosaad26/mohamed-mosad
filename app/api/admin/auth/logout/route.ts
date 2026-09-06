import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      await supabase.auth.signOut()
    }

    const cookieStore = await cookies()
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Logout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
