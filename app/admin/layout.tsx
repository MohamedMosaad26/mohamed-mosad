'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  Mail,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Profile & Bio', href: '/admin/profile', icon: User },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Skills', href: '/admin/skills', icon: Cpu },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Do not wrap login page with the admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch {
      router.push('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
              <span className="flex size-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <span>
                Portfolio <span className="text-primary">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex gap-2 bg-card/50">
              <Link href="/" target="_blank">
                <ExternalLink className="size-3.5" /> View Live Site
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Secondary Navigation Tabs */}
        <div className="border-t border-border/40 bg-card/40">
          <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8 no-scrollbar">
            <nav className="flex space-x-1 py-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
