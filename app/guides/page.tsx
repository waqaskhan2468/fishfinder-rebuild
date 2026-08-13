import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getArticle, getPostSlugs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

const TITLE = "All Fish Finder Guides & Reviews";
const DESCRIPTION =
  "Every fish finder guide and review on Best Fish Finders Today — live sonar, brand reviews, guides by fishing type, and how-to tips.";

export function generateMetadata(): Metadata {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/guides/" });
}

export default function GuidesPage() {
  const categorised = new Set(Object.values(CATEGORIES).flatMap((c) => c.posts));
  // Anything not filed under a category still needs a route in — otherwise it
  // becomes an orphan page that only the sitemap knows about.
  const uncategorised = getPostSlugs().filter((slug) => !categorised.has(slug));

  const sections = [
    ...Object.values(CATEGORIES).map((c) => ({
      key: c.slug,
      label: c.label,
      href: `/${c.slug}/`,
      posts: c.posts,
    })),
    ...(uncategorised.length
      ? [{ key: "more", label: "More Guides", href: null, posts: uncategorised }]
      : []),
  ];

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <div>
          <h1
            className="mb-3 text-3xl leading-tight md:text-4xl"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
          >
            {TITLE}
          </h1>
          <p className="mb-10 max-w-2xl text-ink-muted">{DESCRIPTION}</p>

          {sections.map((section) => {
            const posts = section.posts
              .map((slug) => {
                const article = getArticle(slug);
                return article ? { slug, frontmatter: article.frontmatter } : null;
              })
              .filter((p): p is NonNullable<typeof p> => p !== null);

            if (posts.length === 0) return null;

            return (
              <section key={section.key} className="mb-12">
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2
                    className="text-2xl"
                    style={{
                      fontFamily: "var(--font-heading-alt)",
                      color: "var(--color-heading-2)",
                    }}
                  >
                    {section.label}
                  </h2>
                  {section.href && (
                    <Link href={section.href} className="text-sm text-link hover:text-accent">
                      View hub →
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard key={post.slug} slug={post.slug} frontmatter={post.frontmatter} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
