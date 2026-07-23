'use client';

import Image from 'next/image';
import { type ReactNode, useEffect, useState } from 'react';

type CarouselItem = {
  alt: string;
  objectPosition?: string;
  src: string;
};

type ImageCarouselProps = {
  ariaLabel?: string;
  contentClassName?: string;
  footer?: ReactNode;
  items: CarouselItem[];
  className?: string;
  imageClassName?: string;
  imageElementClassName?: string;
  imageFit?: 'contain' | 'cover';
  imageSizes?: string;
  overlay?: ReactNode;
  preloadAllImages?: boolean;
  rotationIntervalMs?: number;
  showBottomScrim?: boolean;
  showCounter?: boolean;
  showPlaybackControl?: boolean;
  showTopBorder?: boolean;
  zoomOnHover?: boolean;
};

export function ImageCarousel({
  ariaLabel = 'Shop image carousel',
  contentClassName = 'space-y-4',
  footer,
  items,
  className,
  imageClassName,
  imageElementClassName,
  imageFit = 'cover',
  imageSizes = '(min-width: 1280px) 62vw, 100vw',
  overlay,
  preloadAllImages = false,
  rotationIntervalMs = 2600,
  showBottomScrim = true,
  showCounter = true,
  showPlaybackControl = false,
  showTopBorder = true,
  zoomOnHover = true,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [playbackPreference, setPlaybackPreference] = useState<
    'default' | 'paused' | 'playing'
  >('default');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  const hasMultipleItems = items.length > 1;
  const isPlaybackPaused =
    playbackPreference === 'paused' ||
    (prefersReducedMotion && playbackPreference !== 'playing');
  const shouldAutoRotate =
    hasMultipleItems && !isPlaybackPaused && !isHoverPaused && !isFocusPaused;

  useEffect(() => {
    if (!shouldAutoRotate) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, rotationIntervalMs);

    return () => window.clearInterval(interval);
  }, [items.length, rotationIntervalMs, shouldAutoRotate]);

  if (items.length === 0) {
    return null;
  }

  const safeIndex = index % items.length;

  const sectionClassName = [
    'section-card space-y-5',
    showTopBorder ? 'border-t border-stone-900/12 pt-6' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const imageShellClassName = [
    zoomOnHover ? 'media-zoom' : '',
    'relative overflow-hidden rounded-[1.2rem] border border-stone-900/12 bg-stone-100',
    imageClassName ?? 'h-[30rem]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={sectionClassName}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocusPaused(false);
        }
      }}
      onFocusCapture={() => setIsFocusPaused(true)}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
    >
      <div className={contentClassName}>
        <div className={imageShellClassName} data-carousel-media>
          {items.map((item, itemIndex) => {
            const isActive = itemIndex === safeIndex;

            return (
              <Image
                fill
                key={item.src}
                alt={item.alt}
                aria-hidden={!isActive}
                className={`absolute inset-0 h-full w-full rounded-[1.2rem] transition-opacity duration-700 ${
                  imageFit === 'contain' ? 'object-contain' : 'object-cover'
                } ${isActive ? 'opacity-100' : 'opacity-0'} ${
                  imageElementClassName ?? ''
                }`}
                loading={
                  preloadAllImages || itemIndex === 0 ? 'eager' : undefined
                }
                sizes={imageSizes}
                src={item.src}
                style={{
                  objectPosition: item.objectPosition ?? '50% 50%',
                }}
              />
            );
          })}
          {showBottomScrim ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
          ) : null}
          {overlay}
          {showPlaybackControl && hasMultipleItems ? (
            <button
              aria-label={isPlaybackPaused ? 'Play carousel' : 'Pause carousel'}
              className="absolute top-3 right-3 z-20 inline-flex min-h-11 items-center justify-center rounded-full border border-white/70 bg-stone-950/80 px-4 text-xs font-bold tracking-[0.12em] text-white uppercase backdrop-blur-sm hover:bg-stone-950"
              type="button"
              onClick={() => {
                setPlaybackPreference(isPlaybackPaused ? 'playing' : 'paused');
              }}
            >
              {isPlaybackPaused ? 'Play' : 'Pause'}
            </button>
          ) : null}
        </div>
        {footer}

        {showCounter ? (
          <div className="flex flex-wrap items-center gap-3">
            <p
              aria-live="polite"
              className="text-sm font-semibold text-stone-500"
            >
              {safeIndex + 1} / {items.length}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
