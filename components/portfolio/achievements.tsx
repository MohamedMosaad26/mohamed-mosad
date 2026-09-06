'use client'

import { motion } from 'motion/react'
import { Code2, Trophy } from 'lucide-react'
import { Section } from './section'

export function Achievements() {
  return (
    <Section id="achievements" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-8 sm:p-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_5%,transparent)_1px,transparent_1px)] bg-[size:32px_32px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Trophy className="size-8" />
          </span>
          <div className="flex-1">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Achievement</span>
            <h2 className="mt-2 text-balance text-2xl font-bold sm:text-3xl">
              Egyptian Collegiate Programming Contest (ECPC)
            </h2>
            <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Participated in the ECPC, sharpening algorithmic problem-solving, data structures, and
              teamwork under competitive time pressure — the same rigor I bring to building and
              debugging ML systems.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 font-mono text-xs text-foreground/80">
              <Code2 className="size-3.5 text-primary" /> Competitive Programming
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
