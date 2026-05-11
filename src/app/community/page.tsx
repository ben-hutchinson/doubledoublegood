import type { Metadata } from 'next';
import Image from 'next/image';

import { ContentCard } from '@/components/content-card';
import { PageShell } from '@/components/page-shell';
import { SocialLinks } from '@/components/social-links';
import { createPageMetadata } from '@/lib/metadata';
import { communityContent, type CommunityItem } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Community',
  'Local bands, friends of the shop, and independent places supported by Double Double Good Music Emporium.',
  '/community',
);

type CommunityListProps = {
  emptyMessage: string;
  items: CommunityItem[];
  title: string;
};

function CommunityList({ emptyMessage, items, title }: CommunityListProps) {
  return (
    <ContentCard title={title}>
      {items.length > 0 ? (
        <ul className="grid gap-5">
          {items.map((item) => (
            <li key={item.name} className="space-y-3">
              {item.image ? (
                <div className="media-zoom relative h-48 overflow-hidden rounded-[1.2rem] border border-stone-900/12 bg-stone-100">
                  <Image
                    fill
                    alt={item.image.alt}
                    className="absolute inset-0 h-full w-full rounded-[1.2rem] object-cover"
                    sizes="(min-width: 1024px) 28vw, 100vw"
                    src={item.image.src}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <h3 className="heading-section text-sm font-black text-stone-950 uppercase">
                  {item.href ? (
                    <a
                      className="link-sweep text-hover-accent"
                      href={item.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </h3>
                {item.description ? <p>{item.description}</p> : null}
                {item.socials && item.socials.length > 0 ? (
                  <SocialLinks links={item.socials} />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>{emptyMessage}</p>
      )}
    </ContentCard>
  );
}

export default function CommunityPage() {
  return (
    <PageShell intro={communityContent.intro} title={communityContent.title}>
      <div className="grid gap-6 lg:grid-cols-2">
        <CommunityList
          emptyMessage={communityContent.emptySupportedBandsMessage}
          items={communityContent.supportedBands}
          title={communityContent.supportedBandsTitle}
        />
        <CommunityList
          emptyMessage={communityContent.emptyIndependentShopsMessage}
          items={communityContent.independentShops}
          title={communityContent.independentShopsTitle}
        />
      </div>
    </PageShell>
  );
}
