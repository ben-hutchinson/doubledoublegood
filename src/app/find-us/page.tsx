import type { Metadata } from 'next';

import { ContentCard } from '@/components/content-card';
import { MapEmbed } from '@/components/map-embed';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import {
  businessDetails,
  findUsContent,
  integrationSettings,
} from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Find Us',
  'Address, opening hours, map, parking guidance, and walking directions for the Stafford shop.',
  '/find-us',
);

export default function FindUsPage() {
  return (
    <PageShell title={findUsContent.title}>
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <MapEmbed
          embedUrl={integrationSettings.mapEmbedUrl}
          title={`Map to ${businessDetails.name}`}
        />
        <ContentCard title="Find Us">
          <div className="space-y-5">
            {findUsContent.infoBlocks.map((block) => (
              <div key={block.label}>
                <p className="heading-sub label-with-icon text-sm font-bold text-stone-500 uppercase">
                  {block.label}
                </p>
                <p className="measure mt-2 whitespace-pre-line">{block.value}</p>
              </div>
            ))}
            <a
              className="heading-section pressable inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-bold text-stone-50 uppercase hover:bg-stone-800"
              href={businessDetails.directionsUrl}
              rel="noreferrer"
              target="_blank"
            >
              Get Directions
            </a>
          </div>
        </ContentCard>
      </div>
    </PageShell>
  );
}
