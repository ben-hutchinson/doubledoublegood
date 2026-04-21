import type { ReactNode } from 'react';

type PageShellProps = {
  title: string;
  intro?: string;
  children: ReactNode;
  titleAs?: 'h1' | 'h2';
};

export function PageShell({
  title,
  intro,
  children,
  titleAs = 'h1',
}: PageShellProps) {
  const HeadingTag = titleAs;

  return (
    <section className="space-y-8 py-2 lg:space-y-10 lg:py-4">
      <header className="reveal-in max-w-3xl space-y-4">
        <p className="heading-sub text-xs font-bold text-stone-500 uppercase">
          Double Double Good Music Emporium
        </p>
        <HeadingTag className="heading-page text-3xl font-black text-stone-950 uppercase sm:text-4xl">
          {title}
        </HeadingTag>
        {intro ? (
          <p className="measure max-w-2xl text-lg leading-8 text-stone-700">
            {intro}
          </p>
        ) : null}
      </header>
      <div aria-hidden className="subtle-divider reveal-in reveal-delay-1" />
      <div className="reveal-in reveal-delay-2">{children}</div>
    </section>
  );
}
