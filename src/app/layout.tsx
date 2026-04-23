import type { Metadata } from 'next';

import '@/app/globals.css';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/metadata';
import { safeJsonLdStringify } from '@/lib/security';
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
  const localBusinessSchemaJson = safeJsonLdStringify(localBusinessSchema);

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="main-layer flex min-h-screen flex-col" id="top">
          <SiteHeader />
          <main
            className="min-w-0 flex-1 px-4 pt-6 pb-8 lg:px-6 2xl:px-8"
            id="main-content"
          >
            {children}
          </main>
          <SiteFooter />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: localBusinessSchemaJson,
          }}
          type="application/ld+json"
        />
      </body>
    </html>
  );
}
