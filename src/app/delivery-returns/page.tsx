import type { Metadata } from 'next';

import { ContentCard } from '@/components/content-card';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { deliveryReturnsSections } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Delivery & Returns',
  'Prices, collection, UK delivery, cancellation, returns, faults, refunds, and promotional gig admission for online orders.',
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
              {section.links?.map((link) => (
                <p key={link.href}>
                  <a className="link-sweep font-semibold" href={link.href}>
                    {link.label}
                  </a>
                </p>
              ))}
            </ContentCard>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
