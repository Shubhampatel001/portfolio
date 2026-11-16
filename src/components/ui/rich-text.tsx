import { Fragment } from "react";

/** Inline: **bold** and bare URLs. Everything else renders as plain text (no raw HTML). */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]*[^\s).,;:!?])/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (/^https?:\/\//.test(p)) {
          return (
            <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2">
              {p}
            </a>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

/** Tiny markdown subset: paragraphs and "- " bullet lists. */
export function RichText({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const bullet = /^\s*[-*•]\s+/.test(line);
    const last = blocks[blocks.length - 1];
    const clean = line.replace(/^\s*[-*•]\s+/, "");
    if (last && last.list === bullet) last.lines.push(clean);
    else blocks.push({ list: bullet, lines: [clean] });
  }
  return (
    <div className="space-y-2">
      {blocks.map((b, i) =>
        b.list ? (
          <ul key={i} className="list-disc space-y-1 pl-4">
            {b.lines.map((l, j) => (
              <li key={j}>
                <Inline text={l} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={b.lines.join(" ")} />
          </p>
        )
      )}
    </div>
  );
}
