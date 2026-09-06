'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, X, Award, ExternalLink, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Certificate } from '@/lib/portfolio-data'

const emptyCertificate: Certificate = {
  id: '',
  name: '',
  issuer: '',
  date: null,
  status: 'Completed',
  url: null,
  imageUrl: null,
  description: null,
}

export default function AdminCertificationsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCertificates()
  }, [])

  async function loadCertificates() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/certifications')
      if (res.ok) {
        const data = await res.json()
        setCertificates(data)
      }
    } catch {
      toast.error('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingCert({
      ...emptyCertificate,
      id: `c-${Date.now().toString(36)}`,
    })
    setIsNew(true)
  }

  const handleEdit = (item: Certificate) => {
    setEditingCert(JSON.parse(JSON.stringify(item)))
    setIsNew(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certificate "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/certifications?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Certificate deleted')
      setCertificates((prev) => prev.filter((c) => c.id !== id))
    } catch {
      toast.error('Could not delete certificate')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCert) return
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/certifications', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCert),
      })

      if (!res.ok) throw new Error('Failed to save certificate')

      toast.success(isNew ? 'Certificate created!' : 'Certificate updated!')
      setEditingCert(null)
      loadCertificates()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving certificate'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certifications & Licenses</h1>
          <p className="text-muted-foreground mt-1">
            Display your professional credentials, accredited courses, and verified badges.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2 shrink-0">
          <Plus className="size-4" /> Add Certificate
        </Button>
      </div>

      {editingCert && (
        <Card className="border-primary/40 bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{isNew ? 'New Certificate' : `Edit: ${editingCert.name}`}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingCert(null)}
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
                  <Label htmlFor="name">Certificate / Course Title</Label>
                  <Input
                    id="name"
                    value={editingCert.name}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    placeholder="e.g. Google AI Professional Certificate"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization</Label>
                  <Input
                    id="issuer"
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="e.g. Google / Coursera, IBM"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={editingCert.status}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        status: e.target.value as Certificate['status'],
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Completed" className="bg-card">Completed</option>
                    <option value="In Progress" className="bg-card">In Progress</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Issue Date (optional)</Label>
                  <Input
                    id="date"
                    value={editingCert.date || ''}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, date: e.target.value || null })
                    }
                    placeholder="e.g. Nov 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Verification / Credential URL</Label>
                  <Input
                    id="url"
                    value={editingCert.url || ''}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, url: e.target.value || null })
                    }
                    placeholder="https://coursera.org/verify/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Short Description (optional)</Label>
                <Textarea
                  id="desc"
                  rows={2}
                  value={editingCert.description || ''}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, description: e.target.value || null })
                  }
                  placeholder="Key skills learned or honors received..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setEditingCert(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {isNew ? 'Create Certificate' : 'Save Changes'}
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
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-border/70 bg-card/60 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                      cert.status === 'Completed'
                        ? 'border border-primary/30 bg-primary/10 text-primary'
                        : 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {cert.status === 'Completed' ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <Clock className="size-3" />
                    )}
                    {cert.status}
                  </span>
                  {cert.date && (
                    <span className="text-[11px] text-muted-foreground">{cert.date}</span>
                  )}
                </div>
                <CardTitle className="text-base font-semibold leading-snug">{cert.name}</CardTitle>
                <CardDescription className="text-xs mt-1 text-foreground/80">
                  {cert.issuer}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {cert.url && (
                  <Button asChild variant="ghost" size="sm" className="h-7 px-0 text-xs gap-1 text-primary hover:bg-transparent mb-3">
                    <a href={cert.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-3" /> Verify Credential
                    </a>
                  </Button>
                )}

                <div className="flex items-center justify-end gap-1.5 border-t border-border/40 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(cert)}
                    className="h-8 px-2.5 text-xs gap-1.5"
                  >
                    <Edit className="size-3" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cert.id, cert.name)}
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
