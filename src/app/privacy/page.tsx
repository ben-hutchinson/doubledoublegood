import type { Metadata } from 'next';

import { ContentCard } from '@/components/content-card';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { privacySections } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Privacy Policy',
  'How Double Double Good Music Emporium handles contact, newsletter, order, payment, fulfilment, and event-entry information.',
  '/privacy',
);

export default function PrivacyPage() {
  return (
    <PageShell
      intro="This policy covers information used for enquiries, mailing-list updates, Stripe purchases, order fulfilment, and named event entry."
      title="Privacy Policy"
    >
      <div className="surface-stack grid gap-5">
        {privacySections.map((section) => (
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
