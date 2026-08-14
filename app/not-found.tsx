import Link from "next/link";
import AutoRedirect from "@/components/AutoRedirect";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1
        className="text-4xl"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
      >
        404 – Page Not Found
      </h1>
      <p className="mt-4 text-ink-muted">
        Looks like this catch got away. The page you&apos;re looking for has moved or no longer
        exists, but there&apos;s plenty more to reel in.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-semibold text-black transition-colors hover:bg-accent-hover"
      >
        Back to the Homepage
      </Link>
      <AutoRedirect seconds={8} />
    </div>
  );
}
