'use client'

import { motion } from 'motion/react'
import { Github, Linkedin, Mail, MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { profile } from '@/lib/portfolio-data'
import { Section, SectionHeading } from './section'

export function Contact() {
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Request failed')
      toast.success('Message sent — thank you! I\'ll get back to you soon.')
      form.reset()
    } catch {
      toast.error('Something went wrong. Please email me directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const links = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Github, label: 'GitHub', value: 'MohamedMosaad26', href: profile.githubUrl },
    { icon: Linkedin, label: 'LinkedIn', value: 'Mohamed Mosad Mohamed', href: profile.linkedinUrl },
    { icon: MapPin, label: 'Location', value: profile.location, href: null },
  ]

  return (
    <Section id="contact" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something intelligent"
        description="Open to ML / Data Science roles, collaborations, and interesting problems. Reach out and I'll respond promptly."
        align="center"
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          {links.map((link) => {
            const content = (
              <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-primary/40">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <link.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{link.label}</p>
                  <p className="truncate text-sm text-foreground/90">{link.value}</p>
                </div>
              </div>
            )
            return link.href ? (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="block">
                {content}
              </a>
            ) : (
              <div key={link.label}>{content}</div>
            )
          })}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card/60 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Your name" autoComplete="name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required rows={6} placeholder="Tell me about your project or role..." />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="group gap-2">
            {submitting ? 'Sending...' : 'Send message'}
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </motion.form>
      </div>
    </Section>
  )
}
