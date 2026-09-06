'use client'

import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import type { Project, ProjectCategory } from '@/lib/portfolio-data'
import { projectCategories } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'
import { ProjectCard } from './project-card'
import { Section, SectionHeading } from './section'

type Filter = ProjectCategory | 'All'

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  )

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="End-to-end machine learning and data science projects. Click any card for the full breakdown."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {projectCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={cn(
              'relative rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
              filter === category
                ? 'border-primary/50 text-primary-foreground'
                : 'border-border/70 text-muted-foreground hover:text-foreground',
            )}
          >
            {filter === category && (
              <motion.span
                layoutId="project-filter"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </div>

      <LayoutGroup>
        <motion.div layout className="grid gap-6 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="py-12 text-center font-mono text-sm text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </Section>
  )
}
