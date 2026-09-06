'use client'

import { motion } from 'motion/react'
import { BadgeCheck, ExternalLink, Loader } from 'lucide-react'
import type { Certificate } from '@/lib/portfolio-data'
import { Section, SectionHeading } from './section'

export function Certifications({ certificates }: { certificates: Certificate[] }) {
  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Certifications"
        title="Continuous learning"
        description="Credentials and ongoing programs across data science and AI."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => {
          const inProgress = cert.status === 'In Progress'
          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  {inProgress ? <Loader className="size-5" /> : <BadgeCheck className="size-5" />}
                </span>
                <span
                  className={
                    inProgress
                      ? 'rounded-full border border-chart-5/40 bg-chart-5/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-chart-5'
                      : 'rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary'
                  }
                >
                  {cert.status}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-pretty font-semibold leading-snug">{cert.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
                ) : null}
              </div>
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-primary transition-transform hover:translate-x-0.5"
                >
                  View credential <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
