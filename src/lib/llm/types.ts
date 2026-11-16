export type ChatMessage = { role: "user" | "assistant"; content: string };

export type LlmRequest = { system: string; messages: ChatMessage[] };

/** A provider returns a stream of plain-text deltas, or throws before any output so the chain can fall back. */
export type Provider = {
  name: string;
  enabled: () => boolean;
  stream: (req: LlmRequest, signal: AbortSignal) => Promise<AsyncGenerator<string>>;
};
