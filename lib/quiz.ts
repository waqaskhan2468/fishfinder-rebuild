// Decision data for the "which fish finder should I buy?" quiz.
//
// Recommendations map to keys in lib/products.ts so the quiz result can carry
// a real product, image and affiliate link rather than generic advice.

export type QuizOption = { value: string; label: string; hint?: string };

export type QuizQuestion = {
  id: "platform" | "budget" | "priority";
  question: string;
  options: QuizOption[];
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "platform",
    question: "Where do you fish from?",
    options: [
      { value: "shore", label: "Shore, dock or bank", hint: "No boat" },
      { value: "kayak", label: "Kayak or canoe" },
      { value: "small-boat", label: "Small boat or jon boat" },
      { value: "bass-boat", label: "Bass boat or larger" },
      { value: "ice", label: "Ice fishing" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget?",
    options: [
      { value: "under-150", label: "Under $150" },
      { value: "150-400", label: "$150 – $400" },
      { value: "400-900", label: "$400 – $900" },
      { value: "900-plus", label: "$900+" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    options: [
      { value: "simple", label: "Simple to use", hint: "Just show me depth and fish" },
      { value: "mapping", label: "GPS and mapping", hint: "Mark spots, map contours" },
      { value: "imaging", label: "Best possible image", hint: "See structure clearly" },
      { value: "portable", label: "Portability", hint: "Move it between trips" },
    ],
  },
];

export type Recommendation = {
  productKey: string;
  reason: string;
  /** Optional second suggestion. */
  alternateKey?: string;
  alternateReason?: string;
};

type Answers = { platform?: string; budget?: string; priority?: string };

/**
 * Rules are ordered most-specific first. Deliberately simple and readable
 * rather than a scoring model — a wrong recommendation here costs a reader
 * real money, so the logic needs to be auditable.
 */
export function recommend(answers: Answers): Recommendation {
  const { platform, budget, priority } = answers;

  // ---- Shore / bank fishing: castable is the only sensible answer ----
  if (platform === "shore") {
    if (budget === "under-150") {
      return {
        productKey: "deeper-start",
        reason:
          "For bank and dock fishing on a tight budget, a castable unit is the only option that makes sense — there's nothing to mount a transducer to. The Deeper START casts out like a bobber and reads to your phone.",
        alternateKey: "garmin-striker-cast",
        alternateReason: "Garmin's castable alternative, often similarly priced.",
      };
    }
    return {
      productKey: "deeper-pro-plus",
      reason:
        "The PRO+ adds onboard GPS to the castable format, which means you can actually map contours from shore rather than just reading depth. That's the single biggest upgrade for bank anglers.",
      alternateKey: "garmin-striker-cast",
      alternateReason: "Cheaper castable if you don't need the GPS mapping.",
    };
  }

  // ---- Ice fishing ----
  if (platform === "ice") {
    if (budget === "under-150") {
      return {
        productKey: "ricank-portable",
        reason:
          "For occasional ice fishing, a cheap handheld reads depth and shows fish through the hole without the bulk or cost of a flasher.",
      };
    }
    if (budget === "150-400") {
      return {
        productKey: "deeper-pro-plus",
        reason:
          "The Deeper PRO+ works well through the ice, is genuinely portable between holes, and doubles as an open-water castable the rest of the year — which is why it's the most versatile pick at this budget.",
      };
    }
    return {
      productKey: "garmin-striker-vivid-7sv",
      reason:
        "At this budget a full unit with a portable kit gives you a much better picture than a castable, and the Vivid colour palettes make returns easier to read in low ice-house light.",
      alternateKey: "deeper-pro-plus",
      alternateReason: "Far more portable if you move holes constantly.",
    };
  }

  // ---- Kayak ----
  if (platform === "kayak") {
    if (budget === "under-150") {
      return {
        productKey: "garmin-striker-4",
        reason:
          "The STRIKER 4 is the benchmark budget unit — small enough for a kayak console, with real CHIRP sonar and basic GPS. Hard to beat at this price.",
      };
    }
    if (budget === "150-400") {
      return {
        productKey: "garmin-striker-plus-4",
        reason:
          "Adds Quickdraw Contours over the base STRIKER 4, so you can build your own maps of the water you fish. Still compact and low-draw enough for kayak battery life.",
        alternateKey: "garmin-striker-vivid-4cv",
        alternateReason: "Better screen and ClearVü if you can stretch slightly.",
      };
    }
    if (budget === "400-900") {
      return {
        productKey: "garmin-striker-vivid-7sv",
        reason:
          "A 7-inch screen with CHIRP side and down scanning is about the largest that makes sense on a kayak, and the extra screen size genuinely helps when reading structure.",
        alternateKey: "lowrance-hook-reveal-7",
        alternateReason: "Similar size with FishReveal and preloaded inland maps.",
      };
    }
    return {
      productKey: "garmin-echomap-uhd-73sv",
      reason:
        "A touchscreen combo with high-def scanning and full mapping. Also LiveScope-compatible, so it leaves the door open to adding live sonar later without replacing the display.",
    };
  }

  // ---- Small boat ----
  if (platform === "small-boat") {
    if (budget === "under-150") {
      return {
        productKey: "humminbird-piranhamax-4",
        reason:
          "Simple, rugged and about as cheap as a mountable unit gets. It shows depth, structure and fish without any complexity.",
        alternateKey: "garmin-striker-4",
        alternateReason: "Adds basic GPS for marking spots.",
      };
    }
    if (budget === "150-400") {
      return {
        productKey: "garmin-striker-vivid-4cv",
        reason:
          "Vivid colour palettes make returns much easier to interpret if you're still learning to read sonar, and ClearVü gives you a photo-like view under the boat.",
        alternateKey: "lowrance-hook2-tripleshot",
        alternateReason: "Wide-angle sonar plus down and side scan in one transducer.",
      };
    }
    if (budget === "400-900") {
      return {
        productKey: "lowrance-hook-reveal-7",
        reason:
          "FishReveal plus preloaded inland mapping at a 7-inch size — a lot of capability for a small boat without moving into flagship pricing.",
        alternateKey: "raymarine-element-7hv",
        alternateReason: "HyperVision CHIRP; strong value in the same class.",
      };
    }
    return {
      productKey: "humminbird-helix-7-msi-g3n",
      reason:
        "MEGA side and down imaging is the clearest picture of structure available at this size, and Humminbird's side imaging is widely considered best in class.",
    };
  }

  // ---- Bass boat / larger ----
  if (platform === "bass-boat") {
    if (budget === "under-150" || budget === "150-400") {
      return {
        productKey: "garmin-striker-vivid-4cv",
        reason:
          "On a bigger boat this is best treated as a bow or backup unit — a capable small screen rather than your main display.",
        alternateKey: "garmin-echomap-plus-44cv",
        alternateReason: "Adds chartplotting if you need navigation too.",
      };
    }
    if (budget === "400-900") {
      return {
        productKey: "garmin-striker-vivid-7sv",
        reason:
          "CHIRP side and down scanning at 7 inches covers most bass fishing needs without flagship pricing.",
        alternateKey: "humminbird-helix-7-msi-g3n",
        alternateReason: "Choose this if MEGA side imaging matters more to you than price.",
      };
    }
    // 900+
    if (priority === "imaging") {
      return {
        productKey: "garmin-echomap-uhd-93sv",
        reason:
          "A 9-inch high-def combo, and critically it's LiveScope-compatible — so this is the display to buy if forward-facing sonar is anywhere in your future. Adding it later won't mean replacing the screen.",
        alternateKey: "lowrance-hds-live",
        alternateReason: "Lowrance equivalent, required for ActiveTarget live sonar.",
      };
    }
    return {
      productKey: "garmin-echomap-uhd-93sv",
      reason:
        "The best all-round choice at this budget: 9-inch screen, full mapping, high-def scanning, and LiveScope compatibility so you can add live sonar later without buying a new display.",
      alternateKey: "humminbird-helix-7-msi-g3n",
      alternateReason: "Cheaper if you want MEGA imaging over LiveScope readiness.",
    };
  }

  // ---- Fallback: budget-led ----
  if (budget === "under-150") {
    return {
      productKey: "garmin-striker-4",
      reason: "The most reliable entry point in fish finders — real CHIRP sonar and GPS at the lowest sensible price.",
    };
  }
  if (priority === "portable") {
    return {
      productKey: "deeper-pro-plus",
      reason: "The most versatile portable option — works from shore, kayak, boat or through the ice.",
    };
  }
  return {
    productKey: "garmin-striker-vivid-7sv",
    reason: "A well-balanced mid-range unit: large enough screen, CHIRP side and down scanning, and straightforward to use.",
  };
}
