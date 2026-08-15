"use client";

import { useState } from "react";
import Image from "next/image";
import { QUESTIONS, recommend } from "@/lib/quiz";
import type { ToolProduct } from "@/components/CompatibilityChecker";

export type QuizProduct = ToolProduct;

export default function FishFinderQuiz({ products }: { products: Record<string, QuizProduct> }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalSteps = QUESTIONS.length;
  const onResults = step >= totalSteps;
  const current = QUESTIONS[step];
  const currentAnswer = current ? answers[current.id] : undefined;

  function reset() {
    setStep(0);
    setAnswers({});
  }

  const result = onResults ? recommend(answers) : null;
  const main = result ? products[result.productKey] : undefined;
  const alt = result?.alternateKey ? products[result.alternateKey] : undefined;

  return (
    <div className="tool">
      <div className="tool-header">
        <span className="tool-badge">Free Tool</span>
        <h2 className="tool-title">Fish Finder Finder</h2>
        <p className="tool-sub">Three questions. One specific recommendation.</p>
      </div>

      <div className="tool-body">
        {/* Progress */}
        <ol className="tool-progress" aria-label="Progress">
          {[...QUESTIONS.map((q) => q.id), "result"].map((id, i) => (
            <li
              key={id}
              className={`tool-progress-step ${i === step ? "is-current" : ""} ${
                i < step ? "is-done" : ""
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="tool-progress-num">{i < step ? "✓" : i + 1}</span>
              <span className="tool-progress-label">
                {i === totalSteps ? "Result" : `Q${i + 1}`}
              </span>
            </li>
          ))}
        </ol>

        {/* Questions */}
        {!onResults && current && (
          <div className="tool-step">
            <h3 className="tool-question">{current.question}</h3>
            <div className="tool-choices tool-choices-grid">
              {current.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [current.id]: opt.value })}
                  className={`tool-choice ${currentAnswer === opt.value ? "is-selected" : ""}`}
                  aria-pressed={currentAnswer === opt.value}
                >
                  <span className="tool-choice-name">{opt.label}</span>
                  {opt.hint && <span className="tool-choice-hint">{opt.hint}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {onResults && result && (
          <div className="tool-step" role="status" aria-live="polite">
            <span className="quiz-result-eyebrow">Our recommendation for you</span>

            {main && (
              <div className="quiz-card">
                {main.image && (
                  <Image
                    src={main.image}
                    alt={main.name}
                    width={220}
                    height={220}
                    className="quiz-card-img"
                  />
                )}
                <div className="quiz-card-body">
                  <span className="quiz-card-brand">{main.brand}</span>
                  <strong className="quiz-card-name">{main.name}</strong>
                  {main.priceBand && (
                    <span className="quiz-card-price">Typically {main.priceBand}</span>
                  )}
                  <p className="quiz-card-reason">{result.reason}</p>
                  <a
                    href={main.href}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="amazon-button quiz-card-cta"
                  >
                    Check Price on Amazon
                  </a>
                </div>
              </div>
            )}

            {alt && result.alternateReason && (
              <div className="quiz-alt">
                <span className="quiz-alt-label">Also worth considering</span>
                <strong className="quiz-alt-name">{alt.name}</strong>
                <p className="quiz-alt-reason">{result.alternateReason}</p>
                <a
                  href={alt.href}
                  target="_blank"
                  rel="nofollow sponsored"
                  className="quiz-alt-link"
                >
                  Check price →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="tool-actions">
          {step > 0 && (
            <button
              type="button"
              className="tool-btn tool-btn-ghost"
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>
          )}

          {!onResults && (
            <button
              type="button"
              className="tool-btn tool-btn-primary"
              disabled={!currentAnswer}
              onClick={() => setStep(step + 1)}
            >
              {step === totalSteps - 1 ? "See my recommendation" : "Next"} →
            </button>
          )}

          {onResults && (
            <button type="button" className="tool-btn tool-btn-ghost" onClick={reset}>
              Start over
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
