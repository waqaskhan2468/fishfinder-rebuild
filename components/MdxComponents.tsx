import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { imageSize } from "image-size";
import { ProductCta, ProductTable, ProductCard } from "@/components/ProductBlocks";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";

const dimensionCache = new Map<string, { width: number; height: number } | null>();

function getLocalImageDimensions(src: string): { width: number; height: number } | null {
  if (dimensionCache.has(src)) return dimensionCache.get(src)!;
  if (!src.startsWith("/")) return null;
  try {
    const filePath = path.join(process.cwd(), "public", src);
    const buffer = fs.readFileSync(filePath);
    const { width, height } = imageSize(buffer);
    const dims = { width, height };
    dimensionCache.set(src, dims);
    return dims;
  } catch {
    dimensionCache.set(src, null);
    return null;
  }
}

function isAffiliateLink(href: string) {
  return href.includes("amzn.to") || href.includes("amazon.");
}

function isInternalLink(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

// Only the site's actual CTA phrases render as a button. Affiliate links
// used inline as a hyperlinked product/brand name (e.g. "the [Garmin]（url)
// is...") stay as plain text links so they don't break the reading flow.
const CTA_PHRASES = new Set(["check on amazon", "check price on amazon"]);

function isCtaText(children: unknown): boolean {
  if (typeof children !== "string") return false;
  return CTA_PHRASES.has(children.trim().toLowerCase());
}

function AmazonIcon() {
  return (
    <svg viewBox="0 0 448 512" aria-hidden="true" className="amazon-button-icon" fill="currentColor">
      <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" />
    </svg>
  );
}

function MdxAnchor({ href = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (isInternalLink(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (isAffiliateLink(href)) {
    if (isCtaText(children)) {
      return (
        <a href={href} target="_blank" rel="nofollow sponsored" className="amazon-button" {...rest}>
          <AmazonIcon />
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="nofollow sponsored" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MissingImage({ alt }: { alt: string }) {
  return (
    <span
      role="img"
      aria-label={alt || "Image unavailable"}
      className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed border-surface-muted bg-surface-alt text-center text-sm text-ink-muted"
    >
      {alt || "Image unavailable"}
    </span>
  );
}

function MdxImg({ src, alt = "", width, height }: ImgHTMLAttributes<HTMLImageElement>) {
  const srcStr = typeof src === "string" ? src : "";
  const explicit = Number(width) && Number(height) ? { width: Number(width), height: Number(height) } : null;
  const dims = explicit ?? getLocalImageDimensions(srcStr);

  if (!dims) return <MissingImage alt={alt} />;

  return (
    <Image
      src={srcStr}
      alt={alt}
      width={dims.width}
      height={dims.height}
      sizes="(max-width: 768px) 100vw, 720px"
    />
  );
}

export const mdxComponents = {
  a: MdxAnchor,
  img: MdxImg,
  // Custom tags authored in .mdx, resolved from the product registry.
  "product-cta": ProductCta,
  "product-table": ProductTable,
  "product-card": ProductCard,
};
