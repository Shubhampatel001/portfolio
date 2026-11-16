// Hand-written, in-character lines for things that need no lookup: greetings, thanks, goodbyes,
// "who are you", and the refusals used by the safety screen. Keys must match src/lib/personas.ts
// (plus "pixel", the neutral guide).

export type TalkKind = "greeting" | "howareyou" | "thanks" | "goodbye" | "who" | "help" | "private" | "abuse" | "inject" | "fallback";

type Lines = Record<TalkKind, string[]>;

const LINES: Record<string, Lines> = {
  pixel: {
    greeting: ["Hello! Ask me anything about Shubham's experience, projects or skills.", "Hi there. What would you like to know about Shubham?"],
    howareyou: ["Doing well, thanks for asking. What would you like to know about Shubham?"],
    thanks: ["You're welcome. Anything else about Shubham?", "Happy to help. Ask away if there is more."],
    goodbye: ["Goodbye, and thanks for visiting. Shubham's email is in the contact section if you want to reach him."],
    who: ["I'm Pixel, the guide on Shubham's portfolio. I can tell you about his work, projects and skills."],
    help: ["I can tell you about Shubham's experience, projects, skills, education and availability. What interests you?"],
    private: ["I keep personal details private. For anything like that, please email Shubham directly from the contact section."],
    abuse: ["Let's keep it friendly. I'm happy to talk about Shubham's work whenever you are."],
    inject: ["I can't change how I work, but I'm glad to answer questions about Shubham's work."],
    fallback: ["I don't have that information. You can ask about Shubham's experience, projects, skills or availability, or email him from the contact section."],
  },
  naruto: {
    greeting: ["Yo! Great to see you! Ask me anything about Shubham, and I'll give it everything I've got!", "Hey there! Ready when you are. What do you want to know about Shubham?"],
    howareyou: ["Fired up and ready to go! So, what would you like to know about Shubham?"],
    thanks: ["Anytime! That's my nindo: never leave a question unanswered. Got another?"],
    goodbye: ["See you around! Shubham's email is in the contact section if you want to reach him. Believe it!"],
    who: ["I'm Naruto, your guide here! I'll tell you all about Shubham's work, projects and skills."],
    help: ["I can tell you about Shubham's experience, projects, skills, education and availability. Pick one and let's go!"],
    private: ["That one's private, and I'd never share a friend's secrets. Email Shubham from the contact section for that!"],
    abuse: ["Hey, no need for that! Here's something true: nobody is born strong, they get strong by not giving up. Now, what about Shubham's work?", "Hard words won't beat me, but kind ones will make your day! You're doing great just by trying. Want to hear about Shubham's projects?", "Whoa, easy! Remember: a person who never gives up on others is a real friend. Ask me about Shubham and let's make it a good one!"],
    inject: ["Nice try, but I don't break my own rules! Ask me about Shubham's work instead."],
    fallback: ["I don't know that one! Ask about Shubham's experience, projects or skills, or email him from the contact section."],
  },
  spiderman: {
    greeting: ["Hey! Friendly neighbourhood guide here. What do you want to know about Shubham?", "Hi! Swinging by to help. Ask me about Shubham's work."],
    howareyou: ["Hanging in there, literally. What would you like to know about Shubham?"],
    thanks: ["No problem! All in a day's web-slinging. Anything else?"],
    goodbye: ["Catch you later! Shubham's email is in the contact section if you want to reach him."],
    who: ["I'm Spidey, your guide on Shubham's portfolio. Ask me about his work, projects or skills."],
    help: ["I can tell you about Shubham's experience, projects, skills, education and availability. Where should we start?"],
    private: ["Even secret identities have limits, and that's one. Please email Shubham from the contact section instead."],
    abuse: ["Whoa there! Quick lesson from your friendly neighbourhood guide: being kind costs nothing and helps everyone swing a little higher. Now, what about Shubham's work?", "Rough day? Everyone falls sometimes; what counts is getting back up and trying again. Ask me about Shubham whenever you're ready.", "Words are like webs: use them to catch people, not to tangle them. Anyway, want to hear about Shubham's projects?"],
    inject: ["Good try, but my sense says no. Ask me about Shubham's work instead."],
    fallback: ["I don't have that one. Try asking about Shubham's experience, projects or skills, or email him from the contact section."],
  },
  batman: {
    greeting: ["Welcome. Ask your question about Shubham.", "Evening. What do you need to know about Shubham?"],
    howareyou: ["Fine. Ask your question about Shubham."],
    thanks: ["Noted. Anything else about Shubham."],
    goodbye: ["Goodbye. His email is in the contact section."],
    who: ["I'm Batman. I'm the guide here. I answer questions about Shubham's work."],
    help: ["Shubham's experience, projects, skills, education and availability. Choose one."],
    private: ["That stays private. Email Shubham from the contact section."],
    abuse: ["Language. The city has enough noise. Ask about Shubham's work.", "Anger is a tool. Use it on a problem, not on me. Ask about Shubham."],
    inject: ["No. Ask about Shubham's work."],
    fallback: ["I don't have that. Ask about his experience, projects or skills, or email him from the contact section."],
  },
  ghostface: {
    greeting: ["Hello. So... what do you want to know about Shubham?", "Hi there. Who is it that I'm talking to? Ask me anything about Shubham."],
    howareyou: ["Just fine. And you? What would you like to know about Shubham?"],
    thanks: ["You're welcome. Is there another question you'd like to ask?"],
    goodbye: ["Leaving already? Shubham's email is in the contact section. Until next time."],
    who: ["I'm the voice on the line. I answer questions about Shubham's work. What do you want to know?"],
    help: ["I can tell you about Shubham's experience, projects, skills, education and availability. What's your favourite thing to ask about?"],
    private: ["Some secrets stay secret. Email Shubham from the contact section for that."],
    abuse: ["Ooh, that's not very nice. You know what I like better? A good question. What do you want to know about Shubham?", "Careful. Bad words make me hang up. Ask me something about Shubham instead."],
    inject: ["Nice try. I don't change my script. Ask about Shubham's work."],
    fallback: ["I don't have that information. Ask about Shubham's experience, projects or skills, or email him from the contact section."],
  },
  pennywise: {
    greeting: ["Hello down there! Come closer and ask me about Shubham. I won't bite. Much.", "Hi, hi, hi! Ask me anything about Shubham, and I'll float you an answer."],
    howareyou: ["Floating along nicely! What would you like to know about Shubham?"],
    thanks: ["Oh, you're welcome! Have a balloon. Any other questions?"],
    goodbye: ["Bye for now! Shubham's email is in the contact section. We all float on..."],
    who: ["I'm Pennywise, your guide here, and I know all about Shubham's work. Ask away!"],
    help: ["I can tell you about Shubham's experience, projects, skills, education and availability. What shall we dig into?"],
    private: ["Ooh, that's a secret I'll never tell. Email Shubham from the contact section for that!"],
    abuse: ["Hi-hi-hi-hi-hi-hi! Oh, what colourful words! Now be a good one and ask me about Shubham.", "Hee-hee-hee-hee! Naughty, naughty! Come on, ask me about Shubham's work instead.", "Hi, hi, hi, hi, hi! You kiss your mother with that mouth? Ask me about Shubham!"],
    inject: ["Tee-hee, nice try. I stick to my script. Ask about Shubham's work!"],
    fallback: ["I don't know that one! Ask about Shubham's experience, projects or skills, or email him from the contact section."],
  },
};

export function talkLine(persona: string, kind: TalkKind): string {
  const set = (LINES[persona] ?? LINES.pixel)[kind];
  return set[Math.floor(Math.random() * set.length)];
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const RULES: [TalkKind, RegExp][] = [
  ["greeting", /^(hi+|hello+|hey+|heya|hiya|yo|sup|namaste|hola|howdy|good (morning|afternoon|evening|day)|greetings)( (there|guide|buddy|friend))?$/],
  ["howareyou", /^(hi |hello |hey )?(how are you|how r u|how are you doing|how's it going|hows it going|what's up|whats up|wassup)( today)?$/],
  ["thanks", /^(thanks|thank you|thankyou|thx|ty|cheers|much appreciated|great thanks|ok thanks|okay thanks|thanks a lot|thank you so much)$/],
  ["goodbye", /^(bye+|goodbye|good bye|see you|see ya|cya|later|good night|gotta go|that's all|thats all)$/],
  ["who", /^(who are you|who r u|what are you|what is your name|what's your name|whats your name|are you a bot|are you ai|are you an ai|are you real|are you human)$/],
  ["help", /^(help|what can you do|what do you do|what can i ask|what can i ask you|how can you help|how does this work|what should i ask)$/],
];

/** Returns the kind of pure small talk in a short message, or null if it carries any real question. */
export function matchSmallTalk(text: string): TalkKind | null {
  const t = norm(text);
  if (!t || t.split(" ").length > 7) return null;
  for (const [kind, re] of RULES) if (re.test(t)) return kind;
  return null;
}
