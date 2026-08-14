import type { ArticleFrontmatter } from "@/lib/content";
import type { FaqItem } from "@/lib/faq";

export const SITE_URL = "https://www.bestfishfinderstoday.com";
export const SITE_NAME = "Best Fish Finders Today";

const PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/2021/08/fishfinder-1.png`,
  },
};

export function articleSchema(frontmatter: ArticleFrontmatter, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    ...(frontmatter.image ? { image: `${SITE_URL}${frontmatter.image}` } : {}),
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${slug}/`,
    },
  };
}

/** Only call when items.length > 0 — empty FAQPage markup is invalid. */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: PUBLISHER,
  };
}
