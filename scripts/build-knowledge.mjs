// Builds src/data/knowledge.json: the chunks the Pixel chatbot retrieves from.
// Sources: resume.ts (single source of truth), profile-notes.md, and public GitHub repos.
// GitHub is best-effort: offline or rate-limited builds keep the last GitHub chunks.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src/data/knowledge.json");
const GH_USER = "Shubhampatel001";

const {
  profile, experience, projects, skills, certifications, volunteerExperience, achievements, education,
} = await import(pathToFileURL(join(root, "src/data/resume.ts")).href);

const chunks = [];
const add = (source, title, text) =>
  chunks.push({ id: `${source}-${chunks.length}`, source, title, text: text.trim().replace(/\n{3,}/g, "\n\n") });

// --- resume.ts ---
add("resume", "About Shubham Patel",
  `${profile.name} is a ${profile.role} (${profile.focus}) based in ${profile.location}.\n${profile.summary}\nCurrent focus: ${profile.currentFocus}\nHighlights: ${profile.stats.map((s) => `${s.label}: ${s.value}`).join("; ")}.\nEmail: ${profile.email}. GitHub: ${profile.links.github}. LinkedIn: ${profile.links.linkedin}.`);

for (const e of experience) {
  add("resume", `Experience: ${e.role} at ${e.company}`,
    `${e.role} at ${e.company} (${e.duration}).\n${e.points.map((p) => `- ${p}`).join("\n")}\nTech: ${e.tech.join(", ")}.`);
}
for (const p of projects) {
  add("resume", `Project: ${p.name}`,
    `${p.name} (${p.duration}, ${p.category}): ${p.tagline}.\nProblem: ${p.problem}\nSolution: ${p.solution}\nLearnings: ${p.learnings.join("; ")}.\nTech: ${p.tech.join(", ")}.${p.github ? `\nSource: ${p.github}` : ""}${p.demo ? `\nLive demo: ${p.demo}` : ""}`);
}
add("resume", "Skills and tech stack",
  Object.entries(skills).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n"));
add("resume", "Certifications",
  certifications.map((c) => `- ${c.name} (${c.issuer})`).join("\n"));
add("resume", "Volunteering",
  volunteerExperience.map((v) => `- ${v.role}, ${v.organization} (${v.duration}): ${v.focus}`).join("\n"));
add("resume", "Achievements",
  achievements.map((a) => `- ${a.title}: ${a.description}`).join("\n"));
add("resume", "Education",
  education.map((e) => `- ${e.degree}, ${e.school} (${e.detail})`).join("\n"));

// --- profile-notes.md (split on "## ", skip TODO lines and HTML comments) ---
const notes = readFileSync(join(root, "src/data/profile-notes.md"), "utf8").replace(/<!--[\s\S]*?-->/g, "");
for (const block of notes.split(/^## /m).slice(1)) {
  const [title, ...rest] = block.split("\n");
  const body = rest.filter((l) => !/^\s*TODO\b/.test(l)).join("\n").trim();
  if (body) add("notes", title.trim(), body);
}

// --- GitHub (best effort) ---
const headers = { "User-Agent": "portfolio-knowledge-build", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const clean = (md) =>
  md.replace(/<[^>]+>/g, " ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*`>|_]/g, " ")
    .replace(/\s+/g, " ").trim();

async function github() {
  const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, { headers });
  if (!res.ok) throw new Error(`repos ${res.status}`);
  const repos = (await res.json()).filter((r) => r.name !== "portfolio");
  const out = [];
  for (const r of repos) {
    let readme = "";
    if (!r.fork) {
      const rr = await fetch(`https://api.github.com/repos/${GH_USER}/${r.name}/readme`, { headers: { ...headers, Accept: "application/vnd.github.raw+json" } });
      if (rr.ok) readme = clean(await rr.text()).slice(0, 1400);
    }
    out.push({
      source: "github", title: `GitHub repo: ${r.name}${r.fork ? " (fork)" : ""}`,
      text: `${r.name}${r.fork ? " is a GitHub fork of another repository" : ""}. ${r.description ?? "No description."} Language: ${r.language ?? "n/a"}. Last pushed: ${r.pushed_at?.slice(0, 10)}.${r.homepage ? ` Live: ${r.homepage}.` : ""} ${r.html_url}${readme ? `\nREADME: ${readme}` : ""}`,
    });
  }
  return out;
}

let gh;
try {
  gh = await github();
  console.log(`knowledge: ${gh.length} GitHub repos`);
} catch (e) {
  console.warn(`knowledge: GitHub skipped (${e.message}); keeping previous GitHub chunks`);
  gh = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")).filter((c) => c.source === "github") : [];
}
for (const c of gh) add(c.source, c.title, c.text);

writeFileSync(OUT, JSON.stringify(chunks, null, 1) + "\n");
console.log(`knowledge: wrote ${chunks.length} chunks -> src/data/knowledge.json`);
