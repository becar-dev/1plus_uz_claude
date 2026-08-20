import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '1Plus - Premium Creative Agency',
  description: 'Premium creative agency specializing in branding, web development, and digital experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
