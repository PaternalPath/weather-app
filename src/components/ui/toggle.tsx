import { ReactNode } from 'react';

interface ToggleOption<T> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
}

interface ToggleProps<T> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Toggle<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: ToggleProps<T>) {
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 ${className}`}
      role="group"
      aria-label="Toggle options"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            ${sizeStyles[size]}
            rounded-md font-medium transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:focus:ring-offset-zinc-800
            ${
              value === option.value
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }
          `}
          aria-pressed={value === option.value}
          aria-label={option.ariaLabel || String(option.label)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
