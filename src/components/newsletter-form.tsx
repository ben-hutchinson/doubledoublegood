'use client';

import Script from 'next/script';
import { useState } from 'react';

import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';
import { integrationSettings } from '@/lib/site-content';

export function NewsletterForm() {
  const [loaded, setLoaded] = useState(false);
  const trustedScriptUrl = getTrustedExternalUrl(
    integrationSettings.beehiivEmbedScriptUrl,
    {
      allowedHostnames: trustedHostnames.beehiivEmbedScript,
    },
  );
  const trustedFormUrl = getTrustedExternalUrl(
    integrationSettings.beehiivFormUrl,
    {
      allowedHostnames: trustedHostnames.beehiivForm,
    },
  );

  if (!trustedFormUrl) {
    return (
      <div className="rounded-[0.7rem] border border-dashed border-stone-900/35 p-5">
        <p className="text-sm leading-6 text-stone-700">
          The mailing-list form is temporarily unavailable while trusted embed
          settings are being verified.
        </p>
      </div>
    );
  }

  return (
    <div className="embed-shell h-[47px] max-h-[47px] w-full max-w-[25rem] overflow-hidden">
      {trustedScriptUrl ? (
        <Script async src={trustedScriptUrl} strategy="afterInteractive" />
      ) : null}
      {!loaded ? <div className="embed-skeleton" /> : null}
      <iframe
        allow="fullscreen"
        className={`beehiiv-embed block h-[47px] max-h-[47px] w-full max-w-full border-0 transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        data-test-id="beehiiv-embed"
        frameBorder="0"
        onLoad={() => setLoaded(true)}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        scrolling="no"
        src={trustedFormUrl}
        style={{
          width: '400px',
          height: '47px',
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
