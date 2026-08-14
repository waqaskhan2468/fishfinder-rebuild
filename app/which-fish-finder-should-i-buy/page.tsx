import type { Metadata } from "next";
import Link from "next/link";
import FishFinderQuiz, { type QuizProduct } from "@/components/FishFinderQuiz";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Sidebar from "@/components/Sidebar";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, SITE_URL, SITE_NAME } from "@/lib/schema";
import { PRODUCTS, getProduct, amazonUrl } from "@/lib/products";

const TITLE = "Which Fish Finder Should I Buy? Free 30-Second Finder Quiz";
const DESCRIPTION =
  "Answer three questions about where you fish and your budget, and get a specific fish finder recommendation — from castable units for bank fishing to LiveScope-ready chartplotters.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/which-fish-finder-should-i-buy/",
  });
}

const FAQ = [
  {
    question: "How much should I spend on a fish finder?",
    answer:
      "For occasional fishing from a small boat or kayak, $100–200 buys a genuinely capable unit with CHIRP sonar and GPS. $400–900 gets you a larger screen with side and down imaging, which is where most serious anglers land. Above $900 you're paying for large touchscreens, detailed mapping and live sonar compatibility.",
  },
  {
    question: "Do I need GPS on a fish finder?",
    answer:
      "If you fish the same waters repeatedly, yes — being able to mark productive spots and return to them is often more valuable than a slightly better sonar picture. If you fish one small lake or mostly from shore, you can skip it and save money.",
  },
  {
    question: "What's the difference between CHIRP, down imaging and side imaging?",
    answer:
      "CHIRP is traditional sonar and tells you depth and whether fish are below you. Down imaging gives a photo-like picture directly beneath the boat, which is much better for identifying structure. Side imaging scans out to the sides, letting you cover water quickly and find structure you haven't driven over.",
  },
  {
    question: "Can I move a fish finder between boats?",
    answer:
      "Portable and castable units are designed for it. A mounted unit can be moved, but you'll need a portable kit with a battery and suction-cup or clamp transducer mount, and re-mounting the transducer each time is fiddly.",
  },
  {
    question: "Is a castable fish finder good enough?",
    answer:
      "For bank, dock and ice fishing, yes — a castable is often the only sensible option since there's nothing to mount a transducer to. For boat fishing, a mounted unit gives a continuous picture as you move, which a castable can't match.",
  },
];

export default function QuizPage() {
  // Resolve products server-side so the client component never touches the
  // registry or the affiliate tag.
  const products: Record<string, QuizProduct> = {};
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
    name: "Which Fish Finder Should I Buy? Quiz",
    url: `${SITE_URL}/which-fish-finder-should-i-buy/`,
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
            { label: "Which Fish Finder Should I Buy?", href: null },
          ]}
        />

        <h1
          className="mb-4 text-3xl leading-tight md:text-4xl"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-heading-1)" }}
        >
          Which Fish Finder Should I Buy?
        </h1>

        <p className="mb-8 max-w-3xl text-lg text-ink-muted">
          Three questions, about thirty seconds, and you get a specific model rather than a list of
          twenty.
        </p>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          <div className="max-w-3xl">
            <FishFinderQuiz products={products} />

            <div className="prose-article mt-12">
              <h2>How we pick</h2>
              <p>
                The quiz weighs three things, in this order: <strong>where you fish</strong>,{" "}
                <strong>your budget</strong>, and <strong>what you care about most</strong>. Where
                you fish matters most because it rules options in and out entirely — if you fish from
                the bank, there is nothing to mount a transducer to, so a castable unit is the only
                sensible answer regardless of budget.
              </p>
              <p>
                Above roughly $900 we favour displays that are <strong>live sonar compatible</strong>
                , even if you have no intention of buying live sonar today. Forward-facing sonar is
                where the category is heading, and buying a display that can&apos;t accept it later
                means replacing the screen as well as buying the transducer — often a four-figure
                difference. You can check exactly what works with your unit using our{" "}
                <Link href="/fish-finder-compatibility-checker/">compatibility checker</Link>.
              </p>

              <h2>Frequently asked questions</h2>
              {FAQ.map((item) => (
                <div key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}

              <h2>Prefer to read the full guides?</h2>
              <ul>
                <li>
                  <Link href="/best-kayak-fish-finder/">Best fish finders for kayaks</Link>
                </li>
                <li>
                  <Link href="/best-ice-fishing-fish-finder/">Best ice fishing fish finders</Link>
                </li>
                <li>
                  <Link href="/fish-finders-for-small-boat/">Best fish finders for small boats</Link>
                </li>
                <li>
                  <Link href="/portable-fish-finders-ultimate-buying-guide/">
                    Portable fish finders buying guide
                  </Link>
                </li>
                <li>
                  <Link href="/livescope-vs-activetarget-vs-mega-live/">
                    LiveScope vs ActiveTarget vs MEGA Live
                  </Link>
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
