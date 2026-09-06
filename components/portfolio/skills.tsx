'use client'

import { motion } from 'motion/react'
import {
  BarChart3,
  BrainCircuit,
  Code2,
  Layers,
  Network,
  Sigma,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { skillCategories } from '@/lib/portfolio-data'
import { Section, SectionHeading } from './section'

const iconByName: Record<string, LucideIcon> = {
  Programming: Code2,
  'Python Ecosystem': Layers,
  'Machine Learning': BrainCircuit,
  'Deep Learning': Network,
  'Data Science': BarChart3,
  Statistics: Sigma,
  AI: Sparkles,
}

export function Skills() {
  return (
    <Section id="skills" className="border-y border-border/60 bg-card/20">
      <SectionHeading
        eyebrow="Skills"
        title="A full-stack data & ML toolkit"
        description="Grouped by discipline — the tools and methods I use to build reliable models and analyses."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category, i) => {
          const Icon = iconByName[category.name] ?? Code2
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/70 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_-12px_var(--primary)]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-border/60 bg-background/60 px-2.5 py-1 font-mono text-xs text-foreground/80 transition-colors group-hover:border-primary/20"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
