import { gigTickerContent, shouldShowGigTicker } from '@/lib/site-content';

export function GigTicker() {
  const { eyebrow } = gigTickerContent;

  if (!shouldShowGigTicker(gigTickerContent)) {
    return null;
  }

  return (
    <section aria-label="Upcoming in-store shows" className="gig-ticker">
      <span className="gig-ticker__eyebrow">{eyebrow}</span>
    </section>
  );
}
