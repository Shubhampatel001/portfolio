import knowledge from "@/data/knowledge.json";

export type Chunk = { id: string; source: string; title: string; text: string };
export type Hit = Chunk & { score: number };

const chunks = knowledge as Chunk[];

const STOP = new Set(
  "a an the and or of to in on at for with is are was were be been it its this that these those do does did what which who whom how about tell me you your his he him shubham patel s any can has have had from by as into than then so if not no".split(" ")
);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#.]+/g) ?? [])
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t && !STOP.has(t))
    .map((t) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t));
}

// Index is built once per server instance. Titles are weighted by repetition.
const docs = chunks.map((c) => {
  const tokens = [...tokenize(c.title), ...tokenize(c.title), ...tokenize(c.text)];
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { tf, len: tokens.length };
});
const avgLen = docs.reduce((n, d) => n + d.len, 0) / Math.max(docs.length, 1);
const df = new Map<string, number>();
for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);

const K1 = 1.4;
const B = 0.75;

// Query-side synonyms so everyday wording reaches the right section.
const EXPAND: Record<string, string[]> = {
  study: ["education", "degree", "college", "university"],
  studied: ["education", "degree", "college", "university"],
  college: ["education", "degree"],
  university: ["education", "degree"],
  school: ["education"],
  degree: ["education"],
  graduate: ["education", "degree"],
  hire: ["availability", "roles", "open"],
  hiring: ["availability", "roles", "open"],
  available: ["availability", "roles", "open"],
  job: ["experience", "availability"],
  work: ["experience"],
  worked: ["experience"],
  company: ["experience"],
  built: ["project"],
  made: ["project"],
  language: ["skill", "stack"],
  tech: ["skill", "stack"],
  about: ["summary", "one", "minute"],
  yourself: ["summary", "one", "minute"],
  strength: ["working", "style", "strengths"],
  hobby: ["interests", "outside", "work"],
  hobbies: ["interests", "outside", "work"],
  interest: ["interests", "outside", "work"],
  contact: ["reach", "email"],
  reach: ["email", "contact"],
  certificate: ["certification"],
  course: ["certification"],
};

/** BM25 top-k. Returns only chunks with a positive score. */
export function retrieve(query: string, k = 5): Hit[] {
  const base = tokenize(query);
  const q = [...new Set([...base, ...base.flatMap((t) => EXPAND[t] ?? [])])];
  if (!q.length) return [];
  const N = docs.length;
  const hits: Hit[] = [];
  docs.forEach((d, i) => {
    let score = 0;
    for (const t of q) {
      const f = d.tf.get(t);
      if (!f) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgLen));
    }
    if (score > 0) hits.push({ ...chunks[i], score });
  });
  return hits.sort((a, b) => b.score - a.score).slice(0, k);
}

export const MIN_CONFIDENT_SCORE = 2.5;
