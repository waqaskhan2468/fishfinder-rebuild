import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { mdxComponents } from "@/components/MdxComponents";
import HeroImage from "@/components/HeroImage";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import { categoryForPost } from "@/lib/categories";
import type { ArticleFrontmatter } from "@/lib/content";

export default function ArticleView({
  frontmatter,
  content,
  slug,
}: {
  frontmatter: ArticleFrontmatter;
  content: string;
  slug?: string;
}) {
  const category = slug ? categoryForPost(slug) : null;

  return (
    <article className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            ...(category ? [{ label: category.label, href: `/${category.slug}/` }] : []),
            { label: frontmatter.title, href: null },
          ]}
        />

        <h1
          className="mb-6 text-3xl leading-tight md:text-4xl"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
        >
          {frontmatter.title}
        </h1>

        <HeroImage src={frontmatter.image} alt={frontmatter.title} />

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          <div className="max-w-3xl">
            <div className="prose-article">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    format: "md",
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeRaw],
                  },
                }}
              />
            </div>

            {slug && <RelatedPosts currentSlug={slug} />}
          </div>

          <Sidebar />
        </div>
      </div>
    </article>
  );
}
