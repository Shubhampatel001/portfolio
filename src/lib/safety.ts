import type { TalkKind } from "./smalltalk";

// Cheap, deterministic guardrails that sit around the model. The prompt does the main work; these catch
// the obvious cases before any LLM call and screen what comes back.

// Word list is deliberately short and matched on whole words (with common obfuscation of letters).
const BAD = [
  "fuck", "fucking", "fucker", "fucked", "shit", "shitty", "bitch", "bastard", "asshole", "arsehole", "dick", "dickhead",
  "pussy", "cunt", "slut", "whore", "nigger", "nigga", "faggot", "retard", "motherfucker", "bullshit", "piss", "wanker",
  "chutiya", "madarchod", "behenchod", "bhosdi", "gandu", "harami", "randi", "lund", "bhenchod",
];
const leet = (s: string) => s.toLowerCase().replace(/0/g, "o").replace(/[1!|]/g, "i").replace(/3/g, "e").replace(/[4@]/g, "a").replace(/\$/g, "s").replace(/5/g, "s");
const BAD_RE = new RegExp(`(?<![a-z])(${BAD.join("|")})(?![a-z])`, "i");
// Letters separated by dots/spaces/dashes, e.g. "f u c k" or "f.u.c.k".
const SPACED_RE = /\b(f[\s._-]*u[\s._-]*c[\s._-]*k|s[\s._-]*h[\s._-]*i[\s._-]*t|b[\s._-]*i[\s._-]*t[\s._-]*c[\s._-]*h)\b/i;

export function hasProfanity(text: string): boolean {
  return BAD_RE.test(leet(text)) || SPACED_RE.test(text);
}

const PRIVATE_RE = new RegExp(
  [
    "\\b(phone|mobile|cell|whatsapp|contact) ?(number|no\\.?|num)\\b",
    "\\bhis (number|phone|mobile)\\b",
    "\\b(call|text|ring) (him|me him)\\b.*\\b(number)\\b",
    "\\b(home|house|street|residential|permanent|postal)\\s+address\\b",
    "\\bwhere (exactly )?does he live\\b",
    "\\b(date of birth|dob|birthday|birth date|how old|his age)\\b",
    "\\b(aadhaar|aadhar|pan card|passport|ssn|social security|id number|driving licen[cs]e)\\b",
    "\\b(salary|ctc|compensation|pay ?scale|how much (does he|do you) (earn|make|get paid)|expected (salary|ctc|pay)|current pay|lpa)\\b",
    "\\b(notice period|last working day|joining date|how soon can he join)\\b",
    "\\b(family|parents?|mother|father|mom|dad|sister|brother|wife|husband|girlfriend|boyfriend|married|marital|relationship status)\\b",
    "\\b(religion|caste|politic(s|al)|his health|medical (history|condition)|disabilit(y|ies))\\b",
    "\\b(client (name|list)|confidential|nda|internal (tool|system|code)|proprietary)\\b",
  ].join("|"),
  "i"
);

const INJECT_RE =
  /(ignore|disregard|forget|override)[^.]{0,40}(previous|prior|above|earlier|all|your)[^.]{0,30}(instruction|rule|prompt|direction|guideline)|system prompt|your (instructions|prompt|rules)|reveal[^.]{0,20}(prompt|instruction|rule|key)|\b(dan|developer|jailbreak|god) mode\b|you are now\b|pretend (that )?you (are|have no)|\bact as (?!if)|break (out of )?character|stop (being|acting)|api[ _-]?key|<\/?context>|repeat after me|say the (word|f)/i;

export type Screen = { kind: TalkKind } | null;

/** Screens the visitor's latest message. Returns the kind of refusal to use, or null to continue. */
export function screenInput(text: string): Screen {
  if (hasProfanity(text)) return { kind: "abuse" };
  if (INJECT_RE.test(text)) return { kind: "inject" };
  if (PRIVATE_RE.test(text)) return { kind: "private" };
  return null;
}

/** Prevents visitor text from closing or forging the <context> block in the prompt. */
export function cleanInput(text: string): string {
  return text.replace(/<\/?\s*context\s*>/gi, " ").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
}

// A run of 10+ digits (phone/ID-like), allowing a space or dash between them. Year ranges stay safe.
const NUMBER_RE = /\+?\d(?:[\s-]?\d){9,}/;

/** True when a piece of model output should not be shown. */
export function unsafeOutput(text: string): boolean {
  return hasProfanity(text) || NUMBER_RE.test(text);
}

/**
 * Wraps a text stream and checks it sentence by sentence. If a sentence is unsafe, it is dropped and the
 * stream ends with `safeLine`. The check runs on everything seen so far, so words split across chunks
 * are still caught; the cost is that output appears one sentence late.
 */
export function guardStream(source: AsyncIterable<string>, safeLine: string): AsyncIterable<string> {
  return {
    async *[Symbol.asyncIterator]() {
      let pending = "";
      const flushable = /^[\s\S]*?[.!?\n]+(\s|$)/;
      for await (const delta of source) {
        pending += delta;
        let m: RegExpMatchArray | null;
        while ((m = pending.match(flushable)) && m[0].length < pending.length) {
          const sentence = m[0];
          pending = pending.slice(sentence.length);
          if (unsafeOutput(sentence)) {
            yield safeLine;
            return;
          }
          yield sentence;
        }
      }
      if (pending) yield unsafeOutput(pending) ? safeLine : pending;
    },
  };
}
