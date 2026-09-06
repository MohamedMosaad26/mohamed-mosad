'use client'

import { useEffect, useState } from 'react'
import { Mail, MailOpen, Trash2, Reply, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { ContactMessage } from '@/lib/db/portfolio-service'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: !currentRead }),
      })

      if (!res.ok) throw new Error('Failed to update')

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
      )
      toast.success(!currentRead ? 'Marked as read' : 'Marked as unread')
    } catch {
      toast.error('Could not update message')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    setDeletingId(id)

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Message deleted')
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch {
      toast.error('Could not delete message')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages Inbox</h1>
          <p className="text-muted-foreground mt-1">
            Review incoming inquiries, job opportunities, and messages from your website.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-card/40 p-12 text-center">
          <Mail className="mx-auto size-12 text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-semibold">No Messages in Inbox</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Messages submitted via your contact form will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`border-border/70 transition-colors ${
                msg.read ? 'bg-card/40 opacity-85' : 'bg-card/90 border-primary/40 shadow-sm'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-2 rounded-full ${
                        msg.read ? 'bg-muted-foreground' : 'bg-primary animate-pulse'
                      }`}
                    />
                    <CardTitle className="text-base font-semibold">{msg.name}</CardTitle>
                    <span className="text-xs text-muted-foreground">({msg.email})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {msg.subject && (
                  <CardDescription className="text-xs font-medium text-foreground/90 mt-1">
                    Subject: {msg.subject}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 bg-background/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>

                <div className="flex items-center justify-between border-t border-border/40 mt-4 pt-3">
                  <Button asChild size="sm" className="gap-1.5 h-8 text-xs">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                        msg.subject || 'Your inquiry on Mohamed Mosad Portfolio'
                      )}`}
                    >
                      <Reply className="size-3.5" /> Reply via Email
                    </a>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRead(msg.id, msg.read)}
                      className="gap-1.5 h-8 text-xs"
                    >
                      {msg.read ? (
                        <>
                          <Mail className="size-3.5" /> Mark Unread
                        </>
                      ) : (
                        <>
                          <MailOpen className="size-3.5" /> Mark Read
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
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
