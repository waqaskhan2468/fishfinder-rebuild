import Image from "next/image";

const AFFILIATE_URL = "https://amzn.to/3shjxi6";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <a href={AFFILIATE_URL} target="_blank" rel="nofollow sponsored" className="block">
          <Image
            src="/images/2021/08/Big-Sale-Animated-Instagram-Story-1-576x1024.png"
            alt="Recommended portable fish finder deal on Amazon"
            width={576}
            height={1024}
            sizes="300px"
            className="w-full rounded-lg"
          />
        </a>
        <p className="mt-4 text-center text-xs leading-relaxed text-ink-muted">
          <strong className="block text-ink">Amazon Affiliate Disclosure:</strong>
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </aside>
  );
}
