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
import {
  getProfile,
  getProjects,
  getSkillCategories,
  getExperiences,
  getCertificates,
} from '@/lib/db/portfolio-service'

export default async function HomePage() {
  const [profileData, projectsData, skillData, experienceData, certificateData] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getSkillCategories(),
      getExperiences(),
      getCertificates(),
    ])

  return (
    <div className="relative min-h-svh">
      <Navbar />
      <main>
        <Hero profile={profileData} />
        <About profile={profileData} />
        <Skills categories={skillData} />
        <Projects projects={projectsData} />
        <ExperienceTimeline experiences={experienceData} />
        <Achievements />
        <Certifications certificates={certificateData} />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profileData.name,
            jobTitle: profileData.title,
            email: `mailto:${profileData.email}`,
            address: { '@type': 'PostalAddress', addressLocality: profileData.location },
            sameAs: [profileData.githubUrl, profileData.linkedinUrl],
          }),
        }}
      />
    </div>
  )
}
