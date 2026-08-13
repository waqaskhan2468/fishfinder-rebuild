// One-time patch: fills in blank markdown image alt text (`![](...)`) with
// a phrase derived from the filename, without re-running the full HTML
// extraction (which would overwrite manual fixes like the Garmin photos).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");

function altFromFilename(src) {
  const base = src.split("/").pop() ?? "";
  const noExt = base.replace(/\.[a-z0-9]+$/i, "");
  const noDims = noExt.replace(/-\d+x\d+$/i, "");
  const noLeadingNumber = noDims.replace(/^\d+-/, "");
  return noLeadingNumber.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

let totalFixed = 0;
for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!file.endsWith(".mdx")) continue;
  const filePath = path.join(POSTS_DIR, file);
  const original = fs.readFileSync(filePath, "utf-8");
  let fixedCount = 0;

  const updated = original.replace(/!\[\]\((\/images\/[^)]+)\)/g, (match, src) => {
    fixedCount += 1;
    return `![${altFromFilename(src)}](${src})`;
  });

  if (fixedCount > 0) {
    fs.writeFileSync(filePath, updated);
    console.log(`${file}: filled ${fixedCount} alt attributes`);
    totalFixed += fixedCount;
  }
}
console.log(`Total: ${totalFixed}`);
