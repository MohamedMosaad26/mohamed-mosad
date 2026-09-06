'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  Mail,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    certificates: 0,
    unreadMessages: 0,
    totalMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [hasSupabase, setHasSupabase] = useState(false)

  useEffect(() => {
    async function loadStats() {
      try {
        const [projRes, skillRes, expRes, certRes, msgRes] = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/skills'),
          fetch('/api/admin/experience'),
          fetch('/api/admin/certifications'),
          fetch('/api/admin/messages'),
        ])

        const [projs, skills, exps, certs, msgs] = await Promise.all([
          projRes.ok ? projRes.json() : [],
          skillRes.ok ? skillRes.json() : [],
          expRes.ok ? expRes.json() : [],
          certRes.ok ? certRes.json() : [],
          msgRes.ok ? msgRes.json() : [],
        ])

        const totalSkills = Array.isArray(skills)
          ? skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0)
          : 0

        const unreadMsgs = Array.isArray(msgs)
          ? msgs.filter((m: { read: boolean }) => !m.read).length
          : 0

        setStats({
          projects: Array.isArray(projs) ? projs.length : 0,
          skills: totalSkills,
          experiences: Array.isArray(exps) ? exps.length : 0,
          certificates: Array.isArray(certs) ? certs.length : 0,
          unreadMessages: unreadMsgs,
          totalMessages: Array.isArray(msgs) ? msgs.length : 0,
        })

        // Check if NEXT_PUBLIC_SUPABASE_URL is configured
        setHasSupabase(Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL))
      } catch (e) {
        console.error('Failed to load admin stats:', e)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Projects',
      value: stats.projects,
      description: 'Active case studies & portfolio items',
      href: '/admin/projects',
      icon: FolderGit2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/30',
    },
    {
      title: 'Skills & Tech',
      value: stats.skills,
      description: 'Categorized technical capabilities',
      href: '/admin/skills',
      icon: Cpu,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
      border: 'border-chart-2/30',
    },
    {
      title: 'Experience Items',
      value: stats.experiences,
      description: 'Timeline entries & education history',
      href: '/admin/experience',
      icon: Briefcase,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
      border: 'border-chart-3/30',
    },
    {
      title: 'Certifications',
      value: stats.certificates,
      description: 'Verified certificates & courses',
      href: '/admin/certifications',
      icon: Award,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
      border: 'border-chart-4/30',
    },
    {
      title: 'Messages Received',
      value: stats.totalMessages,
      description: `${stats.unreadMessages} unread inquiries`,
      href: '/admin/messages',
      icon: Mail,
      color: 'text-chart-5',
      bg: 'bg-chart-5/10',
      border: 'border-chart-5/30',
      highlight: stats.unreadMessages > 0,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your portfolio command center. Manage content, case studies, and inquiries in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/admin/projects">
              <FolderGit2 className="size-4" /> Manage Projects
            </Link>
          </Button>
        </div>
      </div>

      {/* Supabase Connection Status Banner */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shrink-0">
            <Database className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Supabase Database Integration</h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <CheckCircle2 className="size-3" /> Ready
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Paste the contents of <code className="text-primary">supabase-schema.sql</code> into your Supabase SQL Editor to sync live data.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 shrink-0 bg-secondary/30">
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
            <ExternalLink className="size-3.5" /> Supabase Dashboard
          </a>
        </Button>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href}>
              <Card className="border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:bg-card/90 cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <span className={`flex size-8 items-center justify-center rounded-lg border ${card.border} ${card.bg} ${card.color}`}>
                    <Icon className="size-4" />
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {loading ? (
                      <span className="inline-block h-8 w-12 animate-pulse bg-muted rounded" />
                    ) : (
                      card.value
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                    <span>{card.description}</span>
                    <ArrowRight className="size-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Quick Content Management
            </CardTitle>
            <CardDescription>
              Quickly update your public profile, about section, or skills list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-between bg-card/40">
              <Link href="/admin/profile">
                <span>Edit Profile Info & Social Links</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between bg-card/40">
              <Link href="/admin/skills">
                <span>Manage Skills & Categories</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between bg-card/40">
              <Link href="/admin/experience">
                <span>Edit Education & Work Timeline</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              Recent Inquiries & Contact
            </CardTitle>
            <CardDescription>
              Check messages submitted by recruiters and clients through your contact form.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-between bg-card/40">
              <Link href="/admin/messages">
                <span>View Contact Messages Inbox</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between bg-card/40">
              <Link href="/admin/certifications">
                <span>Manage Certifications & Licenses</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between bg-card/40">
              <Link href="/" target="_blank">
                <span>Preview Public Website</span>
                <ExternalLink className="size-4 text-muted-foreground" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
