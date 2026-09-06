import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCertificates } from '@/lib/db/portfolio-service'

export async function GET() {
  const certificates = await getCertificates()
  return NextResponse.json(certificates)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (supabase) {
      const payload = {
        id: body.id || `c-${Date.now().toString(36)}`,
        name: body.name,
        issuer: body.issuer,
        date: body.date || null,
        status: body.status || 'Completed',
        url: body.url || null,
        image_url: body.imageUrl || null,
        description: body.description || null,
        order_num: body.order ?? 0,
      }

      const { data, error } = await supabase.from('certifications').insert([payload]).select().single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, certificate: data })
    }

    return NextResponse.json({ success: true, certificate: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save certificate'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (!body.id) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 })
    }

    if (supabase) {
      const payload = {
        name: body.name,
        issuer: body.issuer,
        date: body.date || null,
        status: body.status || 'Completed',
        url: body.url || null,
        image_url: body.imageUrl || null,
        description: body.description || null,
        order_num: body.order ?? 0,
      }

      const { data, error } = await supabase
        .from('certifications')
        .update(payload)
        .eq('id', body.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, certificate: data })
    }

    return NextResponse.json({ success: true, certificate: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update certificate'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.from('certifications').delete().eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete certificate'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
