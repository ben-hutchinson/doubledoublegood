export type NavigationItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
  icon:
    | 'facebook'
    | 'instagram'
    | 'x'
    | 'discogs'
    | 'email'
    | 'phone';
};

export type AboutHighlight = {
  label: string;
  value: string;
};

export type CarouselImage = {
  alt: string;
  src: string;
};

export type PolicySection = {
  heading: string;
  paragraphs: string[];
};

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
  canonicalSiteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://doubledoublegood.co.uk',
};

export const headerContent = {
  logoAlt: 'Double Double Good Music Emporium',
  strapline: "Stafford's Independent Record Shop",
};

export const navigationItems: NavigationItem[] = [
  { href: '/about', label: 'About' },
  { href: '/find-us', label: 'Find Us' },
  { href: '/sell', label: 'Sell Your Vinyl' },
  { href: '/contact', label: 'Contact' },
  { href: '/reviews', label: 'Reviews' },
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
  beehiivEmbedScriptUrl: 'https://subscribe-forms.beehiiv.com/embed.js',
  beehiivFormUrl:
    process.env.NEXT_PUBLIC_BEEHIIV_FORM_URL ??
    'https://subscribe-forms.beehiiv.com/76ad9125-803e-4eae-98f9-d77178150405',
  mapEmbedUrl: businessDetails.mapEmbedUrl,
  reviewsEmbedUrl: process.env.NEXT_PUBLIC_REVIEWS_EMBED_URL ?? '',
  reviewsWidgetId:
    process.env.NEXT_PUBLIC_REVIEWS_WIDGET_ID ??
    '5c9dd34d-87e7-4dbe-828b-63797bbbfcbb',
  reviewsScriptUrl:
    process.env.NEXT_PUBLIC_REVIEWS_SCRIPT_URL ??
    'https://elfsightcdn.com/platform.js',
  instagramReelEmbedUrl:
    'https://www.instagram.com/reel/DW-7Ec3DP10/embed/captioned/',
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
    alt: 'Rows of vinyl records in wooden crates',
    src: 'https://picsum.photos/seed/vinyl-shop-1/1800/1200',
  },
  {
    alt: 'Close-up of records and turntable details',
    src: 'https://picsum.photos/seed/vinyl-shop-2/1800/1200',
  },
  {
    alt: 'Record sleeves lined up on a display wall',
    src: 'https://picsum.photos/seed/vinyl-shop-3/1800/1200',
  },
  {
    alt: 'Music browsing atmosphere with stacked LPs',
    src: 'https://picsum.photos/seed/vinyl-shop-4/1800/1200',
  },
];

export const aboutContent = {
  title: 'About',
  shopHeading: 'The Shop',
  shopSubheading: 'Inside the High House',
  shopParagraphs: [
    'Our Record Shop is fortunate to be based in the Ancient High House Stafford, a Grade II listed building, which was built in around 1595. The timber framed building is reputed to be the largest surviving town house in England from the Tudor period.',
    'We have over 20,000 second hand records for you to browse at your leisure.',
    'We also stock new and sealed records plus second hand CDs. All genres catered for including Rock, Pop, Soul, Indie, Punk, Blues, Metal, Reggae, Folk & Jazz on all formats (7″, 12″, LPs & CDs). You’ll find an eclectic mix to browse and dig.',
    'So come and find your next vinyl gem here at the Double Good.',
  ],
  ownerHeading: 'The Owner',
  ownerSubheading: 'The person behind the counter',
  ownerParagraphs: [
    'Use this space to share the owner story in your own words, from early music influences through to opening the shop in Stafford.',
    'A short first-person paragraph about what the shop means to the local community works well here.',
    'You can also add details about favourite genres, buying philosophy, and what customers can expect when they visit.',
  ],
};

export const aboutHighlights: AboutHighlight[] = [
  { label: 'Home Since', value: 'Ancient High House, Stafford' },
  { label: 'Building Era', value: 'Late 16th century' },
  { label: 'Stock Focus', value: '20,000+ second-hand records' },
  { label: 'Formats', value: 'LPs, 12", 7", and CDs' },
];

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
    'Do you have records that you no longer listen to?',
    'All records have different values. Generally, the more copies that the records has sold, the less value it has.',
    'We buy all types of records and can offer you Cash or a transfer via PayPal for them. Just get in touch via the contact form, email or phone. Home collections can also be arranged!',
  ],
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
  cards: [
    { label: 'Phone', value: businessDetails.phone },
    { label: 'Email', value: businessDetails.email },
    { label: 'Hours', value: businessDetails.weeklyOpeningHours.join('\n') },
    { label: 'Address', value: businessDetails.addressLines.join('\n') },
  ],
};

export const reviewsContent = {
  title: 'Reviews',
};

export const siteRoutes = [
  '/',
  '/about',
  '/find-us',
  '/sell',
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
    heading: 'Delivery',
    paragraphs: [
      'This V1 website is informational and does not offer an online checkout.',
      'If a delivery is arranged directly with the shop, postage options, costs, and timing will be confirmed with you before anything is sent.',
    ],
  },
  {
    heading: 'Returns',
    paragraphs: [
      'If there is a problem with something you have bought, please contact the shop first by email, phone, or the contact form.',
      'Include your name, what you bought, and the issue so the shop can talk you through the next step.',
    ],
  },
  {
    heading: 'Questions before you buy',
    paragraphs: [
      'If you need help with formats, condition, or availability, get in touch before you travel and the shop will do its best to help.',
    ],
  },
];

export const privacySections: PolicySection[] = [
  {
    heading: 'What we collect',
    paragraphs: [
      'If you use the contact form, the shop receives the name, email address, optional phone number, and message that you submit.',
      'If you use the mailing-list form, the shop receives the email address you provide for updates you have asked for.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'Contact-form details are used to reply to your enquiry and keep track of your message.',
      'Mailing-list details are used to send occasional shop updates and nothing more.',
    ],
  },
  {
    heading: 'Third-party services',
    paragraphs: [
      'The site can send form submissions through a configured third-party form provider and can load third-party content on the Find Us and Reviews pages.',
      'Those services may process technical information such as your IP address, browser details, and the page you visited in order to display their content.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'If you want to ask about, update, or remove information you have sent through the site, contact the shop directly at thedoublegood@gmail.com.',
    ],
  },
];
