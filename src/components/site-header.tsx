import Image from 'next/image';
import Link from 'next/link';

import { OpenStatusBadge } from '@/components/open-status-badge';
import { PrimaryNav } from '@/components/primary-nav';
import { SocialLinks } from '@/components/social-links';
import {
  headerContent,
  navigationItems,
  socialLinks,
} from '@/lib/site-content';

export function SiteHeader() {
  return (
    <header className="border-b border-stone-900/12">
      <div className="site-shell-gutter flex w-full flex-col gap-6 py-5 lg:py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2 xl:max-w-[52rem]">
            <Link
              href="/"
              className="logo-fade-shell block w-full max-w-[34rem]"
            >
              <Image
                alt={headerContent.logoAlt}
                className="logo-soft-fade h-auto w-full rounded-[1.2rem]"
                height={197}
                priority
                src="/double-double-good-logo.jpg"
                width={654}
              />
            </Link>
            <div className="space-y-1 pl-2 sm:pl-3">
              <p
                aria-hidden="true"
                className="heading-sub measure max-w-[34rem] text-xs font-bold text-stone-500 uppercase"
              >
                {headerContent.strapline}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 xl:items-end">
            <OpenStatusBadge
              className="self-start xl:self-end"
              messageOverride={
                headerContent.openStatusBadgeMode === 'closed'
                  ? headerContent.openStatusClosedMessage
                  : undefined
              }
            />
            <SocialLinks links={socialLinks} />
          </div>
        </div>
      </div>
      <PrimaryNav items={navigationItems} />
    </header>
  );
}
