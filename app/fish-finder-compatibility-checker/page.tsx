import type { Metadata } from "next";
import Link from "next/link";
import CompatibilityChecker, { type ToolProduct } from "@/components/CompatibilityChecker";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Sidebar from "@/components/Sidebar";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, SITE_URL, SITE_NAME } from "@/lib/schema";
import { PRODUCTS, getProduct, amazonUrl } from "@/lib/products";

const TITLE = "Fish Finder Compatibility Checker: Which Live Sonar Works With Your Unit?";
const DESCRIPTION =
  "Free compatibility checker for Garmin LiveScope, Lowrance ActiveTarget 2 and Humminbird MEGA Live. Pick your display and see exactly which live sonar works before you spend $1,400.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/fish-finder-compatibility-checker/",
  });
}

const FAQ = [
  {
    question: "Can I use Garmin LiveScope on a Lowrance or Humminbird unit?",
    answer:
      "No. Every live sonar system only works with compatible displays from the same brand. There is no cross-brand compatibility between LiveScope, ActiveTarget and MEGA Live.",
  },
  {
    question: "Does MEGA Live 2 work with a HELIX?",
    answer:
      "No. MEGA Live 2 supports XPLORE, APEX and SOLIX G3 only. It does not work with any HELIX unit, or with SOLIX G1 and G2. HELIX owners need the original MEGA Live instead, which supports HELIX G3N 8 inch and larger and G4N 7 inch and larger with MEGA imaging.",
  },
  {
    question: "Why won't LiveScope work on my ECHOMAP cv model?",
    answer:
      "ECHOMAP 'cv' models have no network port and use an 8-pin transducer connector instead of the 12-pin connector found on 'sv' models. LiveScope needs that network connection to reach the GLS 10 sonar black box, so no firmware update or adapter can enable it. You need an 'sv' model, an ECHOMAP Ultra, or a GPSMAP.",
  },
  {
    question: "Can I run live sonar on a Garmin STRIKER?",
    answer:
      "No. STRIKER units are standalone fishfinders without a marine network, so they cannot connect to a live sonar module. You would need to upgrade to an ECHOMAP 'sv' model or a GPSMAP.",
  },
  {
    question: "Do I need anything else besides the transducer?",
    answer:
      "Usually yes. Budget for a compatible display if you don't already have one, a dedicated 12V battery because live sonar draws considerably more power than traditional sonar, and a trolling motor barrel mount or dedicated pole so the transducer can rotate independently.",
  },
];

export default function CompatibilityCheckerPage() {
  // Resolved server-side so the client component never needs the products
  // registry or the affiliate tag.
  const products: Record<string, ToolProduct> = {};
  for (const key of Object.keys(PRODUCTS)) {
    const product = getProduct(key);
    if (!product) continue;
    products[key] = {
      name: product.name,
      brand: product.brand,
      image: product.image,
      priceBand: product.priceBand,
      href: amazonUrl(product),
    };
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fish Finder Compatibility Checker",
    url: `${SITE_URL}/fish-finder-compatibility-checker/`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="bg-surface">
      <JsonLd data={toolSchema} />
      <JsonLd data={faqSchema(FAQ)} />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools/" },
            { label: "Compatibility Checker", href: null },
          ]}
        />

        <h1
          className="mb-4 text-3xl leading-tight md:text-4xl"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
        >
          Fish Finder Compatibility Checker
        </h1>

        <p className="mb-8 max-w-3xl text-lg text-ink-muted">
          Live sonar costs $1,300–1,600, and it only works with specific displays from the same
          brand. Pick your unit below to see exactly which systems work with it — and which
          don&apos;t.
        </p>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          <div className="max-w-3xl">
            <CompatibilityChecker products={products} />

            <div className="prose-article mt-12">
              <h2>Why compatibility is the first thing to check</h2>
              <p>
                Forward-facing sonar is the biggest change to fishing electronics in a decade, but
                it is not a plug-and-play purchase. Each system — <strong>Garmin LiveScope</strong>,{" "}
                <strong>Lowrance ActiveTarget</strong> and <strong>Humminbird MEGA Live</strong> — is
                a transducer plus a processing module that must connect to a compatible display{" "}
                <em>from the same brand</em>. There is no cross-brand compatibility, and no adapter
                that changes that.
              </p>
              <p>
                The expensive mistakes are the ones that feel safe. Owning the right brand is not
                enough:
              </p>
              <ul>
                <li>
                  <strong>Humminbird HELIX owners</strong> cannot run MEGA Live 2 at all, despite
                  HELIX being one of the best-selling fish finders Humminbird has made. MEGA Live 2
                  requires XPLORE, APEX or SOLIX G3.
                </li>
                <li>
                  <strong>Garmin ECHOMAP &quot;cv&quot; owners</strong> cannot run LiveScope. The cv
                  models have no network port and use an 8-pin transducer connector rather than the
                  12-pin used by &quot;sv&quot; models. It is a hardware limit, not a software one.
                </li>
                <li>
                  <strong>Garmin STRIKER owners</strong> cannot run LiveScope either — STRIKER units
                  have no marine network at all.
                </li>
              </ul>

              <h2>What a complete live sonar setup actually costs</h2>
              <p>
                If the checker tells you your display works, you are most of the way there. If it
                doesn&apos;t, budget for the whole system rather than just the transducer:
              </p>
              <ul>
                <li>
                  <strong>Live sonar system</strong> — roughly $1,300–1,600
                </li>
                <li>
                  <strong>Compatible display</strong>, if you need one — commonly $700–1,500 for a
                  screen large enough to be worth it
                </li>
                <li>
                  <strong>Dedicated 12V battery</strong> — live sonar draws far more power than
                  traditional sonar, and running it off your starting battery risks being stranded
                </li>
                <li>
                  <strong>Mount</strong> — a trolling motor barrel mount or dedicated pole so the
                  transducer rotates independently
                </li>
              </ul>
              <p>
                A first-time setup landing between $2,500 and $4,000 all-in is completely normal.
                That is exactly why brand loyalty dominates this category — staying inside the
                ecosystem you already own usually saves four figures.
              </p>

              <h2>Frequently asked questions</h2>
              {FAQ.map((item) => (
                <div key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}

              <h2>Next steps</h2>
              <ul>
                <li>
                  Compare the three systems side by side in our{" "}
                  <Link href="/livescope-vs-activetarget-vs-mega-live/">
                    LiveScope vs ActiveTarget vs MEGA Live guide
                  </Link>
                  .
                </li>
                <li>
                  Not sure live sonar is worth it? Start with the{" "}
                  <Link href="/portable-fish-finders-ultimate-buying-guide/">
                    portable fish finder buying guide
                  </Link>
                  .
                </li>
                <li>
                  Still choosing a unit? Try our{" "}
                  <Link href="/which-fish-finder-should-i-buy/">fish finder finder quiz</Link>.
                </li>
              </ul>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
