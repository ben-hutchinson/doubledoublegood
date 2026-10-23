import type { Metadata } from 'next';

import { ImageCarousel } from '@/components/image-carousel';
import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { aboutContent, carouselItems } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'About',
  'The story of Double Double Good Music Emporium, from Mill Street beginnings to its current Stafford home.',
  '/about',
);

export default function AboutPage() {
  return (
    <PageShell title={aboutContent.title}>
      <div className="surface-stack space-y-8">
        <section className="space-y-5">
          <header className="space-y-2">
            <h2 className="heading-section text-2xl font-black text-stone-950 uppercase sm:text-3xl">
              {aboutContent.shopHeading}
            </h2>
            {aboutContent.shopSubheading ? (
              <p className="heading-sub text-xs font-bold text-stone-500 uppercase">
                {aboutContent.shopSubheading}
              </p>
            ) : null}
          </header>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <ImageCarousel
              className="w-full"
              imageClassName="h-[22rem] sm:h-[26rem]"
              items={carouselItems}
              showCounter={false}
              showTopBorder={false}
            />
            <article className="space-y-4">
              <p className="heading-sub text-xs font-bold text-stone-500 uppercase">
                {aboutContent.shopLead}
              </p>
              <div className="measure space-y-4 text-base leading-7 text-stone-700">
                {aboutContent.shopParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
