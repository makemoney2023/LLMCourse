/** Slugify a heading for URL hash anchors. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Add id attributes to h2/h3 tags that lack them. */
export function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs = "", inner: string) => {
      if (/\sid\s*=/.test(attrs)) return full;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = slugifyHeading(text);
      if (!id) return full;
      const spaced = attrs?.trim() ? ` ${attrs.trim()}` : "";
      return `<${tag}${spaced} id="${id}">${inner}</${tag}>`;
    },
  );
}
