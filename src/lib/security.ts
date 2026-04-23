export const trustedHostnames = {
  beehiivEmbedScript: ['subscribe-forms.beehiiv.com'],
  beehiivForm: ['subscribe-forms.beehiiv.com'],
  contactFormEndpoint: ['formspree.io'],
  instagramEmbed: ['www.instagram.com'],
  mapEmbed: ['www.google.com'],
  reviewsEmbed: ['widget.elfsight.com', 'apps.elfsight.com', 'www.google.com'],
  reviewsScript: ['elfsightcdn.com'],
} as const;

type TrustedUrlOptions = {
  allowedHostnames?: readonly string[];
  allowSubdomains?: boolean;
};

function isAllowedHostname(
  hostname: string,
  allowedHostnames: readonly string[],
  allowSubdomains: boolean,
): boolean {
  if (allowedHostnames.length === 0) {
    return true;
  }

  return allowedHostnames.some((allowedHostname) => {
    if (hostname === allowedHostname) {
      return true;
    }

    return allowSubdomains && hostname.endsWith(`.${allowedHostname}`);
  });
}

export function getTrustedExternalUrl(
  rawValue: string,
  options: TrustedUrlOptions = {},
): string {
  const normalizedValue = rawValue.trim();

  if (!normalizedValue) {
    return '';
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(normalizedValue);
  } catch {
    return '';
  }

  if (parsedUrl.protocol !== 'https:') {
    return '';
  }

  const normalizedHostname = parsedUrl.hostname.toLowerCase();
  const allowSubdomains = options.allowSubdomains ?? false;

  if (
    options.allowedHostnames &&
    !isAllowedHostname(
      normalizedHostname,
      options.allowedHostnames,
      allowSubdomains,
    )
  ) {
    return '';
  }

  return parsedUrl.toString();
}

export function getTrustedSiteUrl(
  rawValue: string,
  fallbackUrl: string,
): string {
  return getTrustedExternalUrl(rawValue) || fallbackUrl;
}

export function safeJsonLdStringify(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
