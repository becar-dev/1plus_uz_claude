'use client';

interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional className for additional styling */
  className?: string;
}

const sizeMap = {
  sm: { width: 80, height: 28 },
  md: { width: 100, height: 34 },
  lg: { width: 120, height: 40 },
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const { width, height } = sizeMap[size];

  return (
    <a
      href="/"
      className={`inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)] rounded-sm ${className}`}
      aria-label="1PLUS - Home"
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-cmyk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="50%" stopColor="var(--accent-secondary)" />
            <stop offset="100%" stopColor="var(--accent-tertiary)" />
          </linearGradient>
        </defs>
        <text
          x="4"
          y="32"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="32"
          fill="url(#logo-cmyk-gradient)"
          letterSpacing="-1"
        >
          1+
        </text>
      </svg>
    </a>
  );
}
