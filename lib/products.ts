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
    name: "Garmin LiveScope Plus System with GLS 10 and LVS34 Transducer",
    brand: "Garmin",
    asin: "B09SGT9T88",
    priceBand: "$1,300–1,500",
    blurb: "The category benchmark. Sharpest image, biggest ecosystem.",
  },
  "lowrance-activetarget-2": {
    name: "Lowrance ActiveTarget 2 Live Sonar Transducer",
    brand: "Lowrance",
    asin: "B0GMXM289Z",
    priceBand: "$1,300–1,500",
    blurb: "Highest stated resolution; strong pick if you already run Lowrance.",
  },
  "humminbird-mega-live-2": {
    name: "Humminbird MEGA Live 2 Forward-Facing Sonar Transducer",
    brand: "Humminbird",
    asin: "B0DMM2NNSS",
    priceBand: "$1,300–1,600",
    // Compatibility is deliberately in the blurb: MEGA Live 2 does NOT work
    // with HELIX or older SOLIX, which is the single most expensive mistake
    // a Humminbird owner can make here.
    blurb: "For XPLORE, APEX and SOLIX G3 only — not HELIX or older SOLIX.",
  },

  // ---- Chartplotter combos / mid-to-high ticket ----
  "garmin-echomap-uhd-93sv": {
    name: "Garmin ECHOMAP UHD 93sv with GT56UHD-TM Transducer",
    brand: "Garmin",
    asin: "B08LP4H8W4",
    priceBand: "$900–1,200",
    blurb: "9-inch combo with high-def scanning sonar and inland maps.",
    image: "/images/2021/08/garmin-products/echomap-uhd-93sv.jpg",
  },
  "garmin-echomap-uhd-73sv": {
    name: "Garmin ECHOMAP UHD 73sv with Transducer",
    brand: "Garmin",
    asin: "B08LP6BSLJ",
    priceBand: "$700–900",
    blurb: "7-inch touchscreen combo, LiveScope-compatible.",
    image: "/images/2021/08/2-Garmin-ECHOMAP-UHD-73sv-with-GT56UHD-TM-Transducer.jpg",
  },
  "humminbird-helix-7-msi-g3n": {
    name: "Humminbird HELIX 7 CHIRP MEGA SI GPS G3N",
    brand: "Humminbird",
    asin: "B07MGZ9CPJ",
    priceBand: "$650–850",
    blurb: "MEGA side + down imaging at a 7-inch size.",
    image: "/images/2021/08/1-Humminbird-Helix-7-CHIRP-MSI-GPS-G3N-1.jpg",
  },
  // ASINs below are taken from this site's own existing (working) affiliate
  // links; names come from the article sections those links sit under.
  "lowrance-hook2-tripleshot": {
    name: "Lowrance HOOK2 with TripleShot Transducer",
    brand: "Lowrance",
    asin: "B077W9S59C",
    priceBand: "$250–400",
    blurb: "Wide-angle sonar plus down/side scan in one transducer.",
    image: "/images/2021/08/1-Lowrance-000-14294-001-Chart-Plotters-with-TripleShot-Transducer-1.jpg",
  },
  "lowrance-hook-reveal-5": {
    name: "Lowrance HOOK Reveal 5 with Transducer",
    brand: "Lowrance",
    asin: "B083PVQ356",
    priceBand: "$200–330",
    blurb: "FishReveal on a compact 5-inch screen. Best value Lowrance.",
    image: "/images/2021/08/2-Lowrance-Hook-Reveal-5-Fish-Finder-5-Inches-Screen-with-Transducer-1.jpg",
  },
  "lowrance-hds-live": {
    name: "Lowrance HDS LIVE Fish Finder, Live Sonar Compatible",
    brand: "Lowrance",
    asin: "B07HQWTPKL",
    priceBand: "$1,200–2,500",
    blurb: "Flagship touchscreen. Required if you want ActiveTarget live sonar.",
    image: "/images/2021/08/3-Lowrance-HDS-Live-Fish-Finder-Multi-Touch-Screen-Live-Sonar-Compatible-1.jpg",
  },
  "lowrance-hook2-4x": {
    name: "Lowrance HOOK2 Fish Finder with Auto Tuning Sonar",
    brand: "Lowrance",
    asin: "B077WDRVSS",
    priceBand: "$110–200",
    blurb: "Auto-tuning sonar and a simple menu. Easiest Lowrance to start on.",
    image: "/images/2021/08/4-Lowrance-Hook2-Fish-Finder-All-Season-Pack-GPS-1.jpg",
  },
  "lowrance-hook-reveal-7": {
    name: "Lowrance HOOK Reveal 7 with TripleShot Transducer",
    brand: "Lowrance",
    asin: "B082XLBSJM",
    priceBand: "$450–650",
    blurb: "FishReveal plus preloaded inland mapping.",
    image: "/images/2021/08/3-Lowrance-Hook-Reveal-7-Fish-Finder-7-Inch-Screen-with-Transducer-and-C-MAP-Preloaded-Map-Options-1024x713.jpg",
  },
  "raymarine-element-7hv": {
    name: "Raymarine Element 7 HV with HV-100 Transducer",
    brand: "Raymarine",
    asin: "B07MDXTSJG",
    priceBand: "$500–700",
    blurb: "HyperVision CHIRP; strong value in the 7-inch class.",
    image: "/images/2021/08/5-Element-7-HV-with-HV-100-Transducer-1024x742.jpg",
  },
  "garmin-echomap-plus-44cv": {
    name: "Garmin ECHOMAP Plus 44cv with GT20 Transducer",
    brand: "Garmin",
    asin: "B07Z458VD6",
    priceBand: "$300–450",
    blurb: "Compact 4.3-inch combo with ClearVü.",
    image: "/images/2021/08/garmin-products/echomap-plus-44cv.jpg",
  },

  // ---- Budget / portable (traffic drivers) ----
  "garmin-striker-4": {
    name: "Garmin STRIKER 4 with Transducer, 3.5\" GPS Fishfinder",
    brand: "Garmin",
    asin: "B017NI17HQ",
    priceBand: "$100–150",
    blurb: "The perennial budget benchmark. CHIRP sonar plus basic GPS.",
    image: "/images/2021/08/garmin-products/striker-4.jpg",
  },
  "garmin-striker-plus-4": {
    name: "Garmin Striker Plus 4 with Dual-Beam Transducer",
    brand: "Garmin",
    asin: "B076WBHD2T",
    priceBand: "$130–180",
    blurb: "Adds Quickdraw Contours mapping over the base Striker 4.",
    image: "/images/2021/08/garmin-products/striker-plus-4.jpg",
  },
  "garmin-striker-vivid-4cv": {
    name: "Garmin STRIKER Vivid 4cv with GT20 Transducer",
    brand: "Garmin",
    asin: "B08LF13X8B",
    priceBand: "$150–220",
    blurb: "Vivid colour palettes make returns easier to read for beginners.",
    image: "/images/2021/08/garmin-products/striker-vivid-4cv.jpg",
  },
  "garmin-striker-vivid-7sv": {
    name: "Garmin STRIKER Vivid 7sv with GT52HW-TM Transducer",
    brand: "Garmin",
    asin: "B08LF1F981",
    priceBand: "$450–600",
    blurb: "7-inch with CHIRP side and down scanning.",
    image: "/images/2021/08/4-Garmin-Striker-Vivid-7sv-Easy-to-Use-7-inch-Color-Fishfinder-and-Sonar-Transducer-Vivid-Scanning-Sonar-Color-Palettes-010-02553-00-1.jpg",
  },
  "garmin-striker-cast": {
    name: "Garmin STRIKER Cast Castable Sonar",
    brand: "Garmin",
    asin: "B08LDZWMKF",
    priceBand: "$100–180",
    blurb: "Castable unit that pairs with your phone. Shore and dock fishing.",
    image: "/images/2021/08/garmin-products/striker-cast.jpg",
  },
  "deeper-pro-plus": {
    name: "Deeper PRO+ Smart Sonar Castable WiFi Fish Finder with GPS",
    brand: "Deeper",
    asin: "B01CQLVO5U",
    priceBand: "$200–260",
    blurb: "Castable with onboard GPS for shore-based contour mapping.",
    image: "/images/2021/08/Deeper-PRO-Smart-Sonar-Castable-and-Portable-WiFi-Fish-Finder-with-Gps-for-Kayaks-and-Boats.jpg",
  },
  "deeper-start": {
    name: "Deeper START Smart Castable Fish Finder",
    brand: "Deeper",
    asin: "B07BR2FQZN",
    priceBand: "$100–160",
    blurb: "Entry castable for dock, shore and bank fishing.",
    image: "/images/2021/08/5-Deeper-START-Smart-Fish-Finder-–-Castable-Wi-Fi-fish-finder-for-recreational-fishing-from-dock-shore-or-bank.jpg",
  },
  "humminbird-piranhamax-4": {
    name: "Humminbird PIRANHAMAX 4 Fish Finder",
    brand: "Humminbird",
    asin: "B01MDP3DPB",
    priceBand: "$100–150",
    blurb: "Simple, rugged, hard to beat on price.",
    image: "/images/2021/08/Humminbird-410150-1-PIRANHAMAX-4-Fish-FinderBlack.jpg",
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
    image: "/images/2021/08/3-HawkEye-FishTrax.jpg",
  },
  "reelsonar-ibobber": {
    name: "ReelSonar iBobber Wireless Bluetooth Smart Fish Finder",
    brand: "ReelSonar",
    asin: "B00LEA2FS0",
    priceBand: "$70–110",
    blurb: "Bluetooth castable bobber; pairs to phone and smartwatch.",
    image: "/images/2021/08/7-ReelSonar-Wireless-Bluetooth-Smart-Fish-Finder.jpg",
  },
  "ricank-portable": {
    name: "RICANK Portable Fish Finder, Handheld Depth Finder",
    brand: "RICANK",
    asin: "B07WYG9Q5V",
    priceBand: "$40–70",
    blurb: "Wired handheld. Cheapest way to read depth and structure.",
    image: "/images/2021/08/2-RICANK-Portable-Fish-Finder-Handheld-Wired-Fish-Depth-Finder-Ice-Kayak-Fishfinder-Shore-Boat-Fishing.jpg",
  },
  "lucky-portable": {
    name: "LUCKY Portable Handheld Fish Finder",
    brand: "LUCKY",
    asin: "B07BFRMC87",
    priceBand: "$40–70",
    blurb: "Budget handheld for kayak, ice and bank fishing.",
    image: "/images/2021/08/6-LUCKY-Portable-Fish-Finder-Handheld-Kayak-Fish-Finders-Wired-Fish-Depth-Finder-Sonar-Sensor-Transducer-for-Boat-Fishing-Sea-Fishing.jpg",
  },
  "venterior-vt-ff001": {
    name: "Venterior VT-FF001 Portable Fish Finder",
    brand: "Venterior",
    asin: "B08QW6Y154",
    priceBand: "$40–70",
    blurb: "Entry-level portable with LCD and castable transducer.",
    image: "/images/2021/08/3-Venterior-VT-FF001-Portable-Fish-Finder-Handheld-Fishfinder-Fishing-Gear-Depth-Finder-with-Sonar-Transducer-and-LCD-Display-Yellow.jpg",
  },
} satisfies Record<string, Product>;

export type ProductKey = keyof typeof PRODUCTS;

export function getProduct(key: string): Product | null {
  return (PRODUCTS as Record<string, Product>)[key] ?? null;
}
