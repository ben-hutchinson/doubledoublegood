import type { Metadata } from 'next';
import Image from 'next/image';

import { ContentCard } from '@/components/content-card';
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
        <div className="media-zoom self-stretch rounded-[1.2rem] border border-stone-900/12 bg-stone-100">
          <Image
            alt={sellContent.stockImage.alt}
            className="h-60 w-full rounded-[1.2rem] object-cover sm:h-72 lg:h-full"
            height={sellContent.stockImage.height}
            sizes="(min-width: 1024px) 30vw, 100vw"
            src={sellContent.stockImage.src}
            width={sellContent.stockImage.width}
          />
        </div>
        <ContentCard title="Sell Your Records">
          {sellContent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ContentCard>
      </div>
    </PageShell>
  );
}
