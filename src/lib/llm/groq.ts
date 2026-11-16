import type { Provider } from "./types";
import { sseJson } from "./sse";

// Groq exposes an OpenAI-compatible API. The model is overridable because free-tier model names change.
// Free-tier limits are per model, so a 429 on the primary model falls through to the smaller one.
const MODELS = () => [process.env.GROQ_MODEL || "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

export const groq: Provider = {
  name: "groq",
  enabled: () => Boolean(process.env.GROQ_API_KEY),
  async stream({ system, messages }, signal) {
    let lastStatus = 0;
    for (const model of MODELS()) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model,
          // gpt-oss models reason before answering; keep it short so replies start quickly.
          ...(model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
          stream: true,
          temperature: 0.3,
          max_tokens: 450,
          messages: [{ role: "system", content: system }, ...messages],
        }),
      });
      if (res.ok && res.body) return parse(res.body);
      lastStatus = res.status;
      if (res.status !== 429 && res.status !== 404 && res.status < 500) break; // bad key/request: next model won't help
    }
    throw new Error(`groq ${lastStatus}`);
  },
};

function parse(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  return (async function* () {
    for await (const evt of sseJson(body)) {
      const text = (evt as { choices?: { delta?: { content?: string } }[] }).choices?.[0]?.delta?.content;
      if (text) yield text;
    }
  })();
}
