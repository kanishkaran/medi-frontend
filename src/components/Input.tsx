import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-3 py-2 bg-secondary/10 border border-secondary/20 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'placeholder:text-foreground/50',
            error && 'border-error focus:ring-error/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Needed because forwardRef loses the component name

export default Input;
