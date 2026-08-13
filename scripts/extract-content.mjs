// One-time migration script: parses the recovered WordPress HTML in
// old_website_files/ and writes clean .mdx files into content/posts/.
// Run with: npx tsx scripts/extract-content.mjs
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ROOT = path.resolve(import.meta.dirname, "..");
const OLD_DIR = path.join(ROOT, "old_website_files");
const OUT_DIR = path.join(ROOT, "content", "posts");
const SITE = "bestfishfinderstoday.com";

// slug -> source html file (relative to OLD_DIR). "" is the homepage.
const ARTICLES = [
  { slug: "", file: "index.html" },
  { slug: "best-humminbird-fish-finder", file: "best-humminbird-fish-finder/index.html" },
  { slug: "best-ice-fishing-fish-finder", file: "best-ice-fishing-fish-finder/index.html" },
  { slug: "best-kayak-fish-finder", file: "best-kayak-fish-finder/index.html" },
  { slug: "fish-finders-for-small-boat", file: "fish-finders-for-small-boat/index.html" },
  { slug: "garmin-fish-finders", file: "garmin-fish-finders/index.html" },
  { slug: "how-to-read-a-garmin-fish-finder", file: "how-to-read-a-garmin-fish-finder/index.html" },
  {
    slug: "how-to-understand-the-images-on-the-fish-finder-screen",
    file: "how-to-understand-the-images-on-the-fish-finder-screen/index.html",
  },
  { slug: "lowrance-fish-finders", file: "lowrance-fish-finders/index.html" },
  {
    slug: "portable-fish-finders-ultimate-buying-guide",
    file: "portable-fish-finders-ultimate-buying-guide/index.html",
  },
  {
    slug: "what-is-a-portable-fish-finder-why-should-you-buy-it-in-2021",
    file: "what-is-a-portable-fish-finder-why-should-you-buy-it-in-2021/index.html",
  },
];

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});
turndown.use(gfm);
// Keep <a>, <img> and simplified comparison tables as raw HTML so we don't
// lose the ability to render affiliate-link attributes / next/image sizing
// at MDX-render time.
turndown.keep(["a", "img", "table", "thead", "tbody", "tr", "th", "td"]);

const CURRENT_YEAR = new Date().getFullYear();

// Replaces stale "in 2021" / "review 2021" style year mentions with the
// current year. The negative lookbehind for "/" protects image paths like
// /images/2021/08/... which must never be touched.
function refreshStaleYear(text) {
  return text.replace(/(?<!\/)\b20(19|2[0-5])\b/g, String(CURRENT_YEAR));
}

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cleanAttrs($el, keep = []) {
  const el = $el.get(0);
  if (!el || !el.attribs) return;
  for (const attr of Object.keys(el.attribs)) {
    if (!keep.includes(attr)) $el.removeAttr(attr);
  }
}

// Matches http(s)://site, protocol-relative //site, or a bare path — always
// resolves recovered WP upload URLs down to a local /images/... path.
function rewriteImageSrc(src) {
  if (!src) return src;
  return src.replace(new RegExp(`^(?:https?:)?//${SITE}`), "").replace("/wp-content/uploads", "/images");
}

// Derives readable alt text from a filename like
// "4-Garmin-Striker-Vivid-7sv-Easy-to-Use-1024x692.jpg" -> "Garmin Striker
// Vivid 7sv Easy to Use". Used when the source HTML had no alt attribute.
function altFromFilename(src) {
  if (!src) return "";
  const base = src.split("/").pop() ?? "";
  const noExt = base.replace(/\.[a-z0-9]+$/i, "");
  const noDims = noExt.replace(/-\d+x\d+$/i, "");
  const noLeadingNumber = noDims.replace(/^\d+-/, "");
  return noLeadingNumber.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function rewriteInternalHref(href) {
  if (!href) return href;
  if (/^(?:https?:)?\/\/(?:www\.)?bestfishfinderstoday\.com/i.test(href)) {
    const normalized = href.replace(/^(?:https?:)?\/\/(?:www\.)?bestfishfinderstoday\.com/i, "");
    return normalized || "/";
  }
  return href;
}

// The recovered pages use a "WP Table Builder" comparison table at the top
// of most reviews (Image / Product Name / Price columns) full of plugin
// cruft (inline styles, SVG icons, tracking data-* attrs). Rebuild it as a
// minimal, readable table: image, product name, "Check on Amazon" link.
function simplifyProductTables($, $content) {
  $content.find("table").each((_, table) => {
    const $table = $(table);
    const rows = $table.find("tr").toArray();
    const cleanRows = [];
    for (const row of rows) {
      const $row = $(row);
      const $img = $row.find("img").first();
      const href = $row.find('a[href*="amzn.to"], a[href*="amazon."]').first().attr("href");
      const name = $row.find("td").eq(1).text().trim();
      if (!href || !name) continue; // skip header row
      const src = rewriteImageSrc($img.attr("src"));
      const alt = escapeAttr($img.attr("alt") || name);
      const safeName = escapeAttr(name);
      const safeHref = escapeAttr(href);
      cleanRows.push(
        `<tr><td>${src ? `<img src="${escapeAttr(src)}" alt="${alt}" />` : ""}</td><td>${safeName}</td><td><a href="${safeHref}">Check on Amazon</a></td></tr>`,
      );
    }
    if (cleanRows.length === 0) {
      $table.remove();
      return;
    }
    $table.replaceWith(
      `<table><thead><tr><th>Image</th><th>Product</th><th>Price</th></tr></thead><tbody>${cleanRows.join("")}</tbody></table>`,
    );
  });
}

// The recovered pages wrap each product's pros/cons in nested WP column
// blocks with colored <h4> headers. Pull the item text out and replace the
// whole subtree with a plain-text placeholder token turndown won't touch,
// then splice clean semantic HTML back in after markdown conversion.
function extractProsConsBlocks($, $content) {
  const replacements = new Map();
  let counter = 0;

  $content.find(".wp-block-columns").each((_, el) => {
    const $cols = $(el);
    const $children = $cols.children(".wp-block-column");
    if ($children.length !== 2) return;

    const $first = $children.eq(0);
    const $second = $children.eq(1);
    const headingSelector = "h2, h3, h4, h5, h6";
    const firstLabel = $first.find(headingSelector).first().text().trim().toLowerCase();
    const secondLabel = $second.find(headingSelector).first().text().trim().toLowerCase();
    if (firstLabel !== "pros" || secondLabel !== "cons") return;

    const itemsFrom = ($col) => {
      const $list = $col.find("ul").first();
      if ($list.length) return $list.find("li").map((_, li) => $(li).text().trim()).get();
      const $p = $col.find("p").first();
      return $p.length ? [$p.text().trim()] : [];
    };

    const pros = itemsFrom($first);
    const cons = itemsFrom($second);
    const listHtml = (items) => `<ul>${items.map((i) => `<li>${escapeAttr(i)}</li>`).join("")}</ul>`;

    const token = `XPROSCONSBLOCKTOKENX${counter}X`;
    counter += 1;
    replacements.set(
      token,
      `<div class="pros-cons-grid"><div class="pros-box"><h4>Pros</h4>${listHtml(pros)}</div><div class="cons-box"><h4>Cons</h4>${listHtml(cons)}</div></div>`,
    );
    $cols.replaceWith(token);
  });

  return replacements;
}

function extractOne({ slug, file }) {
  const html = fs.readFileSync(path.join(OLD_DIR, file), "utf-8");
  const $ = cheerio.load(html);

  const rawTitle = $("head > title").first().text().trim();
  // WordPress titles often end with " -" or " - Site Name" fragments; the
  // recovered snapshot has inconsistent suffixes, so trim trailing " -".
  const title = refreshStaleYear(rawTitle.replace(/\s*-\s*$/, "").trim());
  const description = refreshStaleYear($('meta[name="description"]').attr("content")?.trim() ?? "");

  const $content = $(".entry-content.single-content").first();
  if ($content.length === 0) {
    throw new Error(`No .entry-content.single-content found in ${file}`);
  }

  // Strip widgets/scripts we don't want to carry over.
  $content.find("#ez-toc-container, script, style, noscript, .sharedaddy, .jp-relatedposts").remove();

  // Simplify the WP Table Builder comparison tables before general cleanup.
  simplifyProductTables($, $content);

  // Pull out pros/cons columns before the generic cleanup pass strips the
  // wp-block-column classes this detection relies on.
  const prosConsReplacements = extractProsConsBlocks($, $content);

  // Rewrite links.
  $content.find("a").each((_, el) => {
    const $a = $(el);
    const href = $a.attr("href");
    if (href) $a.attr("href", rewriteInternalHref(href));
    cleanAttrs($a, ["href"]);
  });

  // Rewrite images. Many source images have no alt text at all; fall back
  // to a descriptive phrase derived from the filename so every image has
  // something meaningful for accessibility and image search.
  $content.find("img").each((_, el) => {
    const $img = $(el);
    const src = $img.attr("src");
    const rewritten = src ? rewriteImageSrc(src) : src;
    if (rewritten) $img.attr("src", rewritten);
    if (!$img.attr("alt")?.trim()) {
      $img.attr("alt", altFromFilename(rewritten));
    }
    cleanAttrs($img, ["src", "alt", "width", "height"]);
  });

  // Strip presentational cruft (WP block-editor / Elementor classes,
  // inline styles, tracking data-* attrs) from every other element so the
  // markdown stays readable and styling comes entirely from Tailwind.
  $content.find("*").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName?.toLowerCase();
    if (["a", "img", "table", "thead", "tbody", "tr", "th", "td"].includes(tag)) return;
    cleanAttrs($el);
  });

  const contentHtml = $content.html() ?? "";
  let markdown = turndown.turndown(contentHtml).trim();
  for (const [token, html] of prosConsReplacements) {
    markdown = markdown.replace(token, `\n\n${html}\n\n`);
  }
  markdown = refreshStaleYear(markdown);

  // Find a hero/cover image: first image in the content. It's rendered
  // separately (bigger, full-width) by HeroImage, so strip the duplicate
  // leading `![]()` line from the body.
  const heroImg = $content.find("img").first().attr("src") ?? null;
  if (heroImg) {
    const heroLine = new RegExp(`^!\\[[^\\]]*\\]\\(${heroImg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)\\s*\\n*`);
    markdown = markdown.replace(heroLine, "");
  }

  const frontmatter = {
    title,
    description,
    slug: slug || "/",
    image: heroImg,
    date: "2021-09-01",
  };

  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");

  const outName = slug === "" ? "home.mdx" : `${slug}.mdx`;
  const outPath = path.join(OUT_DIR, outName);
  fs.writeFileSync(outPath, `---\n${fm}\n---\n\n${markdown}\n`);
  console.log(`wrote ${path.relative(ROOT, outPath)} (${markdown.length} chars)`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const article of ARTICLES) {
  extractOne(article);
}
