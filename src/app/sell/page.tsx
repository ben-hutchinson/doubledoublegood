import type { Metadata } from 'next';

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
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]">
        <ContentCard title="What We Buy">
          <ul className="list-disc space-y-3 pl-5">
            {sellContent.buyingList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ContentCard>
        <ContentCard title="Sell Your Records">
          {sellContent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ContentCard>
      </div>
    </PageShell>
  );
}
