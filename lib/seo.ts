import type { Metadata } from "next";

const SITE_NAME = "Best Fish Finders Today";
const DEFAULT_OG_IMAGE = "/images/2021/08/Best-Portable-Fish-Finders-Home-1024x576.png";

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
