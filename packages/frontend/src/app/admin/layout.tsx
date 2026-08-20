import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '1PLUS Admin',
  description: 'Admin panel for 1PLUS Creative Studio',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {children}
    </div>
  );
}
