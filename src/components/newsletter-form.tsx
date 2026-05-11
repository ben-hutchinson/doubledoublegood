'use client';

import { useEffect, useRef } from 'react';

import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';
import { integrationSettings } from '@/lib/site-content';

export function NewsletterForm() {
  const embedShellRef = useRef<HTMLDivElement>(null);
  const trustedScriptUrl = getTrustedExternalUrl(
    integrationSettings.beehiivEmbedScriptUrl,
    {
      allowedHostnames: trustedHostnames.beehiivEmbedScript,
    },
  );

  useEffect(() => {
    const embedShell = embedShellRef.current;

    if (!embedShell || !trustedScriptUrl || !integrationSettings.beehiivFormId) {
      return;
    }

    if (!embedShell.querySelector('script[data-beehiiv-form]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = trustedScriptUrl;
      script.dataset.beehiivForm = integrationSettings.beehiivFormId;
      embedShell.prepend(script);
    }

    if (!document.body) {
      return;
    }

    const labelBeehiivFrames = () => {
      document
        .querySelectorAll<HTMLIFrameElement>(
          'iframe[src^="https://subscribe-forms.beehiiv.com"]',
        )
        .forEach((iframe) => {
          iframe.title = 'Join the Double Double Good mailing list';
        });
    };

    labelBeehiivFrames();

    const observer = new MutationObserver(labelBeehiivFrames);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [trustedScriptUrl]);

  if (!trustedScriptUrl || !integrationSettings.beehiivFormId) {
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
    <div
      className="embed-shell min-h-[47px] w-full max-w-[25rem] overflow-hidden"
      ref={embedShellRef}
    >
      <div className="embed-skeleton" />
    </div>
  );
}
