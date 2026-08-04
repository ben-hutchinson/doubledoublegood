import {
  type GigTickerEvent,
  gigTickerContent,
  shouldShowGigTicker,
} from '@/lib/site-content';

function formatGigTickerEvent(event: GigTickerEvent) {
  return event.message;
}

export function GigTicker() {
  const { events, eyebrow } = gigTickerContent;

  if (!shouldShowGigTicker(gigTickerContent)) {
    return null;
  }

  const eventSummaries = events
    .map(formatGigTickerEvent)
    .filter((summary) => summary.trim().length > 0);
  const marqueeText = eventSummaries.join('  •  ');

  return (
    <section aria-label="Upcoming in-store shows" className="gig-ticker">
      <span className="gig-ticker__eyebrow">{eyebrow}</span>
      {eventSummaries.length > 0 ? (
        <>
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
        </>
      ) : null}
    </section>
  );
}
