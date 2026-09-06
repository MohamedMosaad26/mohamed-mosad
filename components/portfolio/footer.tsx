import { Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '@/lib/portfolio-data'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <p className="font-mono text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-4">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground transition-colors hover:text-primary">
            <Github className="size-5" />
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground transition-colors hover:text-primary">
            <Linkedin className="size-5" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="text-muted-foreground transition-colors hover:text-primary">
            <Mail className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
