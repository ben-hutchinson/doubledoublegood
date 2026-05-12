import Image from 'next/image';

import { ContentCard } from '@/components/content-card';
import { InstagramReelPanel } from '@/components/instagram-reel-panel';
import {
  businessDetails,
  homeWhatWeDo,
  integrationSettings,
} from '@/lib/site-content';

export default function HomePage() {
  return (
    <section className="space-y-10 py-2 lg:space-y-12 lg:py-4">
      <h1 className="sr-only">{businessDetails.name}</h1>
      <div className="surface-stack space-y-8">
        <section>
          <div className="grid gap-6 xl:grid-cols-[1.03fr_0.97fr] xl:items-stretch">
            <div className="space-y-4 xl:flex xl:h-full xl:flex-col">
              <ContentCard title={homeWhatWeDo.heading}>
                <p>{homeWhatWeDo.intro}</p>
                <p className="heading-sub text-xs font-bold text-stone-500 uppercase">
                  {homeWhatWeDo.stockHeading}
                </p>
                <ul className="list-disc space-y-3 pl-5">
                  {homeWhatWeDo.stockItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{homeWhatWeDo.buyParagraph}</p>
                <p>{homeWhatWeDo.closing}</p>
              </ContentCard>
              <InstagramReelPanel
                className="xl:flex-1"
                embedMinHeightClass="h-[24rem] sm:h-[28rem] xl:h-[44rem]"
                embedUrl={integrationSettings.instagramReelEmbedUrl}
                fillAvailableHeight
                heading="New stock"
                showTopBorder={false}
              />
            </div>

            <div className="media-zoom rounded-[1.2rem] xl:h-full">
              <Image
                alt={homeWhatWeDo.shopfrontImage.alt}
                className="h-full min-h-[30rem] w-full rounded-[1.2rem] object-cover xl:min-h-full"
                height={homeWhatWeDo.shopfrontImage.height}
                sizes="(min-width: 1280px) 44vw, 100vw"
                src={homeWhatWeDo.shopfrontImage.src}
                style={{
                  objectPosition: homeWhatWeDo.shopfrontImage.objectPosition,
                }}
                width={homeWhatWeDo.shopfrontImage.width}
              />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
