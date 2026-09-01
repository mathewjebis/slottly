/**
 * Slottly Design Tokens
 * Production-grade spacing, typography, and color system
 */

export const spacing = {
  section: {
    tight: 'py-16 md:py-20',
    standard: 'py-20 md:py-28',
    loose: 'py-28 md:py-36',
  },
  container: 'max-w-7xl mx-auto px-6 lg:px-8',
  stack: {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
  },
};

export const typography = {
  display: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none',
  h1: 'text-3xl md:text-4xl font-bold tracking-tight',
  h2: 'text-2xl md:text-3xl font-semibold tracking-tight',
  h3: 'text-xl md:text-2xl font-semibold',
  body: 'text-base text-slate-300 leading-relaxed max-w-[65ch]',
  small: 'text-sm text-slate-400',
  label: 'text-xs uppercase tracking-wider font-medium text-slate-500',
};

export const motion = {
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
  ease: [0.16, 1, 0.3, 1],
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
  },
};
