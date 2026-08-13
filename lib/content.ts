import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  slug: string;
  image: string | null;
  date: string;
};

export type Article = {
  frontmatter: ArticleFrontmatter;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") && f !== "home.mdx")
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPageSlugs(): string[] {
  return fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

function readMdx(filePath: string): Article {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as ArticleFrontmatter, content };
}

export function getHome(): Article {
  return readMdx(path.join(POSTS_DIR, "home.mdx"));
}

export function getPost(slug: string): Article | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readMdx(filePath);
}

export function getPage(slug: string): Article | null {
  const filePath = path.join(PAGES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readMdx(filePath);
}

export function getArticle(slug: string): Article | null {
  return getPost(slug) ?? getPage(slug);
}

export function getAllArticles(): { slug: string; frontmatter: ArticleFrontmatter }[] {
  return getPostSlugs()
    .map((slug) => getPost(slug))
    .filter((a): a is Article => a !== null)
    .map((a) => ({ slug: a.frontmatter.slug, frontmatter: a.frontmatter }));
}
