import Script from "next/script";

// GA4 Measurement IDs are public by design — they appear in client-side page
// source on every site that uses them — so there's no benefit to hiding this
// in an env var, and keeping it here means no Vercel config to forget.
const GA_MEASUREMENT_ID = "G-LMJDFTGHFV";

/**
 * Google Analytics 4.
 *
 * Deliberately skipped outside production so local development and preview
 * deployments don't inflate session counts — that matters here because
 * Mediavine's eligibility threshold is measured in real sessions.
 *
 * `afterInteractive` lets the page become usable before the tag loads, so
 * analytics doesn't cost us Core Web Vitals.
 */
export default function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
