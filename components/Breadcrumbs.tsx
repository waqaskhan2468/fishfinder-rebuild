import Link from "next/link";

export type Crumb = { label: string; href: string | null };

/**
 * Renders visible breadcrumbs plus matching BreadcrumbList JSON-LD.
 * Google uses this to show the site hierarchy in results instead of a bare
 * URL, and it gives crawlers an extra path back to hub pages.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://www.bestfishfinderstoday.com${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
          {crumbs.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-accent">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
              {i < crumbs.length - 1 && (
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
