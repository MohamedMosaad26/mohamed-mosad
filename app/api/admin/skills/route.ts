import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSkillCategories } from '@/lib/db/portfolio-service'

export async function GET() {
  const skills = await getSkillCategories()
  return NextResponse.json(skills)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (supabase) {
      const payload = {
        id: body.id || `sc-${Date.now().toString(36)}`,
        name: body.name,
        skills: body.skills || [],
        order_num: body.order ?? 0,
      }

      const { data, error } = await supabase.from('skill_categories').insert([payload]).select().single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, category: data })
    }

    return NextResponse.json({ success: true, category: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save skill category'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    if (supabase) {
      const payload = {
        name: body.name,
        skills: body.skills || [],
        order_num: body.order ?? 0,
      }

      const { data, error } = await supabase
        .from('skill_categories')
        .update(payload)
        .eq('id', body.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, category: data })
    }

    return NextResponse.json({ success: true, category: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update skill category'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.from('skill_categories').delete().eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete skill category'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
