import { ImageCarousel } from '@/components/image-carousel';
import { homePurchaseFeature } from '@/lib/site-content';

export function HomePurchaseFeature() {
  return (
    <aside
      className="flex h-full flex-col gap-4"
      aria-label="Getdown Services sold-out event"
    >
      <ImageCarousel
        ariaLabel={homePurchaseFeature.ariaLabel}
        className="xl:flex-1"
        contentClassName="space-y-4 xl:flex xl:h-full xl:flex-col"
        header={
          <h2 className="heading-section text-2xl font-black text-stone-950 uppercase">
            {homePurchaseFeature.heading}
          </h2>
        }
        imageClassName="h-[38rem] sm:h-[48rem] xl:h-auto xl:min-h-[48rem] xl:flex-1"
        imageFit="contain"
        imageSizes="(min-width: 1280px) 44vw, 100vw"
        items={homePurchaseFeature.slides}
        overlay={
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -mt-[50px] -translate-y-1/2 border-y border-white/50 bg-[#ba2b20] px-4 py-4 text-center text-3xl font-black tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:py-5 sm:text-5xl"
            data-sold-out-banner
          >
            {homePurchaseFeature.soldOutLabel}
          </div>
        }
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
