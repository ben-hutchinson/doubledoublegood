import Link from 'next/link';

import { ImageCarousel } from '@/components/image-carousel';
import {
  homePurchaseFeature,
  type HomePurchaseOffer,
} from '@/lib/site-content';

type PurchaseLinkProps = {
  offer: HomePurchaseOffer;
};

export function PurchaseLink({ offer }: PurchaseLinkProps) {
  const className =
    'inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/25 bg-[#ba2b20] px-3 py-2 text-center text-xs font-black tracking-[0.08em] text-white uppercase shadow-lg shadow-black/20 sm:text-sm';

  if (!offer.href) {
    return (
      <span
        aria-disabled="true"
        className={`${className} cursor-not-allowed opacity-65`}
        title="This purchase option is not available yet"
      >
        {offer.label}
        <span className="sr-only"> unavailable</span>
      </span>
    );
  }

  return (
    <a
      className={`${className} hover:-translate-y-0.5 hover:bg-[#9f2118]`}
      href={offer.href}
    >
      {offer.label}
    </a>
  );
}

function PurchaseOverlay() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent px-3 pt-12 pb-3 sm:px-4 sm:pt-16 sm:pb-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {homePurchaseFeature.offers.map((offer) => (
          <PurchaseLink key={offer.label} offer={offer} />
        ))}
      </div>
    </div>
  );
}

export function HomePurchaseFeature() {
  return (
    <aside
      className="flex h-full flex-col gap-4"
      aria-label="Getdown Services event purchase"
    >
      <ImageCarousel
        ariaLabel={homePurchaseFeature.ariaLabel}
        className="min-h-[38rem] flex-1 sm:min-h-[48rem] xl:min-h-0"
        contentClassName="h-full"
        imageClassName="h-[38rem] sm:h-[48rem] xl:h-full xl:min-h-[48rem]"
        imageElementClassName="pb-20 sm:pb-24"
        imageFit="contain"
        imageSizes="(min-width: 1280px) 44vw, 100vw"
        items={homePurchaseFeature.slides}
        overlay={<PurchaseOverlay />}
        preloadAllImages
        rotationIntervalMs={homePurchaseFeature.rotationIntervalMs}
        showCounter={false}
        showPlaybackControl
        showTopBorder={false}
        zoomOnHover={false}
      />

      <div className="space-y-2 text-sm leading-6 text-stone-700">
        <p>{homePurchaseFeature.note}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-2">
          {homePurchaseFeature.policyLinks.map((item) => (
            <Link
              className="link-sweep font-semibold"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </p>
      </div>
    </aside>
  );
}
