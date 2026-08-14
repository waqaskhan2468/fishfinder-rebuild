export type FaqItem = { question: string; answer: string };

/** Strips markdown emphasis, links and list markers down to readable plain text. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/<[^>]+>/g, "") // stray html / product tags
    .replace(/^[\s>]*[-*+]\s+/gm, "") // list bullets
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/[*_`]/g, "") // emphasis
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanQuestion(raw: string): string {
  return toPlainText(raw)
    .replace(/^Q\s*[:.)-]\s*/i, "") // legacy "Q: " prefix
    .replace(/^\d+[.)]\s*/, "") // numbered questions
    .trim();
}

/**
 * Extracts Q&A pairs from an article's FAQ section.
 *
 * Handles both formats present in this codebase: questions written as
 * sub-headings (the 2021 imported articles use `##### **Question**`) and
 * questions written as a standalone bold line (newer articles).
 *
 * Returns [] when no FAQ section exists — callers must not emit FAQPage
 * schema in that case, since empty or fabricated FAQ markup is a
 * structured-data violation.
 */
export function extractFaq(content: string): FaqItem[] {
  const lines = content.split("\n");

  // Locate the FAQ heading.
  const startIndex = lines.findIndex((line) =>
    /^#{2,3}\s+.*(frequently\s+asked|faqs?\b)/i.test(line.replace(/[*_]/g, "")),
  );
  if (startIndex === -1) return [];

  const startLevel = (lines[startIndex].match(/^#+/) ?? ["##"])[0].length;

  // Section runs until the next heading at the same or higher level.
  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s/);
    if (match && match[1].length <= startLevel) {
      endIndex = i;
      break;
    }
  }

  const section = lines.slice(startIndex + 1, endIndex);

  const items: FaqItem[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  const push = () => {
    if (!question) return;
    const text = toPlainText(answer.join("\n"));
    if (text) items.push({ question, answer: text });
    question = null;
    answer = [];
  };

  for (const line of section) {
    const heading = line.match(/^#{3,6}\s+(.*)$/);
    const boldOnly = line.trim().match(/^\*\*(.+?)\*\*:?$/);

    if (heading) {
      push();
      question = cleanQuestion(heading[1]);
    } else if (boldOnly && boldOnly[1].length < 200) {
      push();
      question = cleanQuestion(boldOnly[1]);
    } else if (question) {
      answer.push(line);
    }
  }
  push();

  return items.filter((item) => item.question.length > 0 && item.answer.length > 0);
}
