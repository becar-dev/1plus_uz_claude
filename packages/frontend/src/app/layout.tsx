import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { themeInitScript } from '@/lib/theme';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '1PLUS | Creative Digital Studio',
  description:
    'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
  keywords: ['creative studio', 'digital agency', 'branding', 'web development', 'Tashkent', 'Uzbekistan'],
  authors: [{ name: '1PLUS Studio' }],
  openGraph: {
    title: '1PLUS | Creative Digital Studio',
    description:
      'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
    type: 'website',
    locale: 'en_US',
    siteName: '1PLUS',
  },
  twitter: {
    card: 'summary_large_image',
    title: '1PLUS | Creative Digital Studio',
    description:
      'Premium creative digital studio specializing in branding, web development, and immersive digital experiences.',
  },
  icons: {
    icon: '/favicon.svg',
  },
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
