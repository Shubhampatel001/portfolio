import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
// Inline the JSON import (no bundler here), then load the TS module via Node's type stripping.
const src = readFileSync(join(root, "src/lib/retrieval.ts"), "utf8").replace(
  'import knowledge from "@/data/knowledge.json";',
  `const knowledge = ${readFileSync(join(root, "src/data/knowledge.json"), "utf8")};`
);
const file = join(mkdtempSync(join(tmpdir(), "ret-")), "retrieval.ts");
writeFileSync(file, src);
const mod = await import(pathToFileURL(file).href);

const cases = [
  ["what is FarmAid?", /FarmAid|farmAid/],
  ["which database did Perplexa use?", /Perplexa/],
  ["tell me about genetic algorithm driving", /EvoDrive/],
  ["what certifications does he have", /Certifications/],
  ["where did he study?", /Education/],
  ["is he open to new roles", /Availability/],
];
let fail = 0;
for (const [q, want] of cases) {
  const top = mod.retrieve(q, 3);
  const ok = top.some((h) => want.test(h.title));
  if (!ok) fail++;
  console.log(ok ? "PASS" : "FAIL", q, "->", top.map((h) => `${h.title} (${h.score.toFixed(1)})`).join(" | "));
}
const off = mod.retrieve("what is his salary expectation in dollars", 1);
console.log("off-topic top score:", off[0]?.score?.toFixed(2) ?? "none", "(threshold", mod.MIN_CONFIDENT_SCORE + ")");
process.exit(fail ? 1 : 0);
