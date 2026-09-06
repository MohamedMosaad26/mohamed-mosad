'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Github, Star } from 'lucide-react'
import type { Project } from '@/lib/portfolio-data'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/70 transition-colors hover:border-primary/40"
    >
      <Link href={`/projects/${project.slug}`} className="relative block aspect-video overflow-hidden">
        <Image
          src={project.imageUrl || '/placeholder.svg'}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-mono text-[11px] text-primary backdrop-blur">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 font-mono text-[11px] text-primary backdrop-blur">
            <Star className="size-3 fill-primary" /> Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold leading-snug">
            <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-primary">
              {project.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>

        {project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-border/60 bg-background/40 p-2 text-center">
                <div className="font-mono text-sm font-semibold text-primary">{m.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="rounded border border-border/50 bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-foreground/70">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform hover:translate-x-0.5"
          >
            View details <ArrowUpRight className="size-4" />
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4" /> GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
