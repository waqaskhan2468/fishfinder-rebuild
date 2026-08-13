export type Category = {
  slug: string;
  posts: string[];
};

// Mirrors the original site's Brands / For Fishing Type dropdown menus and
// the Tips & Tricks archive — same groupings used in lib/nav.ts.
export const CATEGORIES: Record<string, Category> = {
  brands: {
    slug: "brands",
    posts: [
      "livescope-vs-activetarget-vs-mega-live",
      "garmin-fish-finders",
      "lowrance-fish-finders",
      "best-humminbird-fish-finder",
      "best-deeper-pro-fish-finders",
    ],
  },
  "fishing-types": {
    slug: "fishing-types",
    posts: ["best-kayak-fish-finder", "best-ice-fishing-fish-finder", "fish-finders-for-small-boat"],
  },
  "tips-tricks": {
    slug: "tips-tricks",
    posts: [
      "how-to-read-a-garmin-fish-finder",
      "how-to-understand-the-images-on-the-fish-finder-screen",
      "portable-fish-finders-ultimate-buying-guide",
      "what-is-a-portable-fish-finder-why-should-you-buy-it-in-2021",
    ],
  },
};

export function isCategorySlug(slug: string): boolean {
  return slug in CATEGORIES;
}
