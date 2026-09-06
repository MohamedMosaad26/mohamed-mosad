import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    if (supabase) {
      // Authenticate against Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
      }

      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({
        success: true,
        user: { id: data.user.id, email: data.user.email },
      })
    } else {
      // Fallback dev login if Supabase credentials are not yet configured in .env.local
      // Allows testing the admin UI immediately
      const defaultEmail = process.env.ADMIN_EMAIL || 'mm6408682@gmail.com'
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123456'

      if (email === defaultEmail && password === defaultPassword) {
        const cookieStore = await cookies()
        cookieStore.set('admin_session', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        return NextResponse.json({
          success: true,
          user: { email, fallback: true },
        })
      } else {
        return NextResponse.json(
          { error: 'Invalid credentials. Please verify your email and password.' },
          { status: 401 }
        )
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
