import { gigTickerContent, shouldShowGigTicker } from '@/lib/site-content';

function formatGigTickerEvent(event: (typeof gigTickerContent.events)[number]) {
  return event.message;
}

export function GigTicker() {
  const { events, eyebrow } = gigTickerContent;

  if (!shouldShowGigTicker(gigTickerContent)) {
    return null;
  }

  const eventSummaries = events.map(formatGigTickerEvent);
  const marqueeText = eventSummaries.join('  •  ');

  return (
    <section aria-label="Upcoming in-store shows" className="gig-ticker">
      <span className="gig-ticker__eyebrow">{eyebrow}</span>
      <ul className="sr-only">
        {eventSummaries.map((summary) => (
          <li key={summary}>{summary}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="gig-ticker__viewport">
        <div className="gig-ticker__track">
          <span className="gig-ticker__text">{marqueeText}</span>
          <span className="gig-ticker__text">{marqueeText}</span>
        </div>
      </div>
    </section>
  );
}
