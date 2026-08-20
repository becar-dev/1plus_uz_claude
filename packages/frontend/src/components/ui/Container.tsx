import { type ReactNode, type HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Max-width size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Remove horizontal padding */
  noPadding?: boolean;
  /** HTML element to render */
  as?: 'div' | 'section' | 'main' | 'article';
}

const maxWidthMap = {
  sm: 'max-w-3xl',      // 768px
  md: 'max-w-5xl',      // 1024px
  lg: 'max-w-7xl',      // 1280px
  xl: 'max-w-[1440px]', // 1440px
  full: 'max-w-full',
} as const;

export function Container({
  children,
  size = 'xl',
  noPadding = false,
  as: Component = 'div',
  className = '',
  ...props
}: ContainerProps) {
  const maxWidth = maxWidthMap[size];
  const padding = noPadding ? '' : 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16';

  return (
    <Component
      className={`w-full mx-auto ${maxWidth} ${padding} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
