"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        className="flex flex-col gap-1.5 p-2 text-white"
      >
        <span className="h-0.5 w-6 bg-current" />
        <span className="h-0.5 w-6 bg-current" />
        <span className="h-0.5 w-6 bg-current" />
      </button>

      {open && (
        <nav
          aria-label="Mobile Primary Navigation"
          className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto bg-brand-black-2 shadow-lg"
        >
          <ul className="flex flex-col divide-y divide-white/10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <div className="flex items-stretch">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex-1 px-6 py-3 text-white/90 hover:text-highlight"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <button
                      type="button"
                      aria-label={`Toggle ${link.label} submenu`}
                      aria-expanded={expanded === link.label}
                      onClick={() => setExpanded((e) => (e === link.label ? null : link.label))}
                      className="px-5 text-white/70"
                    >
                      <svg
                        viewBox="0 0 12 8"
                        aria-hidden="true"
                        className={`h-3 w-3 fill-current transition-transform ${expanded === link.label ? "rotate-180" : ""}`}
                      >
                        <path d="M0 0 L12 0 L6 8 Z" />
                      </svg>
                    </button>
                  )}
                </div>

                {link.children && expanded === link.label && (
                  <ul className="bg-nav-dropdown">
                    {link.children.map((child) => (
                      <li key={child.href} className="border-t border-white/10">
                        <Link
                          href={child.href}
                          onClick={close}
                          className="block px-10 py-3 text-sm text-surface-alt hover:text-highlight"
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
      )}
    </div>
  );
}
