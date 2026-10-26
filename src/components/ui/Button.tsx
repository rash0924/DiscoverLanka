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
          'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 select-none',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          size === 'xl' && 'h-14 px-8 text-lg',
          variant === 'primary' &&
            'bg-gradient-to-r from-primary-700 to-primary-600 text-white hover:from-primary-800 hover:to-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 shadow-md shadow-primary-900/15 hover:shadow-lg hover:shadow-primary-900/20',
          variant === 'secondary' &&
            'border border-primary-200 bg-sand-50 text-primary-800 hover:border-primary-300 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
          variant === 'accent' &&
            'bg-gradient-to-r from-primary-700 to-primary-600 text-white hover:from-primary-800 hover:to-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 shadow-md shadow-primary-900/15 hover:shadow-lg hover:shadow-primary-900/20',
          variant === 'outline' &&
            'border border-primary-200 bg-white text-primary-700 shadow-sm hover:border-primary-300 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
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
