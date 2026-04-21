import type { Metadata } from 'next';

import { PageShell } from '@/components/page-shell';
import { ReviewsEmbed } from '@/components/reviews-embed';
import { createPageMetadata } from '@/lib/metadata';
import { integrationSettings, reviewsContent } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Reviews',
  'Read customer feedback and leave a Google review for Double Double Good Music Emporium.',
  '/reviews',
);

export default function ReviewsPage() {
  return (
    <PageShell title={reviewsContent.title}>
      <ReviewsEmbed
        iframeUrl={integrationSettings.reviewsEmbedUrl}
        scriptUrl={integrationSettings.reviewsScriptUrl}
        widgetId={integrationSettings.reviewsWidgetId}
      />
    </PageShell>
  );
}
