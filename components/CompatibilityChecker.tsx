"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BRANDS,
  displaysForBrand,
  resultsForDisplay,
  getSonar,
  getDisplay,
  UPGRADE_PATHS,
  type Brand,
} from "@/lib/compatibility";

export type ToolProduct = {
  name: string;
  brand: string;
  image?: string;
  priceBand?: string;
  href: string;
};

const STEPS = ["Brand", "Model", "Results"] as const;

export default function CompatibilityChecker({
  products,
}: {
  /** productKey -> resolved product with tagged affiliate link. */
  products: Record<string, ToolProduct>;
}) {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [displayKey, setDisplayKey] = useState<string | null>(null);

  const displays = brand ? displaysForBrand(brand) : [];
  const results = displayKey ? resultsForDisplay(displayKey) : [];
  const display = displayKey ? getDisplay(displayKey) : null;

  const canAdvance = step === 0 ? Boolean(brand) : step === 1 ? Boolean(displayKey) : false;
  const anyIncompatible = results.some((r) => r.verdict === "no");
  const upgrade = brand ? UPGRADE_PATHS[brand] : null;

  function reset() {
    setStep(0);
    setBrand(null);
    setDisplayKey(null);
  }

  return (
    <div className="tool">
      <div className="tool-header">
        <span className="tool-badge">Free Tool</span>
        <h2 className="tool-title">Live Sonar Compatibility Checker</h2>
        <p className="tool-sub">Find out what works with your unit before you spend $1,300+</p>
      </div>

      <div className="tool-body">
        {/* Progress */}
        <ol className="tool-progress" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`tool-progress-step ${i === step ? "is-current" : ""} ${
                i < step ? "is-done" : ""
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="tool-progress-num">{i < step ? "✓" : i + 1}</span>
              <span className="tool-progress-label">{label}</span>
            </li>
          ))}
        </ol>

        {/* Step 1 — brand */}
        {step === 0 && (
          <div className="tool-step">
            <h3 className="tool-question">Which brand is your display?</h3>
            <div className="tool-choices tool-choices-row">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    setDisplayKey(null);
                  }}
                  className={`tool-choice ${brand === b ? "is-selected" : ""}`}
                  aria-pressed={brand === b}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — model */}
        {step === 1 && (
          <div className="tool-step">
            <h3 className="tool-question">Which {brand} model do you have?</h3>
            <div className="tool-choices">
              {displays.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDisplayKey(d.key)}
                  className={`tool-choice tool-choice-wide ${displayKey === d.key ? "is-selected" : ""}`}
                  aria-pressed={displayKey === d.key}
                >
                  <span className="tool-choice-name">{d.name}</span>
                  {d.hint && <span className="tool-choice-hint">{d.hint}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — results */}
        {step === 2 && display && (
          <div className="tool-step" role="status" aria-live="polite">
            <h3 className="tool-question">
              Live sonar options for the <strong>{display.name}</strong>
            </h3>

            <ul className="cc-result-list">
              {results.map((result) => {
                const sonar = getSonar(result.sonarKey);
                if (!sonar) return null;
                const product = sonar.productKey ? products[sonar.productKey] : undefined;

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

                    {result.verdict === "yes" && product && (
                      <a
                        href={product.href}
                        target="_blank"
                        rel="nofollow sponsored"
                        className="amazon-button cc-result-cta"
                      >
                        Check price on Amazon
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* When nothing works, show what would */}
            {anyIncompatible && upgrade && (
              <div className="cc-upgrade">
                <h4 className="cc-upgrade-title">What would work instead</h4>
                <p className="cc-upgrade-note">{upgrade.note}</p>
                {upgrade.productKeys.length > 0 && (
                  <div className="cc-upgrade-grid">
                    {upgrade.productKeys.map((key) => {
                      const p = products[key];
                      if (!p) return null;
                      return (
                        <div key={key} className="cc-upgrade-card">
                          {p.image && (
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={160}
                              height={160}
                              className="cc-upgrade-img"
                            />
                          )}
                          <strong className="cc-upgrade-name">{p.name}</strong>
                          {p.priceBand && <span className="cc-upgrade-price">{p.priceBand}</span>}
                          <a
                            href={p.href}
                            target="_blank"
                            rel="nofollow sponsored"
                            className="amazon-button cc-upgrade-cta"
                          >
                            Check price
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="tool-actions">
          {step > 0 && (
            <button type="button" className="tool-btn tool-btn-ghost" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}

          {step < 2 && (
            <button
              type="button"
              className="tool-btn tool-btn-primary"
              disabled={!canAdvance}
              onClick={() => setStep(step + 1)}
            >
              {step === 1 ? "See results" : "Next"} →
            </button>
          )}

          {step === 2 && (
            <button type="button" className="tool-btn tool-btn-ghost" onClick={reset}>
              Start over
            </button>
          )}
        </div>
      </div>

      <p className="tool-disclaimer">
        Compatibility is based on manufacturer documentation and can change with firmware updates
        and new model revisions. Always confirm with the manufacturer before purchasing — these are
        expensive systems and returns can be costly.
      </p>
    </div>
  );
}
