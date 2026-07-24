import {
  getTrustedExternalUrl,
  getTrustedSiteUrl,
  getTrustedStripePaymentLink,
  shouldAllowStripeTestPaymentLinks,
  trustedHostnames,
} from '@/lib/security';

export type NavigationItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
  icon: 'facebook' | 'instagram' | 'x' | 'discogs' | 'email' | 'phone';
};

export type CarouselImage = {
  alt: string;
  objectPosition?: string;
  src: string;
};

export type PolicySection = {
  heading: string;
  links?: NavigationItem[];
  paragraphs: string[];
};

export type HomePurchaseOffer = {
  href: string;
  label: string;
};

type HomePurchaseFeature = {
  ariaLabel: string;
  description: string[];
  heading: string;
  offer: HomePurchaseOffer;
  rotationIntervalMs: number;
  slides: CarouselImage[];
};

export type CommunityContent = {
  title: string;
  intro: string;
};

export type HeaderOpenStatusBadgeMode = 'schedule' | 'closed';

export type GigTickerEnabledMode = 'enabled' | 'hidden';

export type GigTickerEvent = {
  message: string;
};

type GigTickerVisibilityConfig = {
  enabledMode: GigTickerEnabledMode;
  events: readonly GigTickerEvent[];
};

export function getHeaderOpenStatusBadgeMode(
  value: string | undefined,
): HeaderOpenStatusBadgeMode {
  return value?.toLowerCase() === 'false' ? 'closed' : 'schedule';
}

export function getGigTickerEnabledMode(
  value: string | undefined,
): GigTickerEnabledMode {
  return value?.toLowerCase() === 'false' ? 'hidden' : 'enabled';
}

export function shouldShowGigTicker({
  enabledMode,
  events,
}: GigTickerVisibilityConfig) {
  return enabledMode === 'enabled' && events.length > 0;
}

export const bannedMockupValues = [
  "Stafford's Finest Record Shop",
  '12 Example Street',
  '01785 123456',
  'info@doubledoublegood.co.uk',
  'Sunday: Closed',
  'James B.',
  'Sarah W.',
  'Instagram Embed',
  'Placeholder image area',
  'Use authentic shop photography here before launch',
];

export const businessDetails = {
  name: 'Double Double Good Music Emporium',
  headline: "Stafford's Independent Record Shop",
  addressLine1: '49 Greengate Street',
  city: 'Stafford',
  postcode: 'ST16 2JA',
  addressLines: ['49 Greengate Street', 'Stafford', 'ST16 2JA'],
  fullAddress: '49 Greengate Street, Stafford, ST16 2JA',
  phone: '01785 562657',
  phoneHref: 'tel:01785562657',
  email: 'thedoublegood@gmail.com',
  emailHref: 'mailto:thedoublegood@gmail.com',
  openingHours: 'Tue–Sat, 10am–5pm',
  weeklyOpeningHours: [
    'Monday - CLOSED',
    'Tuesday - 10:00 - 17:00',
    'Wednesday - 10:00 - 17:00',
    'Thursday - 10:00 - 17:00',
    'Friday - 10:00 - 17:00',
    'Saturday - 10:00 - 17:00',
    'Sunday - CLOSED',
  ],
  parking:
    'The shop is close to Stafford Town Centre car parks and is an easy walk from the centre.',
  transport:
    'It is around a 5 minute walk from Stafford train station or Stafford bus station.',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=49%20Greengate%20Street%2C%20Stafford%2C%20ST16%202JA',
  mapEmbedUrl:
    'https://www.google.com/maps?q=49%20Greengate%20Street%2C%20Stafford%2C%20ST16%202JA&z=16&output=embed',
  canonicalSiteUrl: getTrustedSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? '',
    'https://doubledoublegood.co.uk',
  ),
};

export const headerContent = {
  logoAlt: 'Double Double Good Music Emporium',
  strapline: "Stafford's Independent Record Shop",
  openStatusBadgeMode: getHeaderOpenStatusBadgeMode(
    process.env.NEXT_PUBLIC_SHOW_OPEN_STATUS_BADGE,
  ),
  openStatusClosedMessage: 'Shop closed',
};

export const gigTickerContent = {
  enabledMode: getGigTickerEnabledMode(process.env.NEXT_PUBLIC_SHOW_GIG_TICKER),
  eyebrow: 'Shop notice',
  events: [
    {
      message:
        'THE SHOP WILL BE CLOSED SATURDAY 25th JULY REOPENING TUESDAY 28th JULY @1000HRS',
    },
  ] satisfies GigTickerEvent[],
};

export const navigationItems: NavigationItem[] = [
  { href: '/about', label: 'About' },
  { href: '/find-us', label: 'Find Us' },
  { href: '/sell', label: 'Sell Your Vinyl' },
  { href: '/contact', label: 'Contact' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/community', label: 'Community' },
];

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.facebook.com/DoubleGoodMusic/',
    label: 'Facebook',
    icon: 'facebook',
  },
  {
    href: 'https://twitter.com/doublegoodmusic',
    label: 'X',
    icon: 'x',
  },
  {
    href: 'https://www.instagram.com/doublegoodmusic',
    label: 'Instagram',
    icon: 'instagram',
  },
  {
    href: 'https://www.discogs.com/seller/Double_Double_Good/profile',
    label: 'Discogs',
    icon: 'discogs',
  },
  {
    href: businessDetails.emailHref,
    label: 'Email',
    icon: 'email',
  },
  {
    href: businessDetails.phoneHref,
    label: 'Phone',
    icon: 'phone',
  },
];

export const integrationSettings = {
  contactFormEndpoint: getTrustedExternalUrl(
    process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ??
      'https://formspree.io/f/xqenwbzd',
    {
      allowedHostnames: trustedHostnames.contactFormEndpoint,
    },
  ),
  beehiivEmbedScriptUrl: getTrustedExternalUrl(
    'https://subscribe-forms.beehiiv.com/v3/loader.js',
    {
      allowedHostnames: trustedHostnames.beehiivEmbedScript,
    },
  ),
  beehiivFormId:
    process.env.NEXT_PUBLIC_BEEHIIV_FORM_ID ??
    '2c951e96-3dbb-4a70-adfb-bae21efd6b7b',
  mapEmbedUrl: getTrustedExternalUrl(businessDetails.mapEmbedUrl, {
    allowedHostnames: trustedHostnames.mapEmbed,
  }),
  reviewsEmbedUrl: getTrustedExternalUrl(
    process.env.NEXT_PUBLIC_REVIEWS_EMBED_URL ?? '',
    {
      allowedHostnames: trustedHostnames.reviewsEmbed,
    },
  ),
  reviewsWidgetId:
    process.env.NEXT_PUBLIC_REVIEWS_WIDGET_ID ??
    '5c9dd34d-87e7-4dbe-828b-63797bbbfcbb',
  instagramReelEmbedUrl: getTrustedExternalUrl(
    'https://www.instagram.com/reel/Da7MAwpMwwz/embed/',
    {
      allowedHostnames: trustedHostnames.instagramEmbed,
    },
  ),
};

export const homeIntro = {
  title: businessDetails.headline,
  paragraphs: [
    'A warm, independent record shop in the middle of Stafford for second-hand gems, fresh arrivals, and honest music chat.',
    'Drop in for a proper browse, ask about a collection, or use the site to plan your visit before you head into town.',
  ],
};

export const carouselItems: CarouselImage[] = [
  {
    alt: 'Inside Double Double Good with vinyl racks and wall displays',
    objectPosition: '50% 42%',
    src: '/assets/shop-carousel/shop-interior-01.webp',
  },
  {
    alt: 'Wooden record bins arranged through the upper shop floor',
    objectPosition: '50% 38%',
    src: '/assets/shop-carousel/shop-interior-03.webp',
  },
  {
    alt: 'Record crates and display sleeves beside the upper shop doorway',
    objectPosition: '50% 38%',
    src: '/assets/shop-carousel/shop-interior-04.webp',
  },
  {
    alt: 'Rows of vinyl records beneath framed album displays',
    objectPosition: '50% 42%',
    src: '/assets/shop-carousel/shop-interior-05.webp',
  },
  {
    alt: 'Long wall of records and framed sleeves in the shop',
    objectPosition: '50% 40%',
    src: '/assets/shop-carousel/shop-interior-02.webp',
  },
  {
    alt: 'Vinyl crates lining the stairway into the shop',
    objectPosition: '50% 45%',
    src: '/assets/shop-carousel/shop-interior-06.webp',
  },
  {
    alt: 'Shop counter and front window inside the timber-framed building',
    objectPosition: '50% 48%',
    src: '/assets/shop-carousel/shop-interior-09.webp',
  },
  {
    alt: 'Feature display wall with framed posters and new arrivals',
    objectPosition: '50% 42%',
    src: '/assets/shop-carousel/shop-interior-08.webp',
  },
  {
    alt: 'Music press collage wall inside Double Double Good',
    objectPosition: '50% 50%',
    src: '/assets/shop-carousel/shop-interior-07.webp',
  },
  {
    alt: 'Close-up of the music press collage wall',
    objectPosition: '50% 48%',
    src: '/assets/shop-carousel/shop-interior-10.webp',
  },
  {
    alt: 'Music display corner with records, films, and framed artwork',
    objectPosition: '50% 40%',
    src: '/assets/shop-carousel/shop-interior-11.webp',
  },
  {
    alt: 'Display figure and collectibles beside Double Double Good artwork',
    objectPosition: '50% 44%',
    src: '/assets/shop-carousel/shop-interior-12.webp',
  },
  {
    alt: 'Front shop area with counter, record bins, and timber beams',
    objectPosition: '50% 44%',
    src: '/assets/shop-carousel/shop-interior-13.webp',
  },
  {
    alt: 'Entrance area with music collage wall and record bins',
    objectPosition: '50% 44%',
    src: '/assets/shop-carousel/shop-interior-14.webp',
  },
  {
    alt: 'Full-height music collage wall beside timber beams',
    objectPosition: '50% 45%',
    src: '/assets/shop-carousel/shop-interior-15.webp',
  },
  {
    alt: 'Turntables and framed artwork in the listening corner',
    objectPosition: '50% 52%',
    src: '/assets/shop-carousel/shop-interior-16.webp',
  },
];

export const aboutContent = {
  title: 'About',
  shopHeading: 'The Shop',
  shopSubheading: '',
  shopLead: 'Built on a love of music',
  shopParagraphs: [
    'Our story began in 2019, starting from the humble surroundings of a market stall. With nothing more than a carefully curated selection of records and a passion for vinyl, we set out to create something special for fellow music lovers.',
    'What started small quickly grew. As more people discovered us and shared our enthusiasm, we took the next step—moving into our first retail shop on Mill Street. It gave us the space to expand our collection, connect with customers, and build a proper home for digging through records.',
    'Today, our record shop is fortunate to be based in the Ancient High House in Stafford, a Grade II listed building built around 1595. The timber-framed building is reputed to be the largest surviving town house in England from the Tudor period, making it a truly unique setting to explore music across the decades.',
    "From a market stall in 2019 to one of Stafford's most historic buildings, everything we do is rooted in a genuine love for records and the people who collect them.",
  ],
  ownerHeading: 'The Owner',
  ownerImage: {
    alt: 'Lee in the Double Double Good shop',
    height: 1600,
    objectPosition: '50% 24%',
    src: '/lee.jpg',
    width: 1200,
  },
};

export const homeWhatWeDo = {
  heading: 'What we do',
  intro:
    "We buy and sell vinyl records across a wide range of genres and formats. Whether you're searching for something specific or just browsing, there's always something new to discover.",
  stockHeading: 'Our stock includes:',
  stockItems: [
    'New and second-hand vinyl',
    'Albums, singles, and LPs',
    'Genres spanning rock, indie, punk, jazz, soul, funk, reggae, folk and more',
    'Rare, collectible, and everyday classics',
  ],
  buyParagraph:
    "We're always looking to buy records too. Whether you've got a small selection or a full collection, we offer fair prices and a straightforward, honest approach.",
  closing:
    "From our beginnings in 2019 to where we are today, we're proud to be part of Stafford's music community and look forward to welcoming you in.",
};

const allowStripeTestMode = shouldAllowStripeTestPaymentLinks(
  process.env.NODE_ENV,
  process.env.ALLOW_STRIPE_TEST_PAYMENT_LINKS,
);

export const homePurchaseFeature: HomePurchaseFeature = {
  ariaLabel: 'Getdown Services purchase carousel',
  description: [
    "Join us as we celebrate the release of 'Massive Champion', the brand-new album from Getdown Services.",
    "The band will be visiting the shop for a special appearance to mark the launch and we're really looking forward to welcoming them.",
    'Entry is free so long as you purchase the LP below.',
  ],
  heading: 'GETDOWN SERVICES IN-STORE',
  offer: {
    href: getTrustedStripePaymentLink(
      process.env.NEXT_PUBLIC_STRIPE_LP_PAYMENT_LINK,
      { allowTestMode: allowStripeTestMode },
    ),
    label: 'BUY THE LP',
  },
  rotationIntervalMs: 5000,
  slides: [
    {
      alt: 'Getdown Services Massive Champion in-store tour poster, including the Stafford show at Double Double Good on 19 August',
      src: '/assets/home/getdown-tour-pic.jpg',
    },
    {
      alt: 'Getdown Services album artwork featuring a hand-drawn figure on layered notepaper',
      src: '/assets/home/getdown-services-album-art.jpeg',
    },
  ],
};

export const findUsContent = {
  title: 'Find Us',
  infoBlocks: [
    { label: 'Address', value: businessDetails.addressLines.join('\n') },
    {
      label: 'Parking',
      value:
        'Use any Stafford Town Centre car park, then walk a few minutes into the centre.',
    },
    {
      label: 'By Rail or Bus',
      value:
        'About a 5 minute walk from Stafford train station or Stafford bus station.',
    },
  ],
};

export const sellContent = {
  title: 'Sell',
  paragraphs: [
    "If you're thinking about selling, we make it simple.",
    "We're interested in all types of vinyl—from well-loved classics to more obscure finds. Values can vary, but we're always happy to take a look and give you a fair offer.",
  ],
  carouselItems: [
    {
      alt: 'Stacked vinyl records beside headphones',
      objectPosition: '72% 50%',
      src: '/assets/sell-carousel/vinyl-sell-01.webp',
    },
    {
      alt: 'Vinyl records and sleeves spread over a wooden surface',
      objectPosition: '78% 50%',
      src: '/assets/sell-carousel/vinyl-sell-02.webp',
    },
  ],
  carouselRotationMs: 5000,
  buyingList: [
    'LPs and 12-inch singles',
    '7-inch singles',
    'Rare and collectable items',
    'Box sets and larger collections',
    'Mixed-genre collections',
  ],
};

export const contactContent = {
  title: 'Contact',
  getInTouchHeading: 'Get In Touch',
  paragraphs: [
    "We're always happy to talk music—whether you're buying, selling, or just curious.",
    'You can reach us in a way that suits you:',
  ],
  options: [
    'Visit us in-store and browse in person',
    'Give us a call for quick enquiries',
    'Send us an email with details of your records',
    'Use the contact form on our website anytime',
  ],
  outro: 'Or simply drop by and have a dig—you never know what you might find.',
};

export const reviewsContent = {
  title: 'Reviews',
};

export const communityContent: CommunityContent = {
  title: 'Community',
  intro:
    'COMING SOON! Stay tuned for news on the shop and our wider community.',
};

export const siteRoutes = [
  '/',
  '/about',
  '/find-us',
  '/sell',
  '/community',
  '/contact',
  '/reviews',
  '/delivery-returns',
  '/privacy',
] as const;

export const footerContent = {
  addressLines: businessDetails.addressLines,
  newsletterTitle: 'Join the mailing list',
  newsletterCopy:
    'Leave your email if you want occasional updates about new stock and shop news.',
};

export const deliveryReturnsSections: PolicySection[] = [
  {
    heading: 'Prices and ordering',
    paragraphs: [
      'The product price, any applicable tax, and the available fulfilment charges are shown at Stripe Checkout before you pay. Your order is accepted once Stripe confirms successful payment.',
    ],
  },
  {
    heading: 'Collection and UK delivery',
    paragraphs: [
      'Choose “Collect from Double Double Good — free” or the fixed UK delivery option shown at Checkout. The delivery price and estimated timing are displayed before payment.',
      'Please provide an accurate name, email address, and delivery address. We will use those details to fulfil the order or let you know when collection is ready.',
    ],
  },
  {
    heading: 'Cancellation and returns',
    paragraphs: [
      'Unless a legal exception applies, you may tell us that you wish to cancel an online order for physical goods within 14 days of receiving them. After telling us, return the goods within the next 14 days.',
      'You are normally responsible for the direct cost of returning unwanted goods. We will refund the price and the standard outbound delivery charge; an extra amount paid for premium delivery is not refundable. A refund may be reduced if the goods have been handled beyond what is reasonably necessary to inspect them.',
      'Contact the shop before returning anything so we can confirm the return address and next steps. These terms do not limit your statutory rights.',
    ],
    links: [
      {
        href: 'https://www.gov.uk/online-and-distance-selling-for-businesses/distance-selling',
        label: 'GOV.UK distance selling guidance',
      },
    ],
  },
  {
    heading: 'Faults and refunds',
    paragraphs: [
      'If an item is faulty, damaged, or not as described, contact the shop promptly with your name, Stripe receipt or payment reference, and details of the problem. Your rights for faulty goods are separate from the change-of-mind cancellation period.',
      'Approved refunds are returned through Stripe to the original payment method. Bank processing times can vary after the refund is issued.',
    ],
  },
  {
    heading: 'Free gig admission',
    paragraphs: [
      'The advertised gig admission is a free promotional benefit attached to a qualifying purchase. It admits one named purchaser who presents the successful, non-refunded Stripe receipt. Cancelling or refunding the order also cancels any unused admission.',
      'If the gig is cancelled or rescheduled, contact the shop for the event arrangements. The physical-goods cancellation, returns, and fault rights above continue to apply.',
    ],
  },
];

export const privacySections: PolicySection[] = [
  {
    heading: 'What we collect',
    paragraphs: [
      'If you use the contact form, the shop receives the name, email address, optional phone number, and message that you submit.',
      'If you use the mailing-list form, the shop receives the email address you provide for updates you have asked for.',
      'When you buy through a Stripe Payment Link, transaction and fulfilment information can include your name, email address, billing or delivery address, product choice, fulfilment choice, payment status, payment reference, and receipt number.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'Contact-form details are used to reply to your enquiry and keep track of your message.',
      'Mailing-list details are used to send occasional shop updates and nothing more.',
      'Purchase information is used to take payment, fulfil or arrange collection of your order, prepare the named gig-entry list, answer queries, issue refunds, keep financial records, and support fraud prevention.',
    ],
  },
  {
    heading: 'Payments through Stripe',
    paragraphs: [
      'Stripe hosts the payment form and processes the payment information you enter. This website does not receive or store your full card details.',
      'Stripe processes information under its own privacy terms. Review the Stripe Privacy Policy before paying if you want more detail about that processing.',
    ],
    links: [
      {
        href: 'https://stripe.com/gb/privacy',
        label: 'Stripe Privacy Policy',
      },
    ],
  },
  {
    heading: 'Other third-party services',
    paragraphs: [
      'Contact-form submissions are sent to Formspree (form provider) and include your name, email, optional phone number, and message.',
      'The site also loads third-party content from Beehiiv, Google Maps, Instagram, and review widgets. Those services may process technical information such as your IP address, browser details, and the page you visited in order to display their content.',
    ],
  },
  {
    heading: 'Retention and event records',
    paragraphs: [
      'Order records are kept only as long as needed for fulfilment, returns, accounting, fraud prevention, and legal obligations. The gig-entry working list should be securely deleted when it is no longer needed for the event or related queries.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'If you want to ask about, update, or remove information you have sent through the site, contact the shop directly at thedoublegood@gmail.com.',
    ],
  },
];
