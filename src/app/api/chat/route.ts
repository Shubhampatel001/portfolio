import { NextRequest } from "next/server";
import { retrieve, MIN_CONFIDENT_SCORE } from "@/lib/retrieval";
import { buildSystem, isKnownPersona } from "@/lib/chat-prompt";
import { streamWithFallback } from "@/lib/llm/chain";
import type { ChatMessage } from "@/lib/llm/types";

export const maxDuration = 30;

const MAX_INPUT = 500;
const MAX_HISTORY = 6;

// Best-effort per-instance rate limit (resets on cold start). Swap for KV/Upstash if abuse appears.
const WINDOW_MS = 10 * 60_000;
const MAX_REQS = 20;
const requests = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (requests.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  requests.set(ip, recent);
  if (requests.size > 5000) {
    for (const [k, v] of requests) if (v.every((t) => now - t >= WINDOW_MS)) requests.delete(k);
  }
  return recent.length > MAX_REQS;
}

/** Keeps the last few turns, trims length, and requires the final turn to be from the user. */
function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_HISTORY)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    out.push({ role: m.role, content: m.content.slice(0, MAX_INPUT) });
  }
  while (out.length && out[0].role !== "user") out.shift();
  return out.length && out[out.length - 1].role === "user" ? out : null;
}

const textHeaders = { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" };

/** Last resort when every LLM is unavailable: answer straight from the best-matching facts. */
function noLlmAnswer(found: ReturnType<typeof retrieve>): string {
  if (!found.length || found[0].score < MIN_CONFIDENT_SCORE) {
    return "I don't have that information. You can ask about Shubham's experience, projects, skills or availability, or email him directly from the contact section.";
  }
  const top = found.slice(0, 2).map((h) => `${h.title}\n${h.text.slice(0, 600)}`);
  return `Here is what I have on that:\n\n${top.join("\n\n")}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) {
    return new Response("Too many questions for now. Please try again in a few minutes.", {
      status: 429,
      headers: textHeaders,
    });
  }

  let body: { messages?: unknown; persona?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request.", { status: 400, headers: textHeaders });
  }
  const messages = parseMessages(body.messages);
  if (!messages) return new Response("Invalid messages.", { status: 400, headers: textHeaders });

  const persona = isKnownPersona(body.persona) ? body.persona : "pixel";
  // Retrieve on the last two user turns so follow-ups like "tell me more" keep their topic.
  const query = messages
    .filter((m) => m.role === "user")
    .slice(-2)
    .map((m) => m.content)
    .join(" ");
  const found = retrieve(query, 5);

  // Dev-only failure injection to test the fallback chain: header x-chat-skip: anthropic,groq
  const skip = process.env.NODE_ENV !== "production" ? (req.headers.get("x-chat-skip") ?? "").split(",") : [];
  const result = await streamWithFallback({ system: buildSystem(persona, found), messages }, skip);

  if (!result) {
    return new Response(noLlmAnswer(found), { headers: { ...textHeaders, "x-chat-provider": "none" } });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of result.stream) controller.enqueue(encoder.encode(delta));
      } catch (err) {
        console.warn("[chat] stream interrupted:", err instanceof Error ? err.message : err);
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { ...textHeaders, "x-chat-provider": result.provider } });
}
