'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { ArrowRight, Github, Linkedin, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profile as defaultProfile, type Profile } from '@/lib/portfolio-data'
import { NeuralBackground } from './neural-background'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero({ profile = defaultProfile }: { profile?: Profile }) {
  return (
    <section id="home" className="relative flex min-h-svh items-center overflow-hidden pt-16">
      <NeuralBackground className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-mask bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
          <motion.span
            variants={item}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary"
          >
            <Sparkles className="size-3.5" />
            Available for ML & Data Science roles
          </motion.span>

          <motion.h1 variants={item} className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Hi, I&apos;m <span className="text-primary text-glow">{profile.name}</span>
          </motion.h1>

          <motion.p variants={item} className="text-pretty text-xl font-medium text-foreground/90 sm:text-2xl">
            {profile.title}
          </motion.p>

          <motion.p variants={item} className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {profile.bio}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="group gap-2">
              <a href="#projects">
                View My Projects
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
              <a href="#contact">Let&apos;s Connect</a>
            </Button>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-5 pt-2 text-sm text-muted-foreground">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Github className="size-4" /> GitHub
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" /> {profile.location}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          <div className="group relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-chart-3/20 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative overflow-hidden rounded-[1.75rem] border border-primary/25 bg-card p-1.5 shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <Image
                  src={profile.imageUrl || '/placeholder.svg'}
                  alt="Mohamed Mosad Mohamed"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>
            </motion.div>

            <div className="absolute -bottom-4 -left-4 rounded-xl border border-border/70 bg-card/90 px-4 py-2.5 font-mono text-xs shadow-lg backdrop-blur">
              <div className="text-primary">{'>'} model.predict()</div>
              <div className="text-muted-foreground">GPA {profile.education.gpa}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
