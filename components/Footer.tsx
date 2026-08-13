import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="bg-brand-black-2 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="text-sm leading-relaxed text-white/70">
          <strong className="text-white">Amazon Affiliate Disclosure Notice:</strong> It is
          important to also note that Best Fish Finders Today is a participant in the Amazon
          Services LLC Associates Program, an affiliate advertising program designed to provide
          a means for website owners to earn advertising fees by advertising and linking to
          amazon.com and any other website that may be affiliated with the Amazon Service LLC
          Associates Program. As an Amazon Associate, we earn from qualifying purchases.
        </p>

        <nav aria-label="Footer Navigation" className="mt-8 border-t border-white/10 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-highlight hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Best Fish Finders Today. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
