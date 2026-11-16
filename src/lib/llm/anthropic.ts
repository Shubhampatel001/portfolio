import type { Provider } from "./types";
import { sseJson } from "./sse";

const MODEL = () => process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

export const anthropic: Provider = {
  name: "anthropic",
  enabled: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async stream({ system, messages }, signal) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL(), stream: true, max_tokens: 450, temperature: 0.3, system, messages }),
    });
    // 401/402/429/5xx (bad key, no credit, rate limit, outage) all throw so the chain falls through.
    if (!res.ok || !res.body) throw new Error(`anthropic ${res.status}`);
    const body = res.body;
    return (async function* () {
      for await (const evt of sseJson(body)) {
        const e = evt as { type?: string; delta?: { type?: string; text?: string } };
        if (e.type === "content_block_delta" && e.delta?.type === "text_delta" && e.delta.text) yield e.delta.text;
      }
    })();
  },
};
