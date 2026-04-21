import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';
import { ContentCard } from '@/components/content-card';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { contactContent } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Contact',
  'Get in touch with Double Double Good Music Emporium by email, phone, or contact form.',
  '/contact',
);

export default function ContactPage() {
  return (
    <PageShell title={contactContent.title}>
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.2fr]">
        <ContentCard title="Get In Touch">
          {contactContent.cards.map((card) => (
            <div key={card.label}>
              <p className="heading-sub label-with-icon text-sm font-bold text-stone-500 uppercase">
                {card.label}
              </p>
              <p className="measure mt-2 whitespace-pre-line">{card.value}</p>
            </div>
          ))}
        </ContentCard>
        <div>
          <p className="heading-section mb-4 text-lg font-black text-stone-950 uppercase">
            Send Us a Message
          </p>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
