import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 transition-colors duration-200 dark:bg-zinc-900 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700'
        } text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-50 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:disabled:bg-zinc-800 ${className} `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
