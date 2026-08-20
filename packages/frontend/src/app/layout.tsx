import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { themeInitScript } from '@/lib/theme';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF8' },
    { media: '(prefers-color-scheme: dark)', color: '#1C1C1E' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: '1PLUS | Creative Digital Studio',
    template: '%s | 1PLUS',
  },
  description:
    'Premium creative digital studio in Tashkent specializing in branding, web development, and immersive digital experiences that push boundaries.',
  keywords: [
    'creative studio',
    'digital agency',
    'branding',
    'web development',
    'UI/UX design',
    'Tashkent',
    'Uzbekistan',
    '1PLUS',
  ],
  authors: [{ name: '1PLUS Studio', url: 'https://1plus.uz' }],
  creator: '1PLUS Studio',
  publisher: '1PLUS Studio',
  metadataBase: new URL('https://1plus.uz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '1PLUS | Creative Digital Studio',
    description:
      'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
    url: 'https://1plus.uz',
    siteName: '1PLUS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '1PLUS Creative Digital Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1PLUS | Creative Digital Studio',
    description:
      'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
    images: ['/og-image.png'],
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
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

// JSON-LD Structured Data for Organization
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '1PLUS',
  alternateName: '1PLUS Creative Digital Studio',
  url: 'https://1plus.uz',
  logo: 'https://1plus.uz/favicon.svg',
  description:
    'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tashkent',
    addressCountry: 'UZ',
  },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Russian', 'Uzbek'],
  },
};

// JSON-LD for WebSite
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '1PLUS',
  url: 'https://1plus.uz',
  description:
    'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
