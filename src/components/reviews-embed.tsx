'use client';

import { useEffect, useMemo, useState } from 'react';

import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';

type ReviewsEmbedProps = {
  iframeUrl?: string;
  widgetId?: string;
};

const DEFAULT_ELFSIGHT_SCRIPT_URL = 'https://elfsightcdn.com/platform.js';

export function ReviewsEmbed({ iframeUrl, widgetId }: ReviewsEmbedProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const normalizedWidgetId = widgetId?.trim() ?? '';
  const normalizedIframeUrl = iframeUrl?.trim() ?? '';
  const trustedIframeUrl = useMemo(
    () =>
      getTrustedExternalUrl(normalizedIframeUrl, {
        allowedHostnames: trustedHostnames.reviewsEmbed,
      }),
    [normalizedIframeUrl],
  );
  const trustedScriptUrl = getTrustedExternalUrl(DEFAULT_ELFSIGHT_SCRIPT_URL, {
    allowedHostnames: trustedHostnames.reviewsScript,
  });

  const widgetClassName = useMemo(() => {
    if (!normalizedWidgetId) {
      return '';
    }

    return normalizedWidgetId.startsWith('elfsight-app-')
      ? normalizedWidgetId
      : `elfsight-app-${normalizedWidgetId}`;
  }, [normalizedWidgetId]);

  useEffect(() => {
    if (!widgetClassName || !trustedScriptUrl) {
      return;
    }

    const existingScript = document.getElementById('reviews-widget-script');

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'reviews-widget-script';
    script.src = trustedScriptUrl;
    script.async = true;
    document.body.appendChild(script);
  }, [trustedScriptUrl, widgetClassName]);

  useEffect(() => {
    if (!widgetClassName) {
      return;
    }

    const container = document.querySelector(`.${widgetClassName}`);

    if (!container) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (container.childNodes.length > 0) {
        setWidgetLoaded(true);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [widgetClassName]);

  if (trustedIframeUrl) {
    return (
      <section className="border-t border-stone-900/12 pt-6">
        <div className="embed-shell min-h-[32rem] w-full rounded-[1rem] border border-stone-900/12 bg-white">
          {!iframeLoaded ? <div className="embed-skeleton" /> : null}
          <iframe
            className={`min-h-[32rem] w-full rounded-[1rem] border border-stone-900/12 bg-white transition-opacity duration-300 ${
              iframeLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            src={trustedIframeUrl}
            title="Double Double Good Music Emporium Google reviews"
          />
        </div>
      </section>
    );
  }

  if (widgetClassName) {
    return (
      <section className="border-t border-stone-900/12 pt-6">
        <div className="embed-shell min-h-[32rem] rounded-[1rem] border border-stone-900/12 bg-white p-3">
          {!widgetLoaded ? <div className="embed-skeleton" /> : null}
          <div className={widgetClassName} data-elfsight-app-lazy />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 border-t border-stone-900/12 pt-6">
      <p className="max-w-2xl text-base leading-7 text-stone-700">
        The widget area is ready. Once a trusted provider widget ID or embed URL
        is configured, live Google reviews will render here without changing the
        page layout.
      </p>
    </section>
  );
}
