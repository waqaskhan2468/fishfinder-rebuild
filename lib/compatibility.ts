// Live sonar ↔ display compatibility data.
//
// This powers the compatibility checker, which exists because getting this
// wrong is the most expensive mistake in the category: live sonar systems run
// $1,300–1,600 and only work with specific displays from the same brand.
//
// Sources are the manufacturers' own documentation:
//   Humminbird — MEGA Live 1 / MEGA Live 2 compatibility articles (Johnson
//     Outdoors support)
//   Lowrance   — ActiveTarget 2 product page
//   Garmin     — LiveScope chartplotter pairing guidance; the cv/sv split is
//     a hardware limit (cv units have no network port and use an 8-pin
//     transducer connector rather than 12-pin), so no firmware update changes it.
//
// Where a pairing isn't documented we mark it "check" rather than guessing —
// a confident wrong answer here costs a reader four figures.

export type Brand = "Garmin" | "Lowrance" | "Humminbird";
export type Verdict = "yes" | "no" | "check";

export type LiveSonarSystem = {
  key: string;
  brand: Brand;
  name: string;
  /** Key into lib/products.ts, so results can carry a buy CTA. */
  productKey?: string;
  note?: string;
};

export type Display = {
  key: string;
  brand: Brand;
  name: string;
  /** Helps users recognise their unit. */
  hint?: string;
};

export type Result = {
  sonarKey: string;
  verdict: Verdict;
  note?: string;
};

export const LIVE_SONAR: LiveSonarSystem[] = [
  {
    key: "livescope-plus",
    brand: "Garmin",
    name: "Garmin LiveScope Plus (LVS34)",
    productKey: "garmin-livescope-plus",
  },
  {
    key: "activetarget-2",
    brand: "Lowrance",
    name: "Lowrance ActiveTarget 2",
    productKey: "lowrance-activetarget-2",
  },
  {
    key: "mega-live-2",
    brand: "Humminbird",
    name: "Humminbird MEGA Live 2",
    productKey: "humminbird-mega-live-2",
  },
  {
    key: "mega-live-1",
    brand: "Humminbird",
    name: "Humminbird MEGA Live (1st gen)",
    note: "Still widely available and the only MEGA Live option for HELIX owners.",
  },
];

export const DISPLAYS: Display[] = [
  // ---- Garmin ----
  { key: "g-echomap-uhd2-sv", brand: "Garmin", name: "ECHOMAP UHD2 6sv / 7sv / 9sv", hint: "Model ends in 'sv'" },
  { key: "g-echomap-uhd2-cv", brand: "Garmin", name: "ECHOMAP UHD2 5cv / 7cv", hint: "Model ends in 'cv'" },
  { key: "g-echomap-uhd-sv", brand: "Garmin", name: "ECHOMAP UHD 72sv–95sv", hint: "e.g. 73sv, 93sv" },
  { key: "g-echomap-uhd-cv", brand: "Garmin", name: "ECHOMAP UHD 72cv–95cv", hint: "e.g. 73cv, 93cv" },
  { key: "g-echomap-ultra", brand: "Garmin", name: "ECHOMAP Ultra / Ultra 2", hint: "10\" and 12\"" },
  { key: "g-gpsmap", brand: "Garmin", name: "GPSMAP 8400 / 8600 / x3 / x2 Plus / 9000", hint: "Networked GPSMAP" },
  { key: "g-striker", brand: "Garmin", name: "STRIKER / STRIKER Vivid / STRIKER Plus", hint: "Fishfinder, not a chartplotter" },

  // ---- Lowrance ----
  { key: "l-hds-pro", brand: "Lowrance", name: "HDS PRO" },
  { key: "l-hds-live", brand: "Lowrance", name: "HDS LIVE" },
  { key: "l-hds-carbon", brand: "Lowrance", name: "HDS Carbon" },
  { key: "l-elite-fs", brand: "Lowrance", name: "Elite FS 7 / 9" },
  { key: "l-elite-ti2", brand: "Lowrance", name: "Elite Ti2" },
  { key: "l-hook", brand: "Lowrance", name: "HOOK2 / HOOK Reveal" },

  // ---- Humminbird ----
  { key: "h-xplore", brand: "Humminbird", name: "XPLORE" },
  { key: "h-apex", brand: "Humminbird", name: "APEX" },
  { key: "h-solix-g3", brand: "Humminbird", name: "SOLIX G3" },
  { key: "h-solix-g1-g2", brand: "Humminbird", name: "SOLIX G1 / G2" },
  { key: "h-helix-g4n", brand: "Humminbird", name: "HELIX G4N 7–15", hint: "Must be MEGA SI or MEGA DI" },
  { key: "h-helix-g3n", brand: "Humminbird", name: "HELIX G3N 8–12", hint: "MEGA SI / MEGA DI, 8\" and larger" },
  { key: "h-helix-small", brand: "Humminbird", name: "HELIX 7 G3N or older", hint: "Including all non-MEGA HELIX" },
  { key: "h-piranhamax", brand: "Humminbird", name: "PIRANHAMAX", hint: "Entry-level fishfinder" },
];

const ADAPTER_NOTE =
  "Requires the Humminbird AS EC QDE Ethernet adapter, and the unit must be a MEGA Side Imaging or MEGA Down Imaging model.";

const CV_NOTE =
  "'cv' models have no network port and use an 8-pin transducer connector instead of the 12-pin used by 'sv' models. LiveScope needs that network connection, so no firmware update or adapter can enable it.";

export const COMPATIBILITY: Record<string, Result[]> = {
  // ---- Garmin ----
  "g-echomap-uhd2-sv": [{ sonarKey: "livescope-plus", verdict: "yes" }],
  "g-echomap-uhd2-cv": [{ sonarKey: "livescope-plus", verdict: "no", note: CV_NOTE }],
  "g-echomap-uhd-sv": [{ sonarKey: "livescope-plus", verdict: "yes" }],
  "g-echomap-uhd-cv": [{ sonarKey: "livescope-plus", verdict: "no", note: CV_NOTE }],
  "g-echomap-ultra": [{ sonarKey: "livescope-plus", verdict: "yes" }],
  "g-gpsmap": [{ sonarKey: "livescope-plus", verdict: "yes" }],
  "g-striker": [
    {
      sonarKey: "livescope-plus",
      verdict: "no",
      note: "STRIKER units are standalone fishfinders with no marine network, so they cannot run LiveScope. You would need to move to an ECHOMAP 'sv' or GPSMAP unit.",
    },
  ],

  // ---- Lowrance ----
  "l-hds-pro": [
    {
      sonarKey: "activetarget-2",
      verdict: "yes",
      note: "HDS PRO also adds Scout XL, and supports a second transducer for simultaneous views.",
    },
  ],
  "l-hds-live": [{ sonarKey: "activetarget-2", verdict: "yes" }],
  "l-hds-carbon": [{ sonarKey: "activetarget-2", verdict: "yes" }],
  "l-elite-fs": [{ sonarKey: "activetarget-2", verdict: "yes" }],
  "l-elite-ti2": [
    {
      sonarKey: "activetarget-2",
      verdict: "check",
      note: "Elite Ti2 is not listed among Lowrance's supported ActiveTarget 2 displays. Confirm with Lowrance for your exact model and software version before buying.",
    },
  ],
  "l-hook": [
    {
      sonarKey: "activetarget-2",
      verdict: "no",
      note: "HOOK2 and HOOK Reveal are entry-level units without the networking required for live sonar.",
    },
  ],

  // ---- Humminbird ----
  "h-xplore": [
    { sonarKey: "mega-live-2", verdict: "yes" },
    { sonarKey: "mega-live-1", verdict: "yes" },
  ],
  "h-apex": [
    { sonarKey: "mega-live-2", verdict: "yes" },
    { sonarKey: "mega-live-1", verdict: "yes" },
  ],
  "h-solix-g3": [
    { sonarKey: "mega-live-2", verdict: "yes" },
    { sonarKey: "mega-live-1", verdict: "yes" },
  ],
  "h-solix-g1-g2": [
    {
      sonarKey: "mega-live-2",
      verdict: "no",
      note: "MEGA Live 2 requires XPLORE, APEX or SOLIX G3. Older SOLIX generations are not supported.",
    },
    { sonarKey: "mega-live-1", verdict: "yes" },
  ],
  "h-helix-g4n": [
    {
      sonarKey: "mega-live-2",
      verdict: "no",
      note: "MEGA Live 2 does not support any HELIX unit. MEGA Live 1 is the option for HELIX owners.",
    },
    { sonarKey: "mega-live-1", verdict: "yes", note: ADAPTER_NOTE },
  ],
  "h-helix-g3n": [
    {
      sonarKey: "mega-live-2",
      verdict: "no",
      note: "MEGA Live 2 does not support any HELIX unit. MEGA Live 1 is the option for HELIX owners.",
    },
    {
      sonarKey: "mega-live-1",
      verdict: "yes",
      note: `${ADAPTER_NOTE} On G3N, MEGA Live 1 requires a HELIX 8 or larger.`,
    },
  ],
  "h-helix-small": [
    {
      sonarKey: "mega-live-2",
      verdict: "no",
      note: "MEGA Live 2 does not support any HELIX unit.",
    },
    {
      sonarKey: "mega-live-1",
      verdict: "no",
      note: "MEGA Live 1 needs a HELIX G3N 8\" or larger, or a G4N 7\" or larger with MEGA imaging. Smaller and older HELIX units are not supported.",
    },
  ],
  "h-piranhamax": [
    {
      sonarKey: "mega-live-2",
      verdict: "no",
      note: "PIRANHAMAX is an entry-level fishfinder with no networking, so it cannot run live sonar of any kind.",
    },
    { sonarKey: "mega-live-1", verdict: "no" },
  ],
};

export const BRANDS: Brand[] = ["Garmin", "Lowrance", "Humminbird"];

export function displaysForBrand(brand: Brand): Display[] {
  return DISPLAYS.filter((d) => d.brand === brand);
}

export function resultsForDisplay(displayKey: string): Result[] {
  return COMPATIBILITY[displayKey] ?? [];
}

export function getSonar(key: string): LiveSonarSystem | undefined {
  return LIVE_SONAR.find((s) => s.key === key);
}

export function getDisplay(key: string): Display | undefined {
  return DISPLAYS.find((d) => d.key === key);
}
