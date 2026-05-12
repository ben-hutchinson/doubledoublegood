import type { Metadata } from 'next';

import { ContentCard } from '@/components/content-card';
import { ImageCarousel } from '@/components/image-carousel';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { sellContent } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Sell',
  'Bring records in for assessment, ask about collection visits, and contact the shop first for larger collections.',
  '/sell',
);

export default function SellPage() {
  return (
    <PageShell title={sellContent.title}>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.05fr_1.45fr] lg:items-start lg:gap-8">
        <ContentCard title="What We Buy">
          <ul className="list-disc space-y-3 pl-5">
            {sellContent.buyingList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ContentCard>
        <ImageCarousel
          ariaLabel="Sell vinyl image carousel"
          className="h-full self-stretch"
          contentClassName="h-full"
          imageClassName="h-60 sm:h-72 lg:h-full"
          imageSizes="(min-width: 1024px) 30vw, 100vw"
          items={sellContent.carouselItems}
          rotationIntervalMs={sellContent.carouselRotationMs}
          showCounter={false}
          showTopBorder={false}
        />
        <ContentCard title="Sell Your Records">
          {sellContent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ContentCard>
      </div>
    </PageShell>
  );
}
