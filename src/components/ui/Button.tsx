import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-oracle-sm font-display font-semibold transition-all duration-normal ease-oracle',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oracle-gold focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Sizes
          {
            'px-3 py-1.5 text-body-sm': size === 'sm',
            'px-5 py-2.5 text-body': size === 'md',
            'px-6 py-3 text-body-lg': size === 'lg',
          },
          // Variants
          {
            'bg-dark-ink text-txt-inverse hover:bg-dark-charcoal active:bg-dark-graphite':
              variant === 'primary',
            'bg-warm-cream text-txt-primary border border-warm-stone hover:bg-warm-sand active:bg-warm-stone':
              variant === 'secondary',
            'bg-transparent text-txt-secondary hover:bg-warm-cream hover:text-txt-primary':
              variant === 'ghost',
            'bg-oracle-gold text-dark-ink hover:bg-oracle-gold-light active:bg-oracle-gold-dark':
              variant === 'gold',
            'bg-danger/10 text-danger hover:bg-danger/20': variant === 'danger',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
