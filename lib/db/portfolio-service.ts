import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  profile as fallbackProfile,
  projects as fallbackProjects,
  skillCategories as fallbackSkillCategories,
  experiences as fallbackExperiences,
  certificates as fallbackCertificates,
  type Profile,
  type Project,
  type SkillCategory,
  type Experience,
  type Certificate,
} from '@/lib/portfolio-data'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  organization: string | null
  date: string | null
  description: string
  order: number
}

// -----------------------------------------------------------------------------
// GETTERS (with graceful fallback to static data)
// -----------------------------------------------------------------------------

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return fallbackProfile

    const { data, error } = await supabase
      .from('profile_info')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error || !data) return fallbackProfile

    return {
      name: data.name ?? fallbackProfile.name,
      title: data.title ?? fallbackProfile.title,
      bio: data.bio ?? fallbackProfile.bio,
      longBio: data.long_bio ?? fallbackProfile.longBio,
      location: data.location ?? fallbackProfile.location,
      email: data.email ?? fallbackProfile.email,
      githubUrl: data.github_url ?? fallbackProfile.githubUrl,
      linkedinUrl: data.linkedin_url ?? fallbackProfile.linkedinUrl,
      cvUrl: data.cv_url ?? fallbackProfile.cvUrl,
      imageUrl: data.image_url ?? fallbackProfile.imageUrl,
      education: {
        degree: data.education_degree ?? fallbackProfile.education.degree,
        field: data.education_field ?? fallbackProfile.education.field,
        school: data.education_school ?? fallbackProfile.education.school,
        year: data.education_year ?? fallbackProfile.education.year,
        gpa: data.education_gpa ?? fallbackProfile.education.gpa,
      },
    }
  } catch {
    return fallbackProfile
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return fallbackProjects

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return fallbackProjects

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      longDescription: item.long_description,
      category: item.category,
      technologies: item.technologies || [],
      githubUrl: item.github_url,
      liveUrl: item.live_url,
      imageUrl: item.image_url,
      featured: Boolean(item.featured),
      metrics: item.metrics || [],
      highlights: item.highlights || [],
      details: item.details || {},
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))
  } catch {
    return fallbackProjects
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projects = await getProjects()
    return projects.find((p) => p.slug === slug) || null
  } catch {
    return fallbackProjects.find((p) => p.slug === slug) || null
  }
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return fallbackSkillCategories

    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('order_num', { ascending: true })

    if (error || !data || data.length === 0) return fallbackSkillCategories

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      skills: item.skills || [],
      order: item.order_num ?? 0,
    }))
  } catch {
    return fallbackSkillCategories
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return fallbackExperiences

    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_num', { ascending: true })

    if (error || !data || data.length === 0) return fallbackExperiences

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      type: item.type as Experience['type'],
      location: item.location,
      startDate: item.start_date,
      endDate: item.end_date,
      description: item.description,
      order: item.order_num ?? 0,
    }))
  } catch {
    return fallbackExperiences
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return fallbackCertificates

    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('order_num', { ascending: true })

    if (error || !data || data.length === 0) return fallbackCertificates

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      issuer: item.issuer,
      date: item.date,
      status: (item.status as Certificate['status']) || 'Completed',
      url: item.url,
      imageUrl: item.image_url,
      description: item.description,
    }))
  } catch {
    return fallbackCertificates
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order_num', { ascending: true })

    if (error || !data) return []

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      date: item.date,
      description: item.description,
      order: item.order_num ?? 0,
    }))
  } catch {
    return []
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      read: Boolean(item.read),
      createdAt: item.created_at,
    }))
  } catch {
    return []
  }
}
