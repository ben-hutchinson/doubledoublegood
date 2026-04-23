'use client';

import { useState } from 'react';

import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';

type MapEmbedProps = {
  embedUrl?: string;
  title: string;
};

export function MapEmbed({ embedUrl, title }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const trustedEmbedUrl = getTrustedExternalUrl(embedUrl ?? '', {
    allowedHostnames: trustedHostnames.mapEmbed,
  });

  if (!trustedEmbedUrl) {
    return (
      <div className="flex h-full min-h-[24rem] items-center justify-center rounded-[1rem] border border-dashed border-stone-900/35">
        <p className="max-w-md text-center text-base leading-7 text-stone-700">
          A live map can be connected here without changing the page layout.
        </p>
      </div>
    );
  }

  return (
    <div className="embed-shell h-full overflow-hidden rounded-[1rem] border border-stone-900/20 bg-stone-100">
      {!loaded ? <div className="embed-skeleton" /> : null}
      <iframe
        className={`min-h-[24rem] w-full transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-popups allow-same-origin allow-scripts"
        src={trustedEmbedUrl}
        title={title}
      />
    </div>
  );
}
