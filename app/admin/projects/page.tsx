'use client'

import { useEffect, useState } from 'react'
import {
  FolderGit2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Loader2,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Project, ProjectCategory } from '@/lib/portfolio-data'

const emptyProject: Omit<Project, 'createdAt' | 'updatedAt'> = {
  id: '',
  title: '',
  slug: '',
  category: 'Machine Learning',
  description: '',
  longDescription: '',
  technologies: ['Python', 'Scikit-learn'],
  githubUrl: '',
  liveUrl: '',
  imageUrl: '/projects/covid-prediction.png',
  featured: false,
  metrics: [
    { label: 'Records', value: '10,000+' },
    { label: 'Accuracy', value: '95%' },
  ],
  highlights: ['Built custom preprocessing pipeline', 'Trained gradient boosting model'],
  details: {
    problemStatement: '',
    dataset: '',
    dataPreprocessing: '',
    eda: '',
    featureEngineering: '',
    models: '',
    modelComparison: '',
    evaluationMetrics: '',
    results: '',
    businessInsights: '',
  },
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | typeof emptyProject | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Temporary inputs for array items
  const [newTech, setNewTech] = useState('')
  const [newHighlight, setNewHighlight] = useState('')
  const [newMetricLabel, setNewMetricLabel] = useState('')
  const [newMetricValue, setNewMetricValue] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingProject({
      ...emptyProject,
      id: `p-${Date.now().toString(36)}`,
      metrics: [],
      highlights: [],
      technologies: [],
      details: {},
    })
    setIsNew(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(JSON.parse(JSON.stringify(project)))
    setIsNew(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    setDeletingId(id)

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Project deleted')
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {
      toast.error('Could not delete project')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save project')
      }

      toast.success(isNew ? 'Project created!' : 'Project updated!')
      setEditingProject(null)
      loadProjects()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving project'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  // Helpers for tags/arrays
  const addTech = () => {
    if (!newTech.trim() || !editingProject) return
    setEditingProject({
      ...editingProject,
      technologies: [...(editingProject.technologies || []), newTech.trim()],
    })
    setNewTech('')
  }

  const removeTech = (index: number) => {
    if (!editingProject) return
    const updated = [...editingProject.technologies]
    updated.splice(index, 1)
    setEditingProject({ ...editingProject, technologies: updated })
  }

  const addHighlight = () => {
    if (!newHighlight.trim() || !editingProject) return
    setEditingProject({
      ...editingProject,
      highlights: [...(editingProject.highlights || []), newHighlight.trim()],
    })
    setNewHighlight('')
  }

  const removeHighlight = (index: number) => {
    if (!editingProject) return
    const updated = [...editingProject.highlights]
    updated.splice(index, 1)
    setEditingProject({ ...editingProject, highlights: updated })
  }

  const addMetric = () => {
    if (!newMetricLabel.trim() || !newMetricValue.trim() || !editingProject) return
    setEditingProject({
      ...editingProject,
      metrics: [
        ...(editingProject.metrics || []),
        { label: newMetricLabel.trim(), value: newMetricValue.trim() },
      ],
    })
    setNewMetricLabel('')
    setNewMetricValue('')
  }

  const removeMetric = (index: number) => {
    if (!editingProject) return
    const updated = [...editingProject.metrics]
    updated.splice(index, 1)
    setEditingProject({ ...editingProject, metrics: updated })
  }

  if (editingProject) {
    return (
      <form onSubmit={handleSaveProject} className="space-y-8 max-w-4xl pb-16">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEditingProject(null)}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" /> Back to projects list
          </Button>

          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isNew ? 'Create Project' : 'Save Changes'}
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? 'Add New Project' : `Edit: ${editingProject.title}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure metadata, media, metrics, and case study documentation.
          </p>
        </div>

        {/* Core Info */}
        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Basic Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={editingProject.title}
                  onChange={(e) => {
                    const title = e.target.value
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    setEditingProject({
                      ...editingProject,
                      title,
                      slug: isNew ? autoSlug : editingProject.slug,
                    })
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug (e.g. /projects/your-slug)</Label>
                <Input
                  id="slug"
                  value={editingProject.slug}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, slug: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      category: e.target.value as ProjectCategory,
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Machine Learning" className="bg-card">Machine Learning</option>
                  <option value="Data Science" className="bg-card">Data Science</option>
                  <option value="Deep Learning" className="bg-card">Deep Learning</option>
                  <option value="AI" className="bg-card">AI</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingProject.featured}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, featured: e.target.checked })
                  }
                  className="size-4 rounded border-border accent-primary cursor-pointer"
                />
                <Label htmlFor="featured" className="cursor-pointer font-medium">
                  Featured Project (Highlighted on Home)
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Summary Description (Card view)</Label>
              <Textarea
                id="description"
                rows={2}
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description (Detail page header)</Label>
              <Textarea
                id="longDescription"
                rows={3}
                value={editingProject.longDescription || ''}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, longDescription: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Media & Links */}
        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Links & Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository Link</Label>
                <Input
                  id="githubUrl"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live Demo / App URL</Label>
                <Input
                  id="liveUrl"
                  value={editingProject.liveUrl || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, liveUrl: e.target.value })
                  }
                  placeholder="https://demo.app"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image Path / URL</Label>
                <Input
                  id="imageUrl"
                  value={editingProject.imageUrl || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, imageUrl: e.target.value })
                  }
                  placeholder="/projects/covid-prediction.png"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technologies & Highlights */}
        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Technologies, Metrics & Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technologies */}
            <div className="space-y-3">
              <Label>Technologies & Libraries</Label>
              <div className="flex flex-wrap gap-2">
                {editingProject.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/60 px-2.5 py-1 text-xs font-mono"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <Input
                  placeholder="Add technology (e.g. XGBoost)"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTech()
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addTech}>
                  Add
                </Button>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <Label>Key Stats & Metrics (e.g. Accuracy: 98%, Records: 50,000+)</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {editingProject.metrics?.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-card/40 p-2.5 text-xs"
                  >
                    <div>
                      <div className="font-bold text-primary">{m.value}</div>
                      <div className="text-muted-foreground">{m.label}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMetric(i)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Label (e.g. Records)"
                  value={newMetricLabel}
                  onChange={(e) => setNewMetricLabel(e.target.value)}
                />
                <Input
                  placeholder="Value (e.g. 50,000+)"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                />
                <Button type="button" variant="secondary" onClick={addMetric}>
                  Add
                </Button>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <Label>Key Bullet Highlights</Label>
              <ul className="space-y-1.5">
                {editingProject.highlights?.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-card/30 px-3 py-1.5 text-xs"
                  >
                    <span>• {h}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(i)}
                      className="text-muted-foreground hover:text-destructive ml-2"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="Add bullet highlight..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addHighlight()
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addHighlight}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Study Details */}
        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Detailed Case Study Sections</CardTitle>
            <CardDescription>
              Optional sections rendered on the project's dedicated page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea
                id="problemStatement"
                rows={2}
                value={editingProject.details?.problemStatement || ''}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    details: { ...editingProject.details, problemStatement: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataset">Dataset Overview</Label>
              <Textarea
                id="dataset"
                rows={2}
                value={editingProject.details?.dataset || ''}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    details: { ...editingProject.details, dataset: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="models">Models & Architecture</Label>
              <Textarea
                id="models"
                rows={2}
                value={editingProject.details?.models || ''}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    details: { ...editingProject.details, models: e.target.value },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Results & Business Impact</Label>
              <Textarea
                id="results"
                rows={2}
                value={editingProject.details?.results || ''}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    details: { ...editingProject.details, results: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isNew ? 'Create Project' : 'Save Project'}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Manager</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, feature, and document your machine learning and data science projects.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2 shrink-0">
          <Plus className="size-4" /> Add New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-card/40 p-12 text-center">
          <FolderGit2 className="mx-auto size-12 text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-semibold">No Projects Found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Add your first machine learning project to show on your portfolio.
          </p>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="size-4" /> Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="border-border/70 bg-card/60 flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-full border border-border/60 bg-secondary/40 px-2.5 py-0.5 font-mono text-[11px] text-primary">
                    {p.category}
                  </span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
                      <Star className="size-3 fill-primary" /> Featured
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-1">{p.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs mt-1.5">
                  {p.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-secondary/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {(p.technologies?.length || 0) > 3 && (
                    <span className="rounded bg-secondary/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      +{(p.technologies?.length || 0) - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                  <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1.5 text-muted-foreground">
                    <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-3" /> View Page
                    </a>
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(p)}
                      className="h-8 px-2.5 text-xs gap-1.5"
                    >
                      <Edit className="size-3" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
