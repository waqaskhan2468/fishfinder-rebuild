import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/2021/08/fishfinder-1.png"
            alt="Best Fish Finders Today"
            width={291}
            height={94}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:block" aria-label="Primary Navigation">
          <ul className="flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-white/90 transition-colors hover:text-highlight"
                >
                  {link.label}
                  {link.children && (
                    <svg
                      viewBox="0 0 12 8"
                      aria-hidden="true"
                      className="h-2.5 w-2.5 fill-current opacity-70"
                    >
                      <path d="M0 0 L12 0 L6 8 Z" />
                    </svg>
                  )}
                </Link>

                {link.children && (
                  <ul
                    className="invisible absolute left-0 top-full z-50 min-w-[200px] translate-y-1 bg-nav-dropdown opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  >
                    {link.children.map((child) => (
                      <li key={child.href} className="border-b border-white/10 last:border-b-0">
                        <Link
                          href={child.href}
                          className="block px-4 py-3 text-xs text-surface-alt transition-colors hover:bg-nav-dropdown-hover hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
