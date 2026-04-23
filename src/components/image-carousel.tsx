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

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 3800);

    return () => window.clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

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
    <section className={sectionClassName}>
      <div className="space-y-4">
        <div className={imageShellClassName}>
          {items.map((item, itemIndex) => (
            <Image
              fill
              key={item.src}
              alt={item.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                itemIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
              loading={itemIndex === 0 ? 'eager' : undefined}
              sizes="(min-width: 1280px) 62vw, 100vw"
              src={item.src}
            />
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        {showCounter ? (
          <p className="text-sm font-semibold text-stone-500">
            {index + 1} / {items.length}
          </p>
        ) : null}
      </div>
    </section>
  );
}
