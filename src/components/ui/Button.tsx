import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../utils/cn';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          {
            'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-md hover:from-pink-600 hover:to-violet-600 border border-white/20': variant === 'primary',
            'bg-white/60 text-slate-700 hover:bg-white/90 backdrop-blur-sm border border-white/60': variant === 'secondary',
            'hover:bg-black/5 text-slate-600': variant === 'ghost',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-8 text-base': size === 'md',
            'h-14 px-10 text-lg': size === 'lg',
            'h-11 w-11 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
