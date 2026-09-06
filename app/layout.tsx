import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const siteUrl = 'https://mohamed-mosad.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mohamed Mosad | Machine Learning Engineer & Data Scientist',
    template: '%s | Mohamed Mosad',
  },
  description:
    'Portfolio of Mohamed Mosad Mohamed — Machine Learning Engineer & Data Scientist. Building intelligent solutions with Machine Learning, Data, and Software Engineering.',
  keywords: [
    'Machine Learning Engineer',
    'Data Scientist',
    'Mohamed Mosad',
    'Python',
    'Deep Learning',
    'Data Science',
    'Generative AI',
    'Port Said',
  ],
  authors: [{ name: 'Mohamed Mosad Mohamed' }],
  creator: 'Mohamed Mosad Mohamed',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Mohamed Mosad | Machine Learning Engineer & Data Scientist',
    description:
      'Building intelligent solutions with Machine Learning, Data, and Software Engineering.',
    siteName: 'Mohamed Mosad Portfolio',
    images: [{ url: '/mohamed-profile.jpeg', width: 1200, height: 630, alt: 'Mohamed Mosad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Mosad | Machine Learning Engineer & Data Scientist',
    description:
      'Building intelligent solutions with Machine Learning, Data, and Software Engineering.',
    images: ['/mohamed-profile.jpeg'],
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
