import type { Metadata } from 'next';

import '@/app/globals.css';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/metadata';
import { getLocalBusinessSchema } from '@/lib/schema';

export const metadata: Metadata = createPageMetadata(
  'Double Double Good Music Emporium',
  'Independent Stafford record shop for browsing, buying, selling, and planning your next visit.',
  '/',
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html lang="en">
      <body>
        <div className="main-layer flex min-h-screen flex-col" id="top">
          <SiteHeader />
          <main className="min-w-0 flex-1 px-4 pb-8 pt-6 lg:px-6 2xl:px-8">
            {children}
          </main>
          <SiteFooter />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
          type="application/ld+json"
        />
      </body>
    </html>
  );
}
