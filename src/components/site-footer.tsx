import Link from 'next/link';

import {
  businessDetails,
  footerContent,
  navigationItems,
} from '@/lib/site-content';
import type { NavigationItem } from '@/lib/site-content';

const exploreLinkColumns: NavigationItem[][] = [
  navigationItems.slice(0, 4),
  [
    ...navigationItems.slice(4),
    { href: '/delivery-returns', label: 'Delivery & Returns' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/', label: 'Home' },
  ],
];

export function SiteFooter() {
  return (
    <footer className="site-content-gutter mt-auto w-full border-t border-stone-700 bg-stone-950 py-10 text-stone-100">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            Get in touch
          </h2>
          <dl className="grid gap-4 text-base leading-7 text-stone-200">
            <div>
              <dt className="heading-sub text-xs font-bold text-stone-400 uppercase">
                Address
              </dt>
              <dd className="mt-1">
                {footerContent.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="heading-sub text-xs font-bold text-stone-400 uppercase">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  className="link-sweep text-hover-accent"
                  href={businessDetails.phoneHref}
                >
                  {businessDetails.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="heading-sub text-xs font-bold text-stone-400 uppercase">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  className="link-sweep text-hover-accent"
                  href={businessDetails.emailHref}
                >
                  {businessDetails.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="space-y-4">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            Opening times
          </h2>
          <p className="text-base leading-7 text-stone-200">
            {businessDetails.weeklyOpeningHours.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div className="space-y-4 md:col-span-2 lg:col-span-2">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            Explore
          </h2>
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {exploreLinkColumns.map((column, index) => (
              <ul
                key={index}
                className="space-y-2 text-lg leading-7 text-stone-200"
              >
                {column.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="link-sweep text-hover-accent"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-stone-700/60 pt-4 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} Double Double Good Music Emporium
        </span>
        <a className="link-sweep text-hover-accent" href="#top">
          Back to top
        </a>
      </div>
    </footer>
  );
}
