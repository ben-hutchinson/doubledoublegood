import type { Metadata } from 'next';

import { ContentCard } from '@/components/content-card';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { privacySections } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Privacy Policy',
  'How the site handles contact form and newsletter information for Double Double Good Music Emporium.',
  '/privacy',
);

export default function PrivacyPage() {
  return (
    <PageShell
      intro="This policy covers the information collected through the contact and mailing-list forms on this site."
      title="Privacy Policy"
    >
      <div className="surface-stack grid gap-5">
        {privacySections.map((section) => (
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
