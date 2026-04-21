import Link from 'next/link';

import { NewsletterForm } from '@/components/newsletter-form';
import { OpenStatusBadge } from '@/components/open-status-badge';
import {
  businessDetails,
  footerContent,
  navigationItems,
} from '@/lib/site-content';

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-stone-700 bg-stone-950 px-4 py-10 text-stone-100 lg:px-6 2xl:px-8">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-3">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            Get in touch
          </h2>
          <dl className="grid gap-4 text-base leading-7 text-stone-200">
            <div>
              <dt className="heading-sub label-with-icon text-xs font-bold text-stone-400 uppercase">
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
              <dt className="heading-sub label-with-icon text-xs font-bold text-stone-400 uppercase">
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
              <dt className="heading-sub label-with-icon text-xs font-bold text-stone-400 uppercase">
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
        <div className="space-y-4 lg:col-span-2">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            Opening times
          </h2>
          <OpenStatusBadge tone="dark" />
          <p className="text-base leading-7 text-stone-200">
            {businessDetails.weeklyOpeningHours.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            Explore
          </h2>
          <ul className="space-y-2 text-base leading-7 text-stone-200">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link className="link-sweep text-hover-accent" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className="link-sweep text-hover-accent"
                href="/delivery-returns"
              >
                Delivery &amp; Returns
              </Link>
            </li>
            <li>
              <Link className="link-sweep text-hover-accent" href="/privacy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 md:col-span-2 lg:col-span-5" id="newsletter">
          <h2 className="heading-section text-lg font-black text-white uppercase">
            {footerContent.newsletterTitle}
          </h2>
          <p className="measure text-base leading-7 text-stone-300">
            {footerContent.newsletterCopy}
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-stone-700/60 pt-4 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Double Double Good Music Emporium</span>
        <a className="link-sweep text-hover-accent" href="#top">
          Back to top
        </a>
      </div>
    </footer>
  );
}
