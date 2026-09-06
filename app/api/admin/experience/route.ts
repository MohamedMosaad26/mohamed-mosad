import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getExperiences } from '@/lib/db/portfolio-service'

export async function GET() {
  const experiences = await getExperiences()
  return NextResponse.json(experiences)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (supabase) {
      const payload = {
        id: body.id || `e-${Date.now().toString(36)}`,
        title: body.title,
        organization: body.organization,
        type: body.type,
        location: body.location || null,
        start_date: body.startDate,
        end_date: body.endDate || null,
        description: body.description,
        order_num: body.order ?? 0,
      }

      const { data, error } = await supabase.from('experiences').insert([payload]).select().single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, experience: data })
    }

    return NextResponse.json({ success: true, experience: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save experience'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (!body.id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 })
    }

    if (supabase) {
      const payload = {
        title: body.title,
        organization: body.organization,
        type: body.type,
        location: body.location || null,
        start_date: body.startDate,
        end_date: body.endDate || null,
        description: body.description,
        order_num: body.order ?? 0,
      }

      const { data, error } = await supabase
        .from('experiences')
        .update(payload)
        .eq('id', body.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, experience: data })
    }

    return NextResponse.json({ success: true, experience: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update experience'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete experience'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
