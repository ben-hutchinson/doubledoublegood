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
        <ContentCard title={contactContent.getInTouchHeading}>
          {contactContent.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="list-disc space-y-3 pl-5">
            {contactContent.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <p>{contactContent.outro}</p>
        </ContentCard>
        <div>
          <h2 className="heading-section mb-4 text-lg font-black text-stone-950 uppercase">
            Send Us a Message
          </h2>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
