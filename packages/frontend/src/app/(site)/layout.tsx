import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/footer/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { PageTransition } from '@/components/transitions/PageTransition';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
