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
        variant === 'default' && 'bg-gray-100 text-gray-700',
        variant === 'primary' && 'bg-primary-100 text-primary-700',
        variant === 'ocean' && 'bg-ocean-100 text-ocean-700',
        variant === 'accent' && 'bg-accent-100 text-accent-700',
        variant === 'success' && 'bg-green-100 text-green-700',
        variant === 'warning' && 'bg-yellow-100 text-yellow-700',
        variant === 'ghost' && 'bg-white/20 text-white backdrop-blur-sm',
        className
      )}
    >
      {children}
    </span>
  );
}
