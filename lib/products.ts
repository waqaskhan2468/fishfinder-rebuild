// Single source of truth for every product we link to.
//
// Why this exists: affiliate links previously lived inline in each .mdx file.
// With 60+ articles that means a discontinued product requires editing every
// article that mentions it — and dead links earn nothing. Here, a product is
// defined once and referenced by key from content.
//
// Products carry EITHER an `asin` (direct product link, best conversion) or a
// `search` term (tagged Amazon search, used when we haven't verified an ASIN).
// Search links never point at the wrong product and never 404, so they're the
// safe default until an ASIN is confirmed via SiteStripe.

export const AMAZON_TAG = "feelscomfort-20";

export type Product = {
  name: string;
  brand: string;
  /** Verified Amazon ASIN. Preferred — direct product links convert best. */
  asin?: string;
  /** Fallback search phrase when no ASIN is verified yet. */
  search?: string;
  /** Local image path under /public. */
  image?: string;
  /** Deliberately a band, not an exact price — prices go stale and Amazon's
   *  operating agreement restricts displaying scraped prices. */
  priceBand?: string;
  /** One-line positioning used in comparison tables. */
  blurb?: string;
};

export function amazonUrl(product: Product): string {
  if (product.asin) {
    return `https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_TAG}`;
  }
  const query = encodeURIComponent(product.search ?? product.name);
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

export const PRODUCTS = {
  // ---- Live sonar / forward-facing (high ticket) ----
  "garmin-livescope-plus": {
    name: "Garmin LiveScope Plus LVS34 System",
    brand: "Garmin",
    search: "Garmin LiveScope Plus LVS34 system",
    priceBand: "$1,300–1,500",
    blurb: "The category benchmark. Sharpest image, biggest ecosystem.",
  },
  "lowrance-activetarget-2": {
    name: "Lowrance ActiveTarget 2 Live Sonar",
    brand: "Lowrance",
    search: "Lowrance ActiveTarget 2 live sonar",
    priceBand: "$1,300–1,500",
    blurb: "Highest stated resolution; strong pick if you already run Lowrance.",
  },
  "humminbird-mega-live-2": {
    name: "Humminbird MEGA Live 2 Imaging",
    brand: "Humminbird",
    search: "Humminbird MEGA Live 2 imaging",
    priceBand: "$1,300–1,600",
    blurb: "Best fit for existing Humminbird owners on APEX/SOLIX/HELIX.",
  },

  // ---- Chartplotter combos / mid-to-high ticket ----
  "garmin-echomap-uhd-93sv": {
    name: "Garmin ECHOMAP UHD 93sv with GT56UHD-TM Transducer",
    brand: "Garmin",
    asin: "B08LP4H8W4",
    priceBand: "$900–1,200",
    blurb: "9-inch combo with high-def scanning sonar and inland maps.",
  },
  "garmin-echomap-uhd-73sv": {
    name: "Garmin ECHOMAP UHD 73sv with Transducer",
    brand: "Garmin",
    asin: "B08LP6BSLJ",
    priceBand: "$700–900",
    blurb: "7-inch touchscreen combo, LiveScope-compatible.",
  },
  "humminbird-helix-7-msi-g3n": {
    name: "Humminbird HELIX 7 CHIRP MEGA SI GPS G3N",
    brand: "Humminbird",
    asin: "B07MGZ9CPJ",
    priceBand: "$650–850",
    blurb: "MEGA side + down imaging at a 7-inch size.",
  },
  "lowrance-hook-reveal-7": {
    name: "Lowrance HOOK Reveal 7 with TripleShot Transducer",
    brand: "Lowrance",
    asin: "B082XLBSJM",
    priceBand: "$450–650",
    blurb: "FishReveal plus preloaded inland mapping.",
  },
  "raymarine-element-7hv": {
    name: "Raymarine Element 7 HV with HV-100 Transducer",
    brand: "Raymarine",
    asin: "B07MDXTSJG",
    priceBand: "$500–700",
    blurb: "HyperVision CHIRP; strong value in the 7-inch class.",
  },
  "garmin-echomap-plus-44cv": {
    name: "Garmin ECHOMAP Plus 44cv with GT20 Transducer",
    brand: "Garmin",
    asin: "B07Z458VD6",
    priceBand: "$300–450",
    blurb: "Compact 4.3-inch combo with ClearVü.",
  },

  // ---- Budget / portable (traffic drivers) ----
  "garmin-striker-4": {
    name: "Garmin STRIKER 4 with Transducer, 3.5\" GPS Fishfinder",
    brand: "Garmin",
    asin: "B017NI17HQ",
    priceBand: "$100–150",
    blurb: "The perennial budget benchmark. CHIRP sonar plus basic GPS.",
  },
  "garmin-striker-plus-4": {
    name: "Garmin Striker Plus 4 with Dual-Beam Transducer",
    brand: "Garmin",
    asin: "B076WBHD2T",
    priceBand: "$130–180",
    blurb: "Adds Quickdraw Contours mapping over the base Striker 4.",
  },
  "garmin-striker-vivid-4cv": {
    name: "Garmin STRIKER Vivid 4cv with GT20 Transducer",
    brand: "Garmin",
    asin: "B08LF13X8B",
    priceBand: "$150–220",
    blurb: "Vivid colour palettes make returns easier to read for beginners.",
  },
  "garmin-striker-vivid-7sv": {
    name: "Garmin STRIKER Vivid 7sv with GT52HW-TM Transducer",
    brand: "Garmin",
    asin: "B08LF1F981",
    priceBand: "$450–600",
    blurb: "7-inch with CHIRP side and down scanning.",
  },
  "garmin-striker-cast": {
    name: "Garmin STRIKER Cast Castable Sonar",
    brand: "Garmin",
    asin: "B08LDZWMKF",
    priceBand: "$100–180",
    blurb: "Castable unit that pairs with your phone. Shore and dock fishing.",
  },
  "deeper-pro-plus": {
    name: "Deeper PRO+ Smart Sonar Castable WiFi Fish Finder with GPS",
    brand: "Deeper",
    asin: "B01CQLVO5U",
    priceBand: "$200–260",
    blurb: "Castable with onboard GPS for shore-based contour mapping.",
  },
  "deeper-start": {
    name: "Deeper START Smart Castable Fish Finder",
    brand: "Deeper",
    asin: "B07BR2FQZN",
    priceBand: "$100–160",
    blurb: "Entry castable for dock, shore and bank fishing.",
  },
  "humminbird-piranhamax-4": {
    name: "Humminbird PIRANHAMAX 4 Fish Finder",
    brand: "Humminbird",
    asin: "B01MDP3DPB",
    priceBand: "$100–150",
    blurb: "Simple, rugged, hard to beat on price.",
  },
  "humminbird-helix-7-g3": {
    name: "Humminbird HELIX 7 CHIRP MEGA SI GPS G3",
    brand: "Humminbird",
    asin: "B07L4JN57F",
    priceBand: "$600–800",
    blurb: "Previous-gen HELIX 7; often discounted.",
  },
  "hawkeye-fishtrax-1c": {
    name: "HawkEye FishTrax 1C Fish Finder",
    brand: "HawkEye",
    asin: "B016O5IDBW",
    priceBand: "$70–120",
    blurb: "Handheld/portable with colour display.",
  },
  "reelsonar-ibobber": {
    name: "ReelSonar iBobber Wireless Bluetooth Smart Fish Finder",
    brand: "ReelSonar",
    asin: "B00LEA2FS0",
    priceBand: "$70–110",
    blurb: "Bluetooth castable bobber; pairs to phone and smartwatch.",
  },
  "ricank-portable": {
    name: "RICANK Portable Fish Finder, Handheld Depth Finder",
    brand: "RICANK",
    asin: "B07WYG9Q5V",
    priceBand: "$40–70",
    blurb: "Wired handheld. Cheapest way to read depth and structure.",
  },
  "lucky-portable": {
    name: "LUCKY Portable Handheld Fish Finder",
    brand: "LUCKY",
    asin: "B07BFRMC87",
    priceBand: "$40–70",
    blurb: "Budget handheld for kayak, ice and bank fishing.",
  },
  "venterior-vt-ff001": {
    name: "Venterior VT-FF001 Portable Fish Finder",
    brand: "Venterior",
    asin: "B08QW6Y154",
    priceBand: "$40–70",
    blurb: "Entry-level portable with LCD and castable transducer.",
  },
} satisfies Record<string, Product>;

export type ProductKey = keyof typeof PRODUCTS;

export function getProduct(key: string): Product | null {
  return (PRODUCTS as Record<string, Product>)[key] ?? null;
}
