import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Theme toggle in top-right corner */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <Container
        size="lg"
        className="flex-1 flex flex-col items-center justify-center py-24"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            1<span className="text-gradient">Plus</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 leading-relaxed">
            Premium Creative Digital Studio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              View Portfolio
            </Button>
            <Button variant="secondary" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
