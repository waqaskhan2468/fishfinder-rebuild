import type { Metadata } from "next";
import { getHome } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { websiteSchema } from "@/lib/schema";
import ArticleView from "@/components/ArticleView";
import JsonLd from "@/components/JsonLd";

export function generateMetadata(): Metadata {
  const { frontmatter } = getHome();
  return buildMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: "/",
    image: frontmatter.image,
  });
}

export default function HomePage() {
  const { frontmatter, content } = getHome();
  return (
    <>
      {/* The homepage is the site entity, not an Article. */}
      <JsonLd data={websiteSchema()} />
      <ArticleView frontmatter={frontmatter} content={content} />
    </>
  );
}
