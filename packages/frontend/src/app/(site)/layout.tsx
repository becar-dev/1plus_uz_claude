import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/footer/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
