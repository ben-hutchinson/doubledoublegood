'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type CarouselItem = {
  alt: string;
  src: string;
};

type ImageCarouselProps = {
  items: CarouselItem[];
  className?: string;
  imageClassName?: string;
  showCounter?: boolean;
  showTopBorder?: boolean;
};

export function ImageCarousel({
  items,
  className,
  imageClassName,
  showCounter = true,
  showTopBorder = true,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);

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
  const shouldAutoRotate =
    hasMultipleItems &&
    !prefersReducedMotion &&
    !isHoverPaused &&
    !isFocusPaused;

  useEffect(() => {
    if (!shouldAutoRotate) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [items.length, shouldAutoRotate]);

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
    'media-zoom relative overflow-hidden rounded-[1.2rem] border border-stone-900/12 bg-stone-100',
    imageClassName ?? 'h-[30rem]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      aria-label="Shop image carousel"
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
      <div className="space-y-4">
        <div className={imageShellClassName}>
          {items.map((item, itemIndex) => (
            <Image
              fill
              key={item.src}
              alt={item.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                itemIndex === safeIndex ? 'opacity-100' : 'opacity-0'
              }`}
              loading={itemIndex === 0 ? 'eager' : undefined}
              sizes="(min-width: 1280px) 62vw, 100vw"
              src={item.src}
            />
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showCounter ? (
            <p
              aria-live="polite"
              className="text-sm font-semibold text-stone-500"
            >
              {safeIndex + 1} / {items.length}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
