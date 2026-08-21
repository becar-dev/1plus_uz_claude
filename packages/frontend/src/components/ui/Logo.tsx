'use client';

interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show only the icon mark without text */
  iconOnly?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

const sizeMap = {
  sm: { width: 100, height: 34 },
  md: { width: 130, height: 44 },
  lg: { width: 160, height: 54 },
};

const iconSizeMap = {
  sm: { width: 28, height: 34 },
  md: { width: 36, height: 44 },
  lg: { width: 44, height: 54 },
};

export function Logo({ size = 'md', iconOnly = false, className = '' }: LogoProps) {
  const dimensions = iconOnly ? iconSizeMap[size] : sizeMap[size];
  const { width, height } = dimensions;

  return (
    <a
      href="/"
      className={`inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)] rounded-sm ${className}`}
      aria-label="1PLUS - Home"
    >
      {iconOnly ? (
        <svg
          width={width}
          height={height}
          viewBox="0 0 56 80"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          {/* Stylized "1" with overlapping CMYK colors */}
          {/* Yellow layer */}
          <polygon points="22,8 36,8 36,56 22,56" fill="#FFF200" opacity="0.9" />
          {/* Cyan layer */}
          <polygon points="12,14 30,4 30,54 12,54" fill="#00AEEF" opacity="0.85" />
          {/* Magenta layer */}
          <polygon points="26,10 42,6 42,56 26,56" fill="#EC008C" opacity="0.8" />
          {/* Overlap zones */}
          <polygon points="22,14 30,8 30,54 22,54" fill="#00AEEF" opacity="0.4" />
          <polygon points="26,10 36,8 36,56 26,56" fill="#EC008C" opacity="0.35" />
          {/* White "+" cross */}
          <rect x="22" y="24" width="14" height="3" rx="0.8" fill="#FFFFFF" />
          <rect x="27" y="19" width="3" height="14" rx="0.8" fill="#FFFFFF" />
          {/* CMYK dots */}
          <circle cx="14" cy="68" r="4" fill="#00AEEF" />
          <circle cx="24" cy="68" r="4" fill="#EC008C" />
          <circle cx="34" cy="68" r="4" fill="#FFF200" />
          <circle cx="44" cy="68" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg
          width={width}
          height={height}
          viewBox="0 0 240 80"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          {/* Stylized "1" with overlapping CMYK colors */}
          {/* Yellow layer (back) */}
          <polygon points="28,12 42,12 42,62 28,62" fill="#FFF200" opacity="0.9" />
          {/* Cyan layer (overlapping left) */}
          <polygon points="18,18 36,8 36,58 18,58" fill="#00AEEF" opacity="0.85" />
          {/* Magenta layer (overlapping right) */}
          <polygon points="32,14 48,10 48,60 32,60" fill="#EC008C" opacity="0.8" />
          {/* Overlap blend areas */}
          <polygon points="28,18 36,12 36,58 28,58" fill="#00AEEF" opacity="0.4" />
          <polygon points="32,14 42,12 42,60 32,60" fill="#EC008C" opacity="0.35" />
          {/* White "+" cross symbol */}
          <rect x="29" y="22" width="10" height="2.5" rx="0.5" fill="#FFFFFF" />
          <rect x="32.5" y="18.5" width="2.5" height="10" rx="0.5" fill="#FFFFFF" />
          {/* Four CMYK dots below the "1" */}
          <circle cx="22" cy="70" r="3.5" fill="#00AEEF" />
          <circle cx="31" cy="70" r="3.5" fill="#EC008C" />
          <circle cx="40" cy="70" r="3.5" fill="#FFF200" />
          <circle cx="49" cy="70" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {/* "BIR+" text */}
          <text
            x="68"
            y="50"
            fontFamily="Inter, Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="36"
            fill="currentColor"
            letterSpacing="-1"
          >
            BIR
          </text>
          {/* "+" with magenta accent */}
          <text
            x="155"
            y="50"
            fontFamily="Inter, Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="36"
            fill="#EC008C"
          >
            +
          </text>
        </svg>
      )}
    </a>
  );
}
