'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, X, Cpu, Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { SkillCategory } from '@/lib/portfolio-data'

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newSkillTag, setNewSkillTag] = useState('')

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/skills')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      toast.error('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingCategory({
      id: `sc-${Date.now().toString(36)}`,
      name: '',
      skills: [],
      order: categories.length + 1,
    })
    setIsNew(true)
  }

  const handleEdit = (category: SkillCategory) => {
    setEditingCategory(JSON.parse(JSON.stringify(category)))
    setIsNew(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Skill category deleted')
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch {
      toast.error('Could not delete skill category')
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      })

      if (!res.ok) throw new Error('Failed to save category')

      toast.success(isNew ? 'Category created!' : 'Category updated!')
      setEditingCategory(null)
      loadSkills()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving category'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const addSkillTag = () => {
    if (!newSkillTag.trim() || !editingCategory) return
    setEditingCategory({
      ...editingCategory,
      skills: [...(editingCategory.skills || []), newSkillTag.trim()],
    })
    setNewSkillTag('')
  }

  const removeSkillTag = (index: number) => {
    if (!editingCategory) return
    const updated = [...editingCategory.skills]
    updated.splice(index, 1)
    setEditingCategory({ ...editingCategory, skills: updated })
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills & Tech Stack Manager</h1>
          <p className="text-muted-foreground mt-1">
            Group your technical expertise by discipline and manage skill badges.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2 shrink-0">
          <Plus className="size-4" /> Add New Category
        </Button>
      </div>

      {/* Editor Modal / Inline card */}
      {editingCategory && (
        <Card className="border-primary/40 bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{isNew ? 'New Skill Category' : `Edit Category: ${editingCategory.name}`}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingCategory(null)}
                className="size-8 p-0"
              >
                <X className="size-4" />
              </Button>
            </CardTitle>
            <CardDescription>Specify the category name and associated skill tags.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="catName">Category Name</Label>
                  <Input
                    id="catName"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    placeholder="e.g. Deep Learning, AI Agents"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catOrder">Display Order</Label>
                  <Input
                    id="catOrder"
                    type="number"
                    value={editingCategory.order}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills in this Category</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg border border-border/70 bg-background/50">
                  {editingCategory.skills?.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/60 px-2.5 py-1 text-xs font-mono"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkillTag(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  {(!editingCategory.skills || editingCategory.skills.length === 0) && (
                    <span className="text-xs text-muted-foreground self-center">No skills added yet</span>
                  )}
                </div>
                <div className="flex gap-2 max-w-md pt-1">
                  <Input
                    placeholder="Add skill (e.g. PyTorch)"
                    value={newSkillTag}
                    onChange={(e) => setNewSkillTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkillTag()
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addSkillTag}>
                    Add Tag
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {isNew ? 'Create Category' : 'Save Changes'}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border-border/70 bg-card/60 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                      <Cpu className="size-3.5" />
                    </span>
                    <CardTitle className="text-base font-semibold">{category.name}</CardTitle>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                    Order: {category.order}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-1.5 min-h-[50px] mb-4">
                  {category.skills?.map((skill) => (
                    <li
                      key={skill}
                      className="rounded border border-border/60 bg-background/50 px-2 py-0.5 font-mono text-xs text-foreground/80"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-end gap-1.5 border-t border-border/40 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="h-8 px-2.5 text-xs gap-1.5"
                  >
                    <Edit className="size-3" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id, category.name)}
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
