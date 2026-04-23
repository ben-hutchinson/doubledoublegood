import Image from 'next/image';
import Link from 'next/link';

import { PrimaryNav } from '@/components/primary-nav';
import { SocialLinks } from '@/components/social-links';
import { headerContent, navigationItems, socialLinks } from '@/lib/site-content';

export function SiteHeader() {
  return (
    <header className="border-b border-stone-900/12">
      <div className="flex w-full flex-col gap-6 px-4 py-5 lg:px-6 lg:py-6 2xl:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2 xl:max-w-[52rem]">
            <Link href="/" className="logo-fade-shell block w-full max-w-[34rem]">
              <Image
                alt={headerContent.logoAlt}
                className="logo-soft-fade h-auto w-full"
                height={197}
                priority
                src="/double-double-good-logo.jpg"
                width={654}
              />
            </Link>
            <p className="measure max-w-[34rem] text-sm leading-6 font-medium text-stone-700 sm:text-base">
              {headerContent.strapline}
            </p>
          </div>
          <div className="flex flex-col gap-3 xl:items-end">
            <SocialLinks links={socialLinks} />
          </div>
        </div>
      </div>
      <PrimaryNav items={navigationItems} />
    </header>
  );
}
