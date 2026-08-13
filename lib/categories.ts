export type Category = {
  slug: string;
  /** Label used in navigation. */
  label: string;
  /** Show as a dropdown in the primary nav. */
  inNav: boolean;
  posts: string[];
};

// Single source of truth for site structure. Navigation, the /guides/ index
// and category pages are all derived from this, so adding an article here is
// enough to surface it everywhere — no separate nav edit to forget.
export const CATEGORIES: Record<string, Category> = {
  "live-sonar": {
    slug: "live-sonar",
    label: "Live Sonar",
    inNav: true,
    posts: ["livescope-vs-activetarget-vs-mega-live"],
  },
  brands: {
    slug: "brands",
    label: "Brands",
    inNav: true,
    posts: [
      "garmin-fish-finders",
      "lowrance-fish-finders",
      "best-humminbird-fish-finder",
      "best-deeper-pro-fish-finders",
    ],
  },
  "fishing-types": {
    slug: "fishing-types",
    label: "For Fishing Type",
    inNav: true,
    posts: ["best-kayak-fish-finder", "best-ice-fishing-fish-finder", "fish-finders-for-small-boat"],
  },
  "tips-tricks": {
    slug: "tips-tricks",
    label: "Tips & Tricks",
    inNav: true,
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

/** Category a given post belongs to, for breadcrumbs and related posts. */
export function categoryForPost(postSlug: string): Category | null {
  return Object.values(CATEGORIES).find((c) => c.posts.includes(postSlug)) ?? null;
}

/** Every post that appears in at least one category. */
export function allCategorisedPosts(): string[] {
  return Object.values(CATEGORIES).flatMap((c) => c.posts);
}
