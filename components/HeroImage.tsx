import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { imageSize } from "image-size";

const MAX_WIDTH = 896;
const MAX_HEIGHT = 512;

function getLocalImageDimensions(src: string): { width: number; height: number } | null {
  try {
    const buffer = fs.readFileSync(path.join(process.cwd(), "public", src));
    const { width, height } = imageSize(buffer);
    return { width, height };
  } catch {
    return null;
  }
}

// Scales down (never up) to fit within MAX_WIDTH x MAX_HEIGHT, preserving
// aspect ratio, so portrait sources don't render as a huge vertical banner.
function fitWithin(width: number, height: number) {
  const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export default function HeroImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null;
  const dims = getLocalImageDimensions(src);

  if (!dims) {
    return (
      <div className="hero-image-frame mb-8 flex aspect-video items-center justify-center rounded-lg border border-dashed border-surface-muted bg-surface-alt text-sm text-ink-muted">
        Image unavailable
      </div>
    );
  }

  const { width, height } = fitWithin(dims.width, dims.height);

  return (
    <div className="hero-image-frame mb-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className="rounded-lg"
        style={{ width: "100%", maxWidth: `${width}px`, height: "auto" }}
      />
    </div>
  );
}
