'use client'

import { motion } from 'motion/react'
import { Brain, Database, GraduationCap, LineChart } from 'lucide-react'
import { profile as defaultProfile, type Profile } from '@/lib/portfolio-data'
import { Section, SectionHeading } from './section'

const focusAreas = [
  'Machine Learning',
  'Data Science',
  'Python',
  'SQL',
  'Deep Learning',
  'Data Analysis',
  'Agentic AI',
  'Generative AI',
]

const cards = [
  { icon: Brain, title: 'Machine Learning', text: 'End-to-end pipelines, from data to trained, evaluated models.' },
  { icon: LineChart, title: 'Data Science', text: 'Exploratory analysis and feature engineering that surface insight.' },
  { icon: Database, title: 'Data Engineering', text: 'Cleaning, preprocessing, and transformation of real-world data.' },
  { icon: GraduationCap, title: 'Foundations', text: 'Strong statistics and math underpinning every model decision.' },
]

export function About({ profile = defaultProfile }: { profile?: Profile }) {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About"
        title="Turning data into intelligent decisions"
        description="A snapshot of how I work and where I focus."
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <p className="text-pretty text-lg leading-relaxed text-foreground/90">{profile.longBio}</p>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
              <GraduationCap className="size-4" /> Education
            </div>
            <p className="mt-3 font-medium">{profile.education.degree}</p>
            <p className="text-sm text-muted-foreground">
              {profile.education.school} · {profile.education.field}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.education.year} · GPA {profile.education.gpa}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-border/70 bg-secondary/50 px-3 py-1 font-mono text-xs text-foreground/80"
              >
                {area}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group rounded-xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-primary/40"
            >
              <card.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
