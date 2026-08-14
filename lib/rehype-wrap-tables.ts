import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * Wraps every <table> in a horizontally scrollable container.
 *
 * Markdown tables can't carry a wrapper element of their own, so on narrow
 * screens they either squeeze columns until text wraps one word per line, or
 * push the whole page sideways. Wrapping them lets the table keep a usable
 * minimum width and scroll within its own box instead.
 *
 * Tables emitted by <product-table> already have their own wrapper, so those
 * are skipped to avoid double-wrapping.
 */
export default function rehypeWrapTables() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "table") return;
      if (!parent || index === null || index === undefined) return;

      const parentEl = parent as Element;
      if (
        parentEl.type === "element" &&
        Array.isArray(parentEl.properties?.className) &&
        (parentEl.properties.className as string[]).includes("product-table-wrap")
      ) {
        return;
      }

      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"] },
        children: [node],
      };

      (parent as Element).children[index] = wrapper;
    });
  };
}
