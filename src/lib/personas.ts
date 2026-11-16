// Guide data shared by the intro screen, the dock and the avatar art.
// Avatars are original flat-vector busts drawn in one shared style (bold ink outline, two-tone fills,
// an expressive face on a coloured badge). They use character cues only: no logos, emblems or official art.
// Names are labels. Model voices live server-side in chat-prompt.ts. Site palettes (light + dark) and
// backdrops are keyed by id in globals.css and src/components/backdrops.

export type PowerId = "clones" | "brief" | "kit" | "swing" | "balloons" | "quiz" | "detective" | "journey";

export type Persona = {
  id: string;
  name: string;
  /** Where the character comes from, shown small on the intro card. */
  origin: string;
  /** One line shown on the intro card: how this guide talks. */
  temperament: string;
  greeting: string;
  skin: string;
  /** Colours for this guide's card on the intro screen (fixed, so every card looks right in either theme). */
  tone: { bg: string; fg: string; accent: string; pattern: string };
  power: { id: PowerId; label: string; blurb: string };
};

export const DEFAULT_PERSONA = "pixel";

export const NEUTRAL = { id: DEFAULT_PERSONA, name: "Assistant" };

export const PERSONAS: Persona[] = [
  {
    id: "naruto",
    name: "Naruto",
    origin: "Anime",
    temperament: "Warm and relentless. Explains until it clicks.",
    greeting: "Ask me anything. I won't stop until you get a clear answer.",
    skin: "#ffd9b3",
    tone: {
      bg: "#f59e0b",
      fg: "#1b1208",
      accent: "#1b2250",
      pattern: "repeating-radial-gradient(circle at 80% 12%, rgba(27,18,8,.13) 0 2px, transparent 2px 26px)",
    },
    power: { id: "clones", label: "Shadow clones", blurb: "See every project running at once." },
  },
  {
    id: "spiderman",
    name: "Spider-Man",
    origin: "Superhero",
    temperament: "Quippy and self-deprecating. Swings you through the page.",
    greeting: "Friendly neighbourhood guide here. Ask away, I only bite when provoked.",
    skin: "#ffd9b3",
    tone: {
      bg: "#2744b8",
      fg: "#ffffff",
      accent: "#ff4a57",
      pattern: "radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.8px) 0 0 / 14px 14px",
    },
    power: { id: "swing", label: "Web-swing tour", blurb: "A guided swing through the whole page." },
  },
  {
    id: "batman",
    name: "Batman",
    origin: "Superhero",
    temperament: "Terse and brooding. Dry, but never wrong.",
    greeting: "Ask. I'll keep it short.",
    skin: "#f0c9a2",
    tone: {
      bg: "#121a26",
      fg: "#eef1f6",
      accent: "#f5c518",
      pattern: "repeating-linear-gradient(105deg, rgba(238,241,246,.09) 0 1px, transparent 1px 16px)",
    },
    power: { id: "detective", label: "Detective mode", blurb: "Sweep the light, find every clue, open the case files." },
  },
  {
    id: "pennywise",
    name: "Pennywise",
    origin: "Horror",
    temperament: "Playful menace. Sing-song, but the answers are straight.",
    greeting: "Hello there! Everything down here floats. Ask me about Shubham.",
    skin: "#e6e8ec",
    tone: {
      bg: "#2d4a4d",
      fg: "#f6efde",
      accent: "#ff5a3c",
      pattern: "radial-gradient(rgba(255,90,60,.22) 5px, transparent 5.5px) 0 0 / 38px 38px",
    },
    power: { id: "balloons", label: "Pop a balloon", blurb: "Every balloon floats up a skill or an achievement." },
  },
  {
    id: "ghostface",
    name: "Ghostface",
    origin: "Horror",
    temperament: "Teasing and curious. Likes asking you questions back.",
    greeting: "Hello. So, what are you hiring for?",
    skin: "#f2f0ea",
    tone: {
      bg: "#d90f1c",
      fg: "#ffffff",
      accent: "#111111",
      pattern: "repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 1px, transparent 1px 22px)",
    },
    power: { id: "quiz", label: "Take the quiz", blurb: "Answer two questions and get matched to a project." },
  },
];

export const PERSONA_IDS = PERSONAS.map((p) => p.id);

export const getPersonaById = (id: string | undefined) => PERSONAS.find((p) => p.id === id);
