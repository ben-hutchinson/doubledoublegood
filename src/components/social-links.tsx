import type { SocialLink } from '@/lib/site-content';

type SocialLinksProps = {
  links: SocialLink[];
};

function SocialIcon({ icon }: Pick<SocialLink, 'icon'>) {
  if (icon === 'facebook') {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.125rem] w-[1.125rem]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.5 21v-7h2.6l.4-3h-3v-1.9c0-.9.2-1.6 1.5-1.6H17V5a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.2V11H8v3h2.6v7h2.9Z" />
      </svg>
    );
  }

  if (icon === 'instagram') {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.125rem] w-[1.125rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === 'x') {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.125rem] w-[1.125rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 4l16 16" />
        <path d="M20 4 4 20" />
      </svg>
    );
  }

  if (icon === 'discogs') {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.125rem] w-[1.125rem]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="12" cy="12" r="7.2" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="4.6" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="2.4" stroke="#ffffff" strokeWidth="1.1" />
        <circle cx="12" cy="12" r="1.3" fill="#ffffff" />
        <circle cx="12" cy="12" r="0.55" fill="currentColor" />
        <path
          d="M4.5 18.8 9.8 13.5"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="2.6"
        />
        <path
          d="M14.2 10.8 19.5 5.5"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="2.6"
        />
      </svg>
    );
  }

  if (icon === 'email') {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.125rem] w-[1.125rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4.5 7 12 13l7.5-6" />
      </svg>
    );
  }

  if (icon === 'phone') {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.125rem] w-[1.125rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        viewBox="0 0 24 24"
      >
        <path d="M6.9 4.5h2.6l1.2 4-1.8 1.8a15.5 15.5 0 0 0 4.8 4.8l1.8-1.8 4 1.2v2.6a1.8 1.8 0 0 1-1.9 1.8A15.6 15.6 0 0 1 5 6.4a1.8 1.8 0 0 1 1.9-1.9Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-[1.125rem] w-[1.125rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function getButtonClass(icon: SocialLink['icon']) {
  if (icon === 'facebook') {
    return 'header-social-button bg-[#1877f2] text-white hover:bg-[#1662c6]';
  }

  if (icon === 'instagram') {
    return 'header-social-button bg-[#e1306c] text-white hover:bg-[#c72a5f]';
  }

  if (icon === 'x') {
    return 'header-social-button bg-stone-950 text-white hover:bg-stone-800';
  }

  if (icon === 'discogs') {
    return 'header-social-button border-stone-900/65 bg-white text-stone-950 hover:bg-stone-200';
  }

  if (icon === 'email') {
    return 'header-social-button bg-[#ea4335] text-white hover:bg-[#cf392c]';
  }

  return 'header-social-button bg-[#1f8f3a] text-white hover:bg-[#166b2a]';
}

function isExternalLink(href: string) {
  return href.startsWith('http');
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <a
            aria-label={link.label}
            className={getButtonClass(link.icon)}
            href={link.href}
            rel={isExternalLink(link.href) ? 'noreferrer' : undefined}
            target={isExternalLink(link.href) ? '_blank' : undefined}
            title={link.label}
          >
            <SocialIcon icon={link.icon} />
            <span className="sr-only">{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
