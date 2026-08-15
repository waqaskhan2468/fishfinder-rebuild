"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { NavItem } from "@/lib/navigation";

/**
 * Desktop primary navigation.
 *
 * Previously this was pure CSS using group-hover + group-focus-within. The
 * focus-within half meant that after clicking a submenu link the menu stayed
 * open — focus remained inside the group — so users had to click elsewhere to
 * dismiss it. Managing open state explicitly lets us close on mouse leave, on
 * navigation, on Escape, and when focus leaves the item entirely, while still
 * opening on keyboard focus for accessibility.
 */
export default function DesktopNav({ links }: { links: NavItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  }

  /** Small delay so moving diagonally from the trigger to the panel doesn't
   *  close the menu mid-travel. */
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  }

  function closeNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(null);
  }

  return (
    <nav className="hidden lg:block" aria-label="Primary Navigation">
      <ul className="flex items-center gap-1 text-sm">
        {links.map((link) => {
          const isOpen = openKey === link.href;

          return (
            <li
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && open(link.href)}
              onMouseLeave={() => link.children && scheduleClose()}
              onBlur={(e) => {
                // Close only when focus leaves this item entirely.
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeNow();
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeNow();
              }}
            >
              <Link
                href={link.href}
                onClick={closeNow}
                onFocus={() => link.children && open(link.href)}
                aria-expanded={link.children ? isOpen : undefined}
                aria-haspopup={link.children ? "true" : undefined}
                className="flex items-center gap-1 px-3 py-2 text-white/90 transition-colors hover:text-highlight"
              >
                {link.label}
                {link.children && (
                  <svg
                    viewBox="0 0 12 8"
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 fill-current opacity-70 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M0 0 L12 0 L6 8 Z" />
                  </svg>
                )}
              </Link>

              {link.children && isOpen && (
                <ul className="absolute left-0 top-full z-50 min-w-[240px] bg-nav-dropdown shadow-lg">
                  {link.children.map((child) => (
                    <li key={child.href} className="border-b border-white/10 last:border-b-0">
                      <Link
                        href={child.href}
                        onClick={closeNow}
                        className="block px-4 py-3 text-xs text-surface-alt transition-colors hover:bg-nav-dropdown-hover hover:text-white"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
