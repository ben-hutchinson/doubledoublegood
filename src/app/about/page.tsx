import type { Metadata } from 'next';

import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { aboutContent, aboutHighlights } from '@/lib/site-content';

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
            <p className="heading-sub text-xs font-bold text-stone-500 uppercase">
              {aboutContent.shopSubheading}
            </p>
          </header>
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex min-h-[24rem] items-end rounded-[1.1rem] border border-stone-900/35 bg-[linear-gradient(135deg,rgba(24,18,15,0.08),rgba(186,43,32,0.14))] p-6">
              <ul className="grid w-full gap-4 sm:grid-cols-2">
                {aboutHighlights.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-stone-900/15 bg-[color:var(--panel)] p-4 shadow-[var(--shadow)]"
                  >
                    <p className="label-with-icon text-xs font-bold tracking-[0.2em] text-stone-500 uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base leading-7 text-stone-800">
                      {item.value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <article className="space-y-4">
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
            <p className="heading-sub text-xs font-bold text-stone-500 uppercase">
              {aboutContent.ownerSubheading}
            </p>
          </header>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="measure space-y-4 text-base leading-7 text-stone-700">
              {aboutContent.ownerParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
            <div className="media-zoom flex min-h-[20rem] items-center justify-center rounded-[1.1rem] border border-dashed border-stone-900/35 bg-stone-100 p-6">
              <div className="text-center">
                <p className="heading-sub text-xs font-bold text-stone-600 uppercase">
                  Owner image
                </p>
                <p className="mt-3 text-base leading-7 text-stone-700">
                  Portrait placeholder for this section.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
