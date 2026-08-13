import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getPostSlugs, getPageSlugs } from "@/lib/content";
import { CATEGORIES, isCategorySlug } from "@/lib/categories";
import { buildMetadata } from "@/lib/seo";
import ArticleView from "@/components/ArticleView";
import CategoryView from "@/components/CategoryView";

export function generateStaticParams() {
  return [...getPostSlugs(), ...getPageSlugs()].map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    path: `/${slug}/`,
    image: article.frontmatter.image,
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  if (isCategorySlug(slug)) {
    return (
      <CategoryView
        title={article.frontmatter.title}
        description={article.frontmatter.description}
        postSlugs={CATEGORIES[slug].posts}
      />
    );
  }

  return <ArticleView frontmatter={article.frontmatter} content={article.content} />;
}
