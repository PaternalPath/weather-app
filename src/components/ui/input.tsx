import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'
          }
          focus:outline-none focus:ring-2 focus:border-transparent
          text-zinc-900 dark:text-zinc-100
          placeholder:text-zinc-500 dark:placeholder:text-zinc-400
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
