'use client';

import Script from 'next/script';
import { useState } from 'react';

import { integrationSettings } from '@/lib/site-content';

export function NewsletterForm() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="embed-shell w-full max-w-[36rem] overflow-hidden rounded-[0.7rem]">
      <Script
        async
        src={integrationSettings.beehiivEmbedScriptUrl}
        strategy="afterInteractive"
      />
      {!loaded ? <div className="embed-skeleton" /> : null}
      <iframe
        className={`beehiiv-embed block w-full max-w-full border-0 transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        data-test-id="beehiiv-embed"
        frameBorder="0"
        onLoad={() => setLoaded(true)}
        scrolling="no"
        src={integrationSettings.beehiivFormUrl}
        style={{
          width: '100%',
          height: '207px',
          margin: '0',
          borderRadius: '0',
          backgroundColor: 'transparent',
          boxShadow: '0 0 #0000',
        }}
        title="Join the Double Double Good mailing list"
      />
    </div>
  );
}
