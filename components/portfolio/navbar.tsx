'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Download, Github, Linkedin, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { navItems, profile } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="group flex items-center gap-2 font-mono text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
            MM
          </span>
          <span className="hidden text-foreground sm:inline">mohamed.mosad</span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1 backdrop-blur-md lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1)
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-3.5 py-1.5 text-sm transition-colors',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="size-[18px]" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin className="size-[18px]" />
            </a>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden gap-2 sm:inline-flex">
            <a href={profile.cvUrl} target="_blank" rel="noreferrer">
              <Download className="size-4" />
              CV
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm transition-colors',
                    active === item.href.slice(1)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.label}
                </a>
              ))}
              <Button asChild size="sm" className="mt-2 gap-2">
                <a href={profile.cvUrl} target="_blank" rel="noreferrer">
                  <Download className="size-4" />
                  Download CV
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
