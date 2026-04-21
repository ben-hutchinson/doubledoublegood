'use client';

import { useState } from 'react';

type InstagramReelPanelProps = {
  embedUrl: string;
};

export function InstagramReelPanel({ embedUrl }: InstagramReelPanelProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="section-card space-y-5 border-t border-stone-900/12 pt-6">
      <div>
        <h2 className="heading-section text-2xl font-black text-stone-950 uppercase">
          New stock
        </h2>
      </div>
      <div className="embed-shell overflow-hidden rounded-[1.1rem] border border-stone-900/12 bg-white shadow-[var(--shadow)]">
        {embedUrl ? (
          <>
            {!loaded ? <div className="embed-skeleton" /> : null}
            <iframe
              allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className={`min-h-[40rem] w-full transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              referrerPolicy="strict-origin-when-cross-origin"
              src={embedUrl}
              title="Latest Instagram reel from Double Double Good Music Emporium"
            />
          </>
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
