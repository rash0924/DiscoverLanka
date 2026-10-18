import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          size === 'xl' && 'h-14 px-8 text-lg',
          variant === 'primary' &&
            'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500 shadow-sm hover:shadow-md',
          variant === 'secondary' &&
            'bg-ocean-500 text-white hover:bg-ocean-600 active:bg-ocean-700 focus-visible:ring-ocean-500 shadow-sm hover:shadow-md',
          variant === 'accent' &&
            'bg-accent-400 text-white hover:bg-accent-500 active:bg-accent-600 focus-visible:ring-accent-400 shadow-sm hover:shadow-md',
          variant === 'outline' &&
            'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
          variant === 'ghost' &&
            'text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400',
          variant === 'danger' &&
            'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
