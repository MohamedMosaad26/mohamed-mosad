'use client'

import { motion } from 'motion/react'
import { Award, Briefcase, GraduationCap, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Experience } from '@/lib/portfolio-data'
import { Section, SectionHeading } from './section'

const iconByType: Record<Experience['type'], LucideIcon> = {
  Education: GraduationCap,
  Competition: Trophy,
  Internship: Briefcase,
  Job: Briefcase,
  Training: Award,
  Activity: Award,
}

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <Section id="experience" className="border-y border-border/60 bg-card/20">
      <SectionHeading
        eyebrow="Journey"
        title="Experience & milestones"
        description="Education, competitions, and activities that shaped my path in data and AI."
      />

      <div className="relative ml-3 border-l border-border/70 pl-8 sm:ml-4">
        {experiences.map((exp, i) => {
          const Icon = iconByType[exp.type]
          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pb-10 last:pb-0"
            >
              <span className="absolute -left-[41px] grid size-8 place-items-center rounded-full border border-primary/40 bg-background text-primary sm:-left-[45px]">
                <Icon className="size-4" />
              </span>
              <div className="rounded-xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-primary/40">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <span className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {exp.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary">{exp.organization}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {exp.startDate}
                  {exp.endDate ? ` — ${exp.endDate}` : ''}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
