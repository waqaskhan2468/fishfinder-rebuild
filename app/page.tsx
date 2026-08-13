import type { Metadata } from "next";
import { getHome } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import ArticleView from "@/components/ArticleView";

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
  return <ArticleView frontmatter={frontmatter} content={content} />;
}
