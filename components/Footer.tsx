import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { FOOTER_LINKS } from "@/lib/navigation";

export default function Footer() {
  const hubs = Object.values(CATEGORIES);

  return (
    <footer className="bg-brand-black-2 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 sm:grid-cols-3">
          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">
              Guides
            </h2>
            <ul className="space-y-2 text-sm">
              {hubs.map((hub) => (
                <li key={hub.slug}>
                  <Link href={`/${hub.slug}/`} className="text-white/70 hover:text-highlight">
                    {hub.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guides/" className="text-white/70 hover:text-highlight">
                  All Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">
              Popular Reviews
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/livescope-vs-activetarget-vs-mega-live/"
                  className="text-white/70 hover:text-highlight"
                >
                  LiveScope vs ActiveTarget vs MEGA Live
                </Link>
              </li>
              <li>
                <Link href="/best-kayak-fish-finder/" className="text-white/70 hover:text-highlight">
                  Best Kayak Fish Finders
                </Link>
              </li>
              <li>
                <Link
                  href="/best-ice-fishing-fish-finder/"
                  className="text-white/70 hover:text-highlight"
                >
                  Best Ice Fishing Fish Finders
                </Link>
              </li>
              <li>
                <Link href="/garmin-fish-finders/" className="text-white/70 hover:text-highlight">
                  Best Garmin Fish Finders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Site</h2>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-highlight">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/70">
          <strong className="text-white">Amazon Affiliate Disclosure Notice:</strong> It is
          important to also note that Best Fish Finders Today is a participant in the Amazon
          Services LLC Associates Program, an affiliate advertising program designed to provide a
          means for website owners to earn advertising fees by advertising and linking to amazon.com
          and any other website that may be affiliated with the Amazon Service LLC Associates
          Program. As an Amazon Associate, we earn from qualifying purchases.
        </p>

        <p className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Best Fish Finders Today. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
