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

function PurchaseCallToAction() {
  return (
    <div className="space-y-3" data-purchase-cta>
      <h2 className="heading-section text-2xl font-black text-stone-950 uppercase">
        {homePurchaseFeature.heading}
      </h2>
      {homePurchaseFeature.description.map((paragraph) => (
        <p className="text-sm leading-6 text-stone-700" key={paragraph}>
          {paragraph}
        </p>
      ))}
      <PurchaseLink offer={homePurchaseFeature.offer} />
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
        className="xl:flex-1"
        contentClassName="space-y-4 xl:flex xl:h-full xl:flex-col"
        header={<PurchaseCallToAction />}
        imageClassName="h-[38rem] sm:h-[48rem] xl:h-auto xl:min-h-[48rem] xl:flex-1"
        imageFit="contain"
        imageSizes="(min-width: 1280px) 44vw, 100vw"
        items={homePurchaseFeature.slides}
        preloadAllImages
        rotationIntervalMs={homePurchaseFeature.rotationIntervalMs}
        showBottomScrim={false}
        showCounter={false}
        showTopBorder={false}
        zoomOnHover={false}
      />
    </aside>
  );
}
