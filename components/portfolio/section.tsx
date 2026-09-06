'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn('relative scroll-mt-24 py-20 sm:py-28', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('mb-12 flex flex-col gap-3', align === 'center' && 'items-center text-center')}
    >
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary">
        <span className="h-px w-6 bg-primary/60" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </motion.div>
  )
}
