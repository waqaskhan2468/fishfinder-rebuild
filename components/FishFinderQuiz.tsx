"use client";

import { useState } from "react";
import Image from "next/image";
import { QUESTIONS, recommend } from "@/lib/quiz";

export type QuizProduct = {
  name: string;
  brand: string;
  image?: string;
  priceBand?: string;
  href: string;
};

export default function FishFinderQuiz({ products }: { products: Record<string, QuizProduct> }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  const done = step >= QUESTIONS.length;
  const current = QUESTIONS[step];

  function choose(value: string) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    setStep(step + 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  if (!done) {
    return (
      <div className="quiz">
        <div className="quiz-progress">
          Question {step + 1} of {QUESTIONS.length}
        </div>
        <h2 className="quiz-question">{current.question}</h2>
        <div className="quiz-options">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => choose(opt.value)}
              className="quiz-option"
            >
              <span className="quiz-option-label">{opt.label}</span>
              {opt.hint && <span className="quiz-option-hint">{opt.hint}</span>}
            </button>
          ))}
        </div>
        {step > 0 && (
          <button type="button" className="quiz-back" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
      </div>
    );
  }

  const result = recommend(answers);
  const main = products[result.productKey];
  const alt = result.alternateKey ? products[result.alternateKey] : undefined;

  return (
    <div className="quiz quiz-result" role="status" aria-live="polite">
      <span className="quiz-result-eyebrow">Our recommendation</span>

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
            {main.priceBand && <span className="quiz-card-price">Typically {main.priceBand}</span>}
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
          <a href={alt.href} target="_blank" rel="nofollow sponsored" className="quiz-alt-link">
            Check price →
          </a>
        </div>
      )}

      <button type="button" onClick={reset} className="quiz-reset">
        Start over
      </button>
    </div>
  );
}
