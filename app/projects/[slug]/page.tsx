import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Github, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/portfolio/footer'
import { projects } from '@/lib/portfolio-data'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : undefined,
    },
  }
}

const detailSections: { key: keyof NonNullable<(typeof projects)[number]['details']>; label: string }[] = [
  { key: 'problemStatement', label: 'Problem Statement' },
  { key: 'dataset', label: 'Dataset' },
  { key: 'dataPreprocessing', label: 'Data Preprocessing' },
  { key: 'eda', label: 'Exploratory Data Analysis' },
  { key: 'featureEngineering', label: 'Feature Engineering' },
  { key: 'models', label: 'Models' },
  { key: 'modelComparison', label: 'Model Comparison' },
  { key: 'evaluationMetrics', label: 'Evaluation Metrics' },
  { key: 'results', label: 'Results' },
  { key: 'businessInsights', label: 'Business Insights' },
]

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const availableSections = detailSections.filter((s) => project.details[s.key])

  return (
    <div className="relative min-h-svh">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <Button asChild variant="ghost" size="sm" className="mb-8 gap-2 text-muted-foreground">
          <Link href="/#projects">
            <ArrowLeft className="size-4" /> Back to projects
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 font-mono text-xs text-primary">
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 font-mono text-xs text-primary">
              <Star className="size-3 fill-primary" /> Featured
            </span>
          )}
        </div>

        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {project.longDescription ?? project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.githubUrl && (
            <Button asChild className="gap-2">
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github className="size-4" /> View on GitHub
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" /> Live demo
              </a>
            </Button>
          )}
        </div>

        {project.imageUrl && (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border border-border/70">
            <Image
              src={project.imageUrl || '/placeholder.svg'}
              alt={project.title}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {project.metrics.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border/70 bg-card/60 p-4 text-center">
                <div className="font-mono text-xl font-bold text-primary">{m.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {project.highlights.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Highlights</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 rounded-lg border border-border/60 bg-card/40 p-3 text-sm text-foreground/90">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {availableSections.length > 0 && (
          <div className="mt-10 flex flex-col gap-8">
            {availableSections.map((section) => (
              <section key={section.key}>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <span className="h-4 w-1 rounded bg-primary" aria-hidden="true" />
                  {section.label}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{project.details[section.key]}</p>
              </section>
            ))}
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Technologies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-md border border-border/60 bg-secondary/40 px-3 py-1 font-mono text-sm text-foreground/80">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
