'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloudSun, Settings } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            <CloudSun className="h-6 w-6 text-blue-600" />
            Weather Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/settings'
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
