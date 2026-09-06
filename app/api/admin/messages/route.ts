import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMessages } from '@/lib/db/portfolio-service'

export async function GET() {
  const messages = await getMessages()
  return NextResponse.json(messages)
}

export async function PATCH(req: Request) {
  try {
    const { id, read } = await req.json()
    const supabase = await createServerSupabaseClient()

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    if (supabase) {
      const { error } = await supabase.from('messages').update({ read }).eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, id, read })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update message'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.from('messages').delete().eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete message'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
