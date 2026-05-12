import type { Metadata } from 'next';

import { PageShell } from '@/components/page-shell';
import { createPageMetadata } from '@/lib/metadata';
import { communityContent } from '@/lib/site-content';

export const metadata: Metadata = createPageMetadata(
  'Community',
  'Updates about the shop and wider Double Double Good community.',
  '/community',
);

export default function CommunityPage() {
  return (
    <PageShell intro={communityContent.intro} title={communityContent.title} />
  );
}
