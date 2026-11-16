"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_PERSONA, PERSONA_IDS, getPersonaById } from "./personas";

// State lives on <html>: data-persona (the chosen guide) and data-intro (the first-visit screen is open).
// An inline script in layout.tsx sets both before first paint, so there is no flash.

const root = () => document.documentElement;

function subscribe(attr: string) {
  return (cb: () => void) => {
    const obs = new MutationObserver(cb);
    obs.observe(root(), { attributes: true, attributeFilter: [attr] });
    return () => obs.disconnect();
  };
}
const subPersona = subscribe("data-persona");
const subIntro = subscribe("data-intro");

export function usePersona(): string {
  return useSyncExternalStore(subPersona, () => root().dataset.persona ?? DEFAULT_PERSONA, () => DEFAULT_PERSONA);
}

/** True while the guide selection screen should be shown. Server snapshot is true so the SSR markup contains it. */
export function useIntroOpen(): boolean {
  return useSyncExternalStore(subIntro, () => root().dataset.intro === "1", () => true);
}

function saved(): string {
  try {
    return localStorage.getItem("persona") ?? DEFAULT_PERSONA;
  } catch {
    return DEFAULT_PERSONA;
  }
}

function apply(id: string) {
  if (id === DEFAULT_PERSONA || !PERSONA_IDS.includes(id)) delete root().dataset.persona;
  else root().dataset.persona = id;
}

/** Temporarily show a guide's theme (hover). Pass null to return to the committed one. */
export function previewPersona(id: string | null) {
  apply(id ?? saved());
}

export function setPersona(id: string) {
  apply(id);
  try {
    localStorage.setItem("persona", id);
  } catch {}
  const greeting = getPersonaById(id)?.greeting ?? "Ask me anything about Shubham's work.";
  window.dispatchEvent(new CustomEvent("persona-changed", { detail: { greeting } }));
}

export const openIntro = () => {
  root().dataset.intro = "1";
};
export const closeIntro = () => {
  delete root().dataset.intro;
};

/** Calm mode: no pointer reactions or click effects from the backdrop. Stored on <html data-fx="calm">. */
const subFx = subscribe("data-fx");
export function useCalm(): boolean {
  return useSyncExternalStore(subFx, () => root().dataset.fx === "calm", () => false);
}
export function setCalm(on: boolean) {
  if (on) root().dataset.fx = "calm";
  else delete root().dataset.fx;
  try {
    localStorage.setItem("fx", on ? "calm" : "full");
  } catch {}
}
