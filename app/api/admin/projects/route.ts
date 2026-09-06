import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getProjects } from '@/lib/db/portfolio-service'

export async function GET() {
  const projects = await getProjects()
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (supabase) {
      const payload = {
        id: body.id || `p-${Date.now().toString(36)}`,
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: body.category,
        description: body.description,
        long_description: body.longDescription || null,
        technologies: body.technologies || [],
        github_url: body.githubUrl || null,
        live_url: body.liveUrl || null,
        image_url: body.imageUrl || null,
        featured: Boolean(body.featured),
        metrics: body.metrics || [],
        highlights: body.highlights || [],
        details: body.details || {},
        display_order: body.displayOrder ?? 0,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from('projects').insert([payload]).select().single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, project: data })
    }

    return NextResponse.json({ success: true, project: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (!body.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    if (supabase) {
      const payload = {
        title: body.title,
        slug: body.slug,
        category: body.category,
        description: body.description,
        long_description: body.longDescription || null,
        technologies: body.technologies || [],
        github_url: body.githubUrl || null,
        live_url: body.liveUrl || null,
        image_url: body.imageUrl || null,
        featured: Boolean(body.featured),
        metrics: body.metrics || [],
        highlights: body.highlights || [],
        details: body.details || {},
        display_order: body.displayOrder ?? 0,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', body.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, project: data })
    }

    return NextResponse.json({ success: true, project: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
