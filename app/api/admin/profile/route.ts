import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/db/portfolio-service'

export async function GET() {
  const profile = await getProfile()
  return NextResponse.json(profile)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = await createServerSupabaseClient()

    if (supabase) {
      // Check if a profile record exists
      const { data: existing } = await supabase.from('profile_info').select('id').limit(1).maybeSingle()

      const payload = {
        name: body.name,
        title: body.title,
        bio: body.bio,
        long_bio: body.longBio,
        location: body.location,
        email: body.email,
        github_url: body.githubUrl,
        linkedin_url: body.linkedinUrl,
        cv_url: body.cvUrl,
        image_url: body.imageUrl,
        education_degree: body.education?.degree,
        education_field: body.education?.field,
        education_school: body.education?.school,
        education_year: body.education?.year,
        education_gpa: body.education?.gpa,
        updated_at: new Date().toISOString(),
      }

      let res
      if (existing?.id) {
        res = await supabase.from('profile_info').update(payload).eq('id', existing.id)
      } else {
        res = await supabase.from('profile_info').insert([payload])
      }

      if (res.error) {
        return NextResponse.json({ error: res.error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, profile: body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
