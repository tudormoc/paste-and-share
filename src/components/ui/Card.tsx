import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../utils/cn';

export const Card = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass rounded-3xl p-4 sm:p-8', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';
