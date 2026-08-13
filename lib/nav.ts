export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

// Mirrors the original site's primary menu exactly (confirmed against the
// recovered Wayback snapshot's nav markup, including the Brands / For
// Fishing Type dropdowns).
export const NAV_LINKS: NavLink[] = [
  { label: "Portable Fish Finders", href: "/" },
  {
    label: "Brands",
    href: "/brands/",
    children: [
      { label: "Garmin", href: "/garmin-fish-finders/" },
      { label: "Lowrance", href: "/lowrance-fish-finders/" },
      { label: "Humminbird", href: "/best-humminbird-fish-finder/" },
      { label: "Deeper Pro", href: "/best-deeper-pro-fish-finders/" },
    ],
  },
  {
    label: "For Fishing Type",
    href: "/fishing-types/",
    children: [
      { label: "Best For Kayak Fishing", href: "/best-kayak-fish-finder/" },
      { label: "Best For Ice Fishing", href: "/best-ice-fishing-fish-finder/" },
      { label: "Best For Small Boats", href: "/fish-finders-for-small-boat/" },
    ],
  },
  { label: "Tips & Tricks", href: "/tips-tricks/" },
];

export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Disclaimer", href: "/desclaimer/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];
