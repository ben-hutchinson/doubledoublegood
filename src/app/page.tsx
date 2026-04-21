import { ImageCarousel } from '@/components/image-carousel';
import { InstagramReelPanel } from '@/components/instagram-reel-panel';
import {
  businessDetails,
  carouselItems,
  homeIntro,
  integrationSettings,
} from '@/lib/site-content';

export default function HomePage() {
  return (
    <section className="space-y-10 py-2 lg:space-y-12 lg:py-4">
      <h1 className="sr-only">{businessDetails.name}</h1>
      <div className="surface-stack space-y-8">
        <section className="space-y-4">
          <p className="measure max-w-3xl text-lg leading-8 text-stone-800">
            {homeIntro.paragraphs[0]}
          </p>
          <p className="measure max-w-3xl text-base leading-7 text-stone-700">
            {homeIntro.paragraphs[1]}
          </p>
        </section>
        <section>
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <ImageCarousel items={carouselItems} />
            <InstagramReelPanel
              embedUrl={integrationSettings.instagramReelEmbedUrl}
            />
          </div>
        </section>
      </div>
    </section>
  );
}
