import type { ReactNode } from 'react';

type ContentCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function ContentCard({ title, children, className }: ContentCardProps) {
  const cardClassName = ['lift-soft space-y-4', className]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClassName}>
      <h2 className="heading-section text-hover-accent text-base font-black text-stone-950 uppercase sm:text-lg">
        {title}
      </h2>
      <div className="measure space-y-4 text-base leading-7 text-stone-700">
        {children}
      </div>
    </article>
  );
}
