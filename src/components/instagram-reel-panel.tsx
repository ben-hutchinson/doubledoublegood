'use client';

import { useState } from 'react';

import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';

type InstagramReelPanelProps = {
  embedUrl: string;
  className?: string;
  heading?: string;
  showTopBorder?: boolean;
  embedMinHeightClass?: string;
  fillAvailableHeight?: boolean;
};

export function InstagramReelPanel({
  embedUrl,
  className,
  heading = 'New stock',
  showTopBorder = true,
  embedMinHeightClass = 'min-h-[40rem]',
  fillAvailableHeight = false,
}: InstagramReelPanelProps) {
  const [loaded, setLoaded] = useState(false);
  const trustedEmbedUrl = getTrustedExternalUrl(embedUrl, {
    allowedHostnames: trustedHostnames.instagramEmbed,
  });

  const sectionClassName = [
    'section-card space-y-5',
    showTopBorder ? 'border-t border-stone-900/12 pt-6' : '',
    fillAvailableHeight ? 'h-full flex flex-col' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const embedShellClassName = ['w-full', fillAvailableHeight ? 'flex-1' : '']
    .filter(Boolean)
    .join(' ');

  const embedFrameClassName = [
    'embed-shell relative w-full overflow-hidden bg-white',
    embedMinHeightClass,
    fillAvailableHeight ? '' : 'aspect-[9/16] max-w-[25rem]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClassName}>
      <div>
        <h2 className="heading-section text-2xl font-black text-stone-950 uppercase">
          {heading}
        </h2>
      </div>
      <div className={embedShellClassName}>
        {trustedEmbedUrl ? (
          <div className={embedFrameClassName}>
            {!loaded ? <div className="embed-skeleton" /> : null}
            <iframe
              allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              src={trustedEmbedUrl}
              title="Latest Instagram reel from Double Double Good Music Emporium"
            />
          </div>
        ) : (
          <div className="flex min-h-[24rem] items-center justify-center p-8">
            <p className="max-w-md text-center text-base leading-7 text-stone-700">
              Instagram embeds can be shown here once a reel link is configured.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
