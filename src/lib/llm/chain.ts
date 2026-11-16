import { anthropic } from "./anthropic";
import { groq } from "./groq";
import type { LlmRequest, Provider } from "./types";

// Order matters: Claude first (best quality), then the free tier.
const PROVIDERS: Provider[] = [anthropic, groq];

export type ChainResult = { provider: string; stream: AsyncGenerator<string> } | null;

/**
 * Tries each enabled provider until one starts streaming.
 * `skip` is a dev-only failure injection so the fallback path can be tested without breaking keys.
 */
export async function streamWithFallback(req: LlmRequest, skip: string[] = []): Promise<ChainResult> {
  for (const p of PROVIDERS) {
    if (!p.enabled() || skip.includes(p.name)) continue;
    try {
      const stream = await p.stream(req, AbortSignal.timeout(20_000));
      return { provider: p.name, stream };
    } catch (err) {
      console.warn(`[chat] provider ${p.name} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return null;
}
