import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import { buildMetadata } from "@/lib/seo";

const TITLE = "Free Fish Finder Tools";
const DESCRIPTION =
  "Free tools for fish finder buyers — check whether live sonar works with your display, or answer three questions to get a specific fish finder recommendation.";

export function generateMetadata(): Metadata {
  return buildMetadata({ title: TITLE, description: DESCRIPTION, path: "/tools/" });
}

const TOOLS = [
  {
    href: "/fish-finder-compatibility-checker/",
    name: "Fish Finder Compatibility Checker",
    blurb:
      "Live sonar only works with specific displays from the same brand, and getting it wrong costs $1,300–1,600. Pick your unit and see exactly what works — including the traps, like MEGA Live 2 not supporting any HELIX.",
    cta: "Check compatibility",
  },
  {
    href: "/which-fish-finder-should-i-buy/",
    name: "Which Fish Finder Should I Buy?",
    blurb:
      "Three questions about where you fish and your budget, and you get one specific model rather than a list of twenty.",
    cta: "Take the quiz",
  },
];

export default function ToolsPage() {
  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <div>
          <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: null }]} />

          <h1
            className="mb-3 text-3xl leading-tight md:text-4xl"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
          >
            {TITLE}
          </h1>
          <p className="mb-10 max-w-2xl text-ink-muted">{DESCRIPTION}</p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="tool-card">
                <h2 className="tool-card-name">{tool.name}</h2>
                <p className="tool-card-blurb">{tool.blurb}</p>
                <span className="tool-card-cta">{tool.cta} →</span>
              </Link>
            ))}
          </div>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
