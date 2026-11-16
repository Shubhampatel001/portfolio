"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UiMessage = { id: number; role: "user" | "assistant"; content: string; error?: boolean };

export const MAX_INPUT = 500;

/** Streams answers from /api/chat. Errors become assistant-styled messages so the UI never dead-ends. */
export function useChat(persona = "pixel") {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const nextId = useRef(1);

  useEffect(() => () => abort.current?.abort(), []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_INPUT);
      if (!text || busy) return;

      const userMsg: UiMessage = { id: nextId.current++, role: "user", content: text };
      const replyId = nextId.current++;
      // Only real turns go back to the server (not error bubbles).
      const history = [...messages, userMsg]
        .filter((m) => !m.error)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((m) => [...m, userMsg, { id: replyId, role: "assistant", content: "" }]);
      setBusy(true);

      const patch = (fn: (m: UiMessage) => UiMessage) =>
        setMessages((all) => all.map((m) => (m.id === replyId ? fn(m) : m)));

      const ctrl = new AbortController();
      abort.current = ctrl;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history, persona }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const msg = (await res.text().catch(() => "")).trim();
          patch((m) => ({ ...m, content: msg || "Something went wrong. Please try again.", error: true }));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snapshot = acc;
          patch((m) => ({ ...m, content: snapshot }));
        }
        if (!acc.trim()) patch((m) => ({ ...m, content: "I couldn't come up with an answer. Please try rephrasing.", error: true }));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          patch((m) => ({ ...m, content: "Connection problem. Please try again.", error: true }));
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, persona]
  );

  const clear = useCallback(() => {
    abort.current?.abort();
    setMessages([]);
    setBusy(false);
  }, []);

  return { messages, busy, send, clear };
}
