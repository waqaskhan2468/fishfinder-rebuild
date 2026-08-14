"use client";

import { useState } from "react";
import {
  BRANDS,
  displaysForBrand,
  resultsForDisplay,
  getSonar,
  getDisplay,
  type Brand,
} from "@/lib/compatibility";

type BuyLink = { label: string; href: string };

export default function CompatibilityChecker({
  buyLinks,
}: {
  /** productKey -> tagged affiliate link, resolved on the server. */
  buyLinks: Record<string, BuyLink>;
}) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [displayKey, setDisplayKey] = useState<string | null>(null);

  const displays = brand ? displaysForBrand(brand) : [];
  const results = displayKey ? resultsForDisplay(displayKey) : [];
  const display = displayKey ? getDisplay(displayKey) : null;

  function reset() {
    setBrand(null);
    setDisplayKey(null);
  }

  return (
    <div className="cc">
      <ol className="cc-steps">
        {/* Step 1 — brand */}
        <li className="cc-step">
          <span className="cc-step-label">1. Which brand is your display?</span>
          <div className="cc-options">
            {BRANDS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setBrand(b);
                  setDisplayKey(null);
                }}
                className={`cc-option ${brand === b ? "is-selected" : ""}`}
                aria-pressed={brand === b}
              >
                {b}
              </button>
            ))}
          </div>
        </li>

        {/* Step 2 — display */}
        {brand && (
          <li className="cc-step">
            <span className="cc-step-label">2. Which model do you have?</span>
            <div className="cc-options cc-options-stack">
              {displays.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDisplayKey(d.key)}
                  className={`cc-option cc-option-wide ${displayKey === d.key ? "is-selected" : ""}`}
                  aria-pressed={displayKey === d.key}
                >
                  <span className="cc-option-name">{d.name}</span>
                  {d.hint && <span className="cc-option-hint">{d.hint}</span>}
                </button>
              ))}
            </div>
          </li>
        )}
      </ol>

      {/* Results */}
      {display && (
        <div className="cc-results" role="status" aria-live="polite">
          <h3 className="cc-results-title">
            Live sonar options for the <strong>{display.name}</strong>
          </h3>

          {results.length === 0 && (
            <p className="cc-empty">
              We don&apos;t have verified compatibility data for this model yet. Check with the
              manufacturer before buying.
            </p>
          )}

          <ul className="cc-result-list">
            {results.map((result) => {
              const sonar = getSonar(result.sonarKey);
              if (!sonar) return null;
              const buy = sonar.productKey ? buyLinks[sonar.productKey] : undefined;

              return (
                <li key={result.sonarKey} className={`cc-result cc-result-${result.verdict}`}>
                  <div className="cc-result-head">
                    <span className={`cc-badge cc-badge-${result.verdict}`}>
                      {result.verdict === "yes"
                        ? "Compatible"
                        : result.verdict === "no"
                          ? "Not compatible"
                          : "Check first"}
                    </span>
                    <span className="cc-result-name">{sonar.name}</span>
                  </div>

                  {(result.note || sonar.note) && (
                    <p className="cc-result-note">{result.note ?? sonar.note}</p>
                  )}

                  {result.verdict === "yes" && buy && (
                    <a
                      href={buy.href}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="amazon-button cc-result-cta"
                    >
                      {buy.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <button type="button" onClick={reset} className="cc-reset">
            Start over
          </button>
        </div>
      )}

      <p className="cc-disclaimer">
        Compatibility is based on manufacturer documentation and can change with firmware updates
        and new model revisions. Always confirm with the manufacturer before purchasing — these are
        expensive systems and returns can be costly.
      </p>
    </div>
  );
}
