import { CATEGORIES } from "@/lib/categories";
import { getArticle } from "@/lib/content";

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

/** Longest a dropdown gets before we stop listing and link to the hub. */
const MAX_DROPDOWN_ITEMS = 6;

/**
 * Short nav label for a post. Article titles are written for search results
 * ("Best Fish Finder for Kayak - Honest Review and Buying Guide") and are far
 * too long for a dropdown, so trim at the first separator.
 */
function navLabel(title: string): string {
  return title.split(/\s+[-–—|:]\s+/)[0].trim();
}

/**
 * Builds the primary navigation from the category registry. Server-side only
 * (reads content from disk) — pass the result into client components.
 */
export function getNavigation(): NavItem[] {
  const items: NavItem[] = [{ label: "Portable Fish Finders", href: "/" }];

  for (const category of Object.values(CATEGORIES)) {
    if (!category.inNav) continue;

    const children: NavChild[] = category.posts
      .slice(0, MAX_DROPDOWN_ITEMS)
      .map((slug) => {
        const article = getArticle(slug);
        if (!article) return null;
        return { label: navLabel(article.frontmatter.title), href: `/${slug}/` };
      })
      .filter((c): c is NavChild => c !== null);

    if (category.posts.length > MAX_DROPDOWN_ITEMS) {
      children.push({ label: `View all ${category.label} →`, href: `/${category.slug}/` });
    }

    items.push({
      label: category.label,
      href: `/${category.slug}/`,
      children: children.length > 0 ? children : undefined,
    });
  }

  items.push({
    label: "Tools",
    href: "/tools/",
    children: [
      { label: "Compatibility Checker", href: "/fish-finder-compatibility-checker/" },
      { label: "Which Should I Buy? Quiz", href: "/which-fish-finder-should-i-buy/" },
    ],
  });
  items.push({ label: "All Guides", href: "/guides/" });
  return items;
}

export const FOOTER_LINKS: NavChild[] = [
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Disclaimer", href: "/desclaimer/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];
