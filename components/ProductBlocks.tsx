import Image from "next/image";
import { getProduct, amazonUrl, type Product } from "@/lib/products";

/**
 * These render from custom HTML tags inside .mdx content, e.g.
 *   <product-cta data-id="garmin-striker-4"></product-cta>
 *   <product-table data-ids="a,b,c"></product-table>
 *
 * Custom tag names are used (rather than JSX components) because the MDX
 * pipeline runs in `format: "md"` with rehype-raw — plain markdown plus raw
 * HTML — so JSX is not parsed but unknown HTML tags pass through and can be
 * mapped to components.
 */

function AmazonIcon() {
  return (
    <svg viewBox="0 0 448 512" aria-hidden="true" className="amazon-button-icon" fill="currentColor">
      <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" />
    </svg>
  );
}

function BuyButton({ product, label }: { product: Product; label?: string }) {
  return (
    <a
      href={amazonUrl(product)}
      target="_blank"
      rel="nofollow sponsored"
      className="amazon-button"
    >
      <AmazonIcon />
      {label ?? "Check Price on Amazon"}
    </a>
  );
}

/** Full-width call-to-action for a single product. */
export function ProductCta(props: { "data-id"?: string; "data-label"?: string }) {
  const product = getProduct(props["data-id"] ?? "");
  if (!product) return null;

  return (
    <div className="product-cta">
      <div className="product-cta-meta">
        <span className="product-cta-name">{product.name}</span>
        {product.priceBand && <span className="product-cta-price">{product.priceBand}</span>}
      </div>
      <BuyButton product={product} label={props["data-label"]} />
    </div>
  );
}

/** Comparison table across several products. */
export function ProductTable(props: { "data-ids"?: string }) {
  const keys = (props["data-ids"] ?? "").split(",").map((k) => k.trim()).filter(Boolean);
  const products = keys.map((k) => ({ key: k, product: getProduct(k) })).filter(
    (row): row is { key: string; product: Product } => row.product !== null,
  );
  if (products.length === 0) return null;

  return (
    <div className="product-table-wrap">
      <table className="product-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Best for</th>
            <th>Typical price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ key, product }) => (
            <tr key={key}>
              <td>
                <strong>{product.name}</strong>
                <span className="product-table-brand">{product.brand}</span>
              </td>
              <td>{product.blurb}</td>
              <td className="product-table-price">{product.priceBand ?? "—"}</td>
              <td>
                <BuyButton product={product} label="Check Price" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * "Top Picks" box for the top of a roundup.
 *
 * Most affiliate revenue comes from readers who never scroll past the first
 * screen, so the buying decision needs to be answerable immediately rather
 * than 3,000 words later.
 *
 * Authored as:
 *   <top-picks data-picks="Best Overall|garmin-striker-vivid-7sv; Best Budget|garmin-striker-4">
 *   </top-picks>
 */
export function TopPicks(props: { "data-picks"?: string }) {
  const picks = (props["data-picks"] ?? "")
    .split(";")
    .map((entry) => {
      const [label, key] = entry.split("|").map((s) => s.trim());
      const product = getProduct(key ?? "");
      return label && product ? { label, product } : null;
    })
    .filter((p): p is { label: string; product: Product } => p !== null);

  if (picks.length === 0) return null;

  return (
    <div className="top-picks">
      <h2 className="top-picks-title">Our Top Picks</h2>
      <div className="top-picks-grid">
        {picks.map(({ label, product }) => (
          <div key={label} className="top-pick">
            <span className="top-pick-label">{label}</span>
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                width={220}
                height={220}
                className="top-pick-img"
              />
            )}
            <strong className="top-pick-name">{product.name}</strong>
            {product.blurb && <p className="top-pick-blurb">{product.blurb}</p>}
            {product.priceBand && <span className="top-pick-price">{product.priceBand}</span>}
            <BuyButton product={product} label="Check Price" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Image + summary card, for a product's own section within a review. */
export function ProductCard(props: { "data-id"?: string }) {
  const product = getProduct(props["data-id"] ?? "");
  if (!product) return null;

  return (
    <div className="product-card">
      {product.image && (
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="product-card-img"
        />
      )}
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <strong className="product-card-name">{product.name}</strong>
        {product.blurb && <p className="product-card-blurb">{product.blurb}</p>}
        {product.priceBand && (
          <span className="product-card-price">Typically {product.priceBand}</span>
        )}
        <BuyButton product={product} />
      </div>
    </div>
  );
}
