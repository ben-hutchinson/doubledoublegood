'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { NavigationItem } from '@/lib/site-content';

type PrimaryNavProps = {
  items: NavigationItem[];
};

export function PrimaryNav({ items }: PrimaryNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="bg-stone-950">
      <ul className="site-content-gutter grid w-full gap-x-3 gap-y-1 py-3 text-center sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(`${item.href}/`));

          return (
            <li key={item.href} className="sm:flex">
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={`heading-section nav-link link-sweep text-hover-accent inline-flex w-full items-center justify-center px-3 py-2 text-sm font-semibold text-stone-50 uppercase sm:min-h-12 ${
                  isActive ? 'is-active' : ''
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
