'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, X, Briefcase, Loader2, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Experience } from '@/lib/portfolio-data'

const emptyExperience: Experience = {
  id: '',
  title: '',
  organization: '',
  type: 'Education',
  location: '',
  startDate: '',
  endDate: null,
  description: '',
  order: 1,
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadExperiences()
  }, [])

  async function loadExperiences() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/experience')
      if (res.ok) {
        const data = await res.json()
        setExperiences(data)
      }
    } catch {
      toast.error('Failed to load experience items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingExp({
      ...emptyExperience,
      id: `e-${Date.now().toString(36)}`,
      order: experiences.length + 1,
    })
    setIsNew(true)
  }

  const handleEdit = (item: Experience) => {
    setEditingExp(JSON.parse(JSON.stringify(item)))
    setIsNew(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Experience item deleted')
      setExperiences((prev) => prev.filter((e) => e.id !== id))
    } catch {
      toast.error('Could not delete experience item')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExp) return
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingExp),
      })

      if (!res.ok) throw new Error('Failed to save experience')

      toast.success(isNew ? 'Experience item created!' : 'Experience item updated!')
      setEditingExp(null)
      loadExperiences()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving experience'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience & Timeline Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage your career history, education milestones, hackathons, and activities.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2 shrink-0">
          <Plus className="size-4" /> Add Timeline Item
        </Button>
      </div>

      {editingExp && (
        <Card className="border-primary/40 bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{isNew ? 'New Timeline Entry' : `Edit: ${editingExp.title}`}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingExp(null)}
                className="size-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Role / Degree Title</Label>
                  <Input
                    id="title"
                    value={editingExp.title}
                    onChange={(e) => setEditingExp({ ...editingExp, title: e.target.value })}
                    placeholder="e.g. B.Sc. Information Systems"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org">Organization / Institution</Label>
                  <Input
                    id="org"
                    value={editingExp.organization}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, organization: e.target.value })
                    }
                    placeholder="e.g. Port Said University / ICPC"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Entry Type</Label>
                  <select
                    id="type"
                    value={editingExp.type}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        type: e.target.value as Experience['type'],
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Education" className="bg-card">Education</option>
                    <option value="Competition" className="bg-card">Competition</option>
                    <option value="Internship" className="bg-card">Internship</option>
                    <option value="Job" className="bg-card">Job</option>
                    <option value="Activity" className="bg-card">Activity</option>
                    <option value="Training" className="bg-card">Training</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingExp.location || ''}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, location: e.target.value })
                    }
                    placeholder="e.g. Port Said, Egypt"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingExp.order}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date / Level</Label>
                  <Input
                    id="startDate"
                    value={editingExp.startDate}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, startDate: e.target.value })
                    }
                    placeholder="e.g. 3rd Year / 2023"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (optional)</Label>
                  <Input
                    id="endDate"
                    value={editingExp.endDate || ''}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, endDate: e.target.value || null })
                    }
                    placeholder="e.g. Present / 2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description & Key Contributions</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={editingExp.description}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setEditingExp(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {isNew ? 'Create Entry' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {experiences.map((exp) => (
            <Card key={exp.id} className="border-border/70 bg-card/60 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary font-medium">
                    {exp.type}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="size-3" /> {exp.startDate}
                    {exp.endDate ? ` - ${exp.endDate}` : ''}
                  </span>
                </div>
                <CardTitle className="text-base font-semibold">{exp.title}</CardTitle>
                <CardDescription className="text-xs font-medium text-foreground/80">
                  {exp.organization} {exp.location ? `· ${exp.location}` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-4">
                  {exp.description}
                </p>

                <div className="flex items-center justify-end gap-1.5 border-t border-border/40 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(exp)}
                    className="h-8 px-2.5 text-xs gap-1.5"
                  >
                    <Edit className="size-3" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exp.id, exp.title)}
                    className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
