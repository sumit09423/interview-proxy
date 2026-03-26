import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI Agent Keyword Generator',
    template: '%s | AI Keyword Generator',
  },
  description: 'Generate top-ranked SEO keywords using advanced multi-agent AI workflow. Get comprehensive keyword analysis with relevance scores, search volumes, and ranking insights.',
  keywords: ['SEO', 'keyword generator', 'AI keywords', 'SEO tools', 'keyword research', 'AI agents'],
  authors: [{ name: 'AI Agent Keyword Generator' }],
  creator: 'AI Agent Keyword Generator',
  publisher: 'AI Agent Keyword Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Agent Keyword Generator',
    description: 'Generate top-ranked SEO keywords using advanced multi-agent AI workflow',
    siteName: 'AI Keyword Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agent Keyword Generator',
    description: 'Generate top-ranked SEO keywords using advanced multi-agent AI workflow',
    creator: '@aikeywordgen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3b82f6' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
