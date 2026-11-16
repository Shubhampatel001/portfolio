import { getPersonaById } from "./personas";

// Prewritten lines the guide says on its own: first-visit tour steps, idle hints and a remark when a
// section comes into view. No model calls. Keys must match src/lib/personas.ts ("pixel" is the neutral guide).

export type NudgeSection = "about" | "experience" | "projects" | "skills" | "contact";
export const NUDGE_SECTIONS: NudgeSection[] = ["about", "experience", "projects", "skills", "contact"];

/** What holding the mouse down does for each guide (the neutral guide has no page effects). */
const HOLD: Record<string, string | null> = {
  pixel: null,
  naruto: "hold the mouse button to charge a rasengan, then let go to blast it",
  spiderman: "hold the mouse button to load a giant web, then let go to fire it",
  batman: "hold the mouse button to ready a volley of batarangs, then let go to throw",
  pennywise: "hold the mouse button to blow up a balloon, then let go and see what happens",
  ghostface: "hold the mouse button and see who lunges out when you let go",
};

const IDLE: Record<string, string[]> = {
  pixel: ["Press / any time to ask me about Shubham's work.", "Not sure where to look? Ask me for his best project."],
  naruto: ["Psst! Try holding the mouse button down, then let go. Believe it!", "Need a hand? Press / and ask me anything about Shubham!"],
  spiderman: ["Quick tip: hold the mouse button, then release. Trust me, it's worth it.", "Press / and ask me anything. I won't even swing and miss."],
  batman: ["Hold the mouse button. Release. See what happens.", "Questions about Shubham? Press /."],
  pennywise: ["Hi-hi! Hold the mouse button down and let go. Go on!", "Ask me something. Press /. I don't bite. Much."],
  ghostface: ["Hold the mouse button. Then let go. What's the worst that could happen?", "Press /. Ask me about Shubham. Or are you too scared?"],
};

const PREFIX: Record<string, string[]> = {
  pixel: ["", "Quick note: "],
  naruto: ["Check this out! ", "Hey, look! "],
  spiderman: ["Heads up! ", "Friendly tip: "],
  batman: ["Noted. ", "Look closer. "],
  pennywise: ["Ooh, look! ", "Come see! "],
  ghostface: ["Interesting... ", "Keep scrolling... "],
};

const SECTION: Record<NudgeSection, string> = {
  about: "This is the short version of who Shubham is.",
  experience: "This is his work history, from his current role at LTM in Pune back to his first internship.",
  projects: "These are his projects. Open any one to see the problem, the solution and what he learned.",
  skills: "This is his toolkit: Java, Spring Boot, Angular, React, Next.js and more.",
  contact: "Want to reach Shubham? Email is the quickest way.",
};

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

export const idleNudge = (persona: string) => pick(IDLE[persona] ?? IDLE.pixel);
export const sectionNudge = (persona: string, section: NudgeSection) => `${pick(PREFIX[persona] ?? PREFIX.pixel)}${SECTION[section]}`.trim();

export type TourStep = {
  text: string;
  /** Matches a data-tour attribute in the dock; steps without one are about the page itself. */
  target?: "avatar" | "power" | "calm" | "swap";
  icon: "pointer" | "hold" | "zap" | "sparkles" | "swap";
  /** The dock's bar must be open to show this target. */
  open?: boolean;
};

/** The first-visit tour. The page-effect step is left out for the neutral guide. */
export function tourSteps(persona: string): TourStep[] {
  const hold = HOLD[persona] ?? null;
  const power = getPersonaById(persona)?.power;
  const steps: TourStep[] = [
    { target: "avatar", icon: "pointer", text: "This is me. Click my picture or press / to ask anything about Shubham. Drag me wherever you like." },
  ];
  if (hold) steps.push({ icon: "hold", text: `On empty space or text, click for a small effect. For a big one, ${hold}.` });
  if (power) steps.push({ target: "power", icon: "zap", open: true, text: `My special power: ${power.label}. ${power.blurb}` });
  steps.push({ target: "calm", icon: "sparkles", open: true, text: "Calm mode. Turns the click and hold effects off if you would rather read in peace." });
  steps.push({ target: "swap", icon: "swap", open: true, text: "Change guide. Pick someone else any time. Use the ? next to it to replay this tour." });
  return steps;
}
