import { CATEGORIES, categoryForPost } from "@/lib/categories";
import { getArticle } from "@/lib/content";
import PostCard from "@/components/PostCard";

const MAX_RELATED = 3;

/**
 * Related articles shown at the end of a post. Prefers siblings from the same
 * category, then tops up from other categories so short categories still fill
 * the row. Raises pages per session (which raises display-ad revenue) and
 * spreads internal link equity.
 */
export default function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const own = categoryForPost(currentSlug);

  const siblings = (own?.posts ?? []).filter((s) => s !== currentSlug);
  const others = Object.values(CATEGORIES)
    .filter((c) => c.slug !== own?.slug)
    .flatMap((c) => c.posts);

  const chosen: string[] = [];
  for (const slug of [...siblings, ...others]) {
    if (chosen.length >= MAX_RELATED) break;
    if (slug !== currentSlug && !chosen.includes(slug)) chosen.push(slug);
  }

  const posts = chosen
    .map((slug) => {
      const article = getArticle(slug);
      return article ? { slug, frontmatter: article.frontmatter } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (posts.length === 0) return null;

  return (
    <section className="mt-14 border-t border-surface-muted pt-10">
      <h2
        className="mb-6 text-2xl"
        style={{ fontFamily: "var(--font-heading-alt)", color: "var(--color-heading-2)" }}
      >
        Keep Reading
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} slug={post.slug} frontmatter={post.frontmatter} />
        ))}
      </div>
    </section>
  );
}
