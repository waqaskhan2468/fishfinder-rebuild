import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { getArticle, type ArticleFrontmatter } from "@/lib/content";

export default function CategoryView({
  title,
  description,
  postSlugs,
}: {
  title: string;
  description: string;
  postSlugs: string[];
}) {
  const posts = postSlugs
    .map((slug) => {
      const article = getArticle(slug);
      return article ? { slug, frontmatter: article.frontmatter as ArticleFrontmatter } : null;
    })
    .filter((p): p is { slug: string; frontmatter: ArticleFrontmatter } => p !== null);

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <div>
          <h1
            className="mb-3 text-3xl leading-tight md:text-4xl"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
          >
            {title}
          </h1>
          <p className="mb-8 max-w-2xl text-ink-muted">{description}</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} slug={post.slug} frontmatter={post.frontmatter} />
            ))}
          </div>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
