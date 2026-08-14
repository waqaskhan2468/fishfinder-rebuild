import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeWrapTables from "@/lib/rehype-wrap-tables";
import { mdxComponents } from "@/components/MdxComponents";
import HeroImage from "@/components/HeroImage";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPosts from "@/components/RelatedPosts";
import JsonLd from "@/components/JsonLd";
import { categoryForPost } from "@/lib/categories";
import { extractFaq } from "@/lib/faq";
import { articleSchema, faqSchema } from "@/lib/schema";
import type { ArticleFrontmatter } from "@/lib/content";

export default function ArticleView({
  frontmatter,
  content,
  slug,
  /** Editorial posts get Article schema; static pages (privacy, contact) and
   *  the homepage should not be described as Articles. */
  isPost = false,
}: {
  frontmatter: ArticleFrontmatter;
  content: string;
  slug?: string;
  isPost?: boolean;
}) {
  const category = slug ? categoryForPost(slug) : null;
  // Only emit FAQPage markup when the article genuinely has an FAQ section —
  // fabricated or empty FAQ schema is a structured-data violation.
  const faq = extractFaq(content);

  return (
    <article className="bg-surface">
      {isPost && slug && <JsonLd data={articleSchema(frontmatter, slug)} />}
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {/* No breadcrumbs on the homepage — it is the root, so a trail
            reading just "Home" adds nothing. */}
        {slug && (
          <Breadcrumbs
            crumbs={[
              { label: "Home", href: "/" },
              ...(category ? [{ label: category.label, href: `/${category.slug}/` }] : []),
              { label: frontmatter.title, href: null },
            ]}
          />
        )}

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
                    rehypePlugins: [rehypeRaw, rehypeWrapTables],
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
