'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, User, GraduationCap, Link2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Profile } from '@/lib/portfolio-data'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/admin/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating profile'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile & Personal Details</h1>
          <p className="text-muted-foreground mt-1">
            Update your personal brand, bio, education, and social links across the site.
          </p>
        </div>
        <Button type="submit" disabled={saving} className="gap-2 shrink-0">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Basic Info */}
      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="size-4 text-primary" />
            General Information
          </CardTitle>
          <CardDescription>Your name, primary title, and short bio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Profile Photo Path or URL</Label>
            <Input
              id="imageUrl"
              value={profile.imageUrl}
              onChange={(e) => setProfile({ ...profile, imageUrl: e.target.value })}
              placeholder="/mohamed-profile.jpeg or https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Short Hero Bio</Label>
            <Textarea
              id="bio"
              rows={2}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longBio">About Section In-Depth Bio</Label>
            <Textarea
              id="longBio"
              rows={4}
              value={profile.longBio}
              onChange={(e) => setProfile({ ...profile, longBio: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Education Info */}
      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            Education & University Details
          </CardTitle>
          <CardDescription>Academic degree, current status, and GPA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree Program</Label>
              <Input
                id="degree"
                value={profile.education.degree}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, degree: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">University / Institution</Label>
              <Input
                id="school"
                value={profile.education.school}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, school: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="field">Major / Field</Label>
              <Input
                id="field"
                value={profile.education.field}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, field: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Current Year / Status</Label>
              <Input
                id="year"
                value={profile.education.year}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, year: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                value={profile.education.gpa}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, gpa: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social & Resume Links */}
      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="size-4 text-primary" />
            Social & Resume Links
          </CardTitle>
          <CardDescription>Links shown in hero and contact sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Profile URL</Label>
              <Input
                id="githubUrl"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
              <Input
                id="linkedinUrl"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvUrl">CV / Resume Download Link</Label>
              <Input
                id="cvUrl"
                value={profile.cvUrl}
                onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  )
}
