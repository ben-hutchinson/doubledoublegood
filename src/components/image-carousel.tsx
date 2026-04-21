'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type CarouselItem = {
  alt: string;
  src: string;
};

type ImageCarouselProps = {
  items: CarouselItem[];
};

export function ImageCarousel({ items }: ImageCarouselProps) {
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

  return (
    <section className="section-card space-y-5 border-t border-stone-900/12 pt-6">
      <div className="space-y-4">
        <div className="media-zoom relative h-[30rem] overflow-hidden rounded-[1.2rem] border border-stone-900/12 bg-stone-100">
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
        <p className="text-sm font-semibold text-stone-500">
          {index + 1} / {items.length}
        </p>
      </div>
    </section>
  );
}
