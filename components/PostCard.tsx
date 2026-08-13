import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { ArticleFrontmatter } from "@/lib/content";

function getImageAspect(src: string | null | undefined): number {
  const fallback = 16 / 9;
  if (!src) return fallback;
  try {
    const buffer = fs.readFileSync(path.join(process.cwd(), "public", src));
    const { width, height } = imageSize(buffer);
    return width / height;
  } catch {
    return fallback;
  }
}

export default function PostCard({
  slug,
  frontmatter,
}: {
  slug: string;
  frontmatter: ArticleFrontmatter;
}) {
  const href = `/${slug}/`;
  const aspect = getImageAspect(frontmatter.image);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-surface-muted bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative overflow-hidden bg-surface-alt" style={{ aspectRatio: aspect }}>
        {frontmatter.image ? (
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-muted">Coming soon</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="text-lg leading-snug"
          style={{ fontFamily: "var(--font-heading-alt)", color: "var(--color-heading-2)" }}
        >
          {frontmatter.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-muted">{frontmatter.description}</p>
        <span className="mt-4 text-sm font-semibold text-link group-hover:text-accent">Read More →</span>
      </div>
    </Link>
  );
}
