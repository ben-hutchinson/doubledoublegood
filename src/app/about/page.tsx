import type { Metadata } from 'next';
import Image from 'next/image';

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
              className="rounded-[1.1rem] border border-stone-900/12 bg-[color:var(--panel)] p-3"
              imageClassName="h-[22rem] sm:h-[26rem]"
              items={carouselItems}
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

        <section className="space-y-5 pt-8">
          <header className="space-y-2">
            <h2 className="heading-section text-2xl font-black text-stone-950 uppercase sm:text-3xl">
              {aboutContent.ownerHeading}
            </h2>
          </header>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <article className="space-y-4">
              <div className="measure space-y-4 text-base leading-7 text-stone-700">
                {aboutContent.ownerParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
            <div className="rounded-[1.1rem] border border-stone-900/12 bg-[color:var(--panel)] p-3">
              <div className="media-zoom relative h-[22rem] overflow-hidden rounded-[1.2rem] border border-stone-900/12 bg-stone-100 sm:h-[26rem]">
                <Image
                  fill
                  alt={aboutContent.ownerImage.alt}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_24%]"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  src={aboutContent.ownerImage.src}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
