import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'ocean' | 'accent' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        variant === 'default' && 'bg-primary-50 text-primary-700 ring-1 ring-primary-100',
        variant === 'primary' && 'bg-gradient-to-r from-primary-100 to-sand-50 text-primary-800 ring-1 ring-primary-100',
        variant === 'ocean' && 'bg-ocean-50 text-ocean-800 ring-1 ring-ocean-100',
        variant === 'accent' && 'bg-gradient-to-r from-accent-100 to-sand-50 text-accent-800 ring-1 ring-accent-100',
        variant === 'success' && 'bg-green-100 text-green-700',
        variant === 'warning' && 'bg-yellow-100 text-yellow-700',
        variant === 'ghost' && 'border border-white/25 bg-white/20 text-white shadow-sm backdrop-blur-md',
        className
      )}
    >
      {children}
    </span>
  );
}
