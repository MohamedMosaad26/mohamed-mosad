import { About } from '@/components/portfolio/about'
import { Achievements } from '@/components/portfolio/achievements'
import { Certifications } from '@/components/portfolio/certifications'
import { Contact } from '@/components/portfolio/contact'
import { ExperienceTimeline } from '@/components/portfolio/experience'
import { Footer } from '@/components/portfolio/footer'
import { Hero } from '@/components/portfolio/hero'
import { Navbar } from '@/components/portfolio/navbar'
import { Projects } from '@/components/portfolio/projects'
import { Skills } from '@/components/portfolio/skills'
import { certificates, experiences, profile, projects } from '@/lib/portfolio-data'

export default function HomePage() {
  return (
    <div className="relative min-h-svh">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects projects={projects} />
        <ExperienceTimeline experiences={experiences} />
        <Achievements />
        <Certifications certificates={certificates} />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile.name,
            jobTitle: profile.title,
            email: `mailto:${profile.email}`,
            address: { '@type': 'PostalAddress', addressLocality: profile.location },
            sameAs: [profile.githubUrl, profile.linkedinUrl],
          }),
        }}
      />
    </div>
  )
}
