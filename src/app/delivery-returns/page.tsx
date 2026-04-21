import type { Metadata } from 'next';

import { ContentCard } from '@/components/content-card';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { deliveryReturnsSections } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Delivery & Returns',
  'Helpful delivery guidance and returns information for the V1 brochure site.',
  '/delivery-returns',
);

export default function DeliveryReturnsPage() {
  return (
    <PageShell title="Delivery & Returns">
      <div className="surface-stack grid gap-5">
        {deliveryReturnsSections.map((section) => (
          <section key={section.heading}>
            <ContentCard title={section.heading}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </ContentCard>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
