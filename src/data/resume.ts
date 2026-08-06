// Single source of truth for all portfolio content.
// Every field here is derived directly from Shubham Patel's resume.
// Do not invent facts — only rephrase for presentation.

export const profile = {
  name: "Shubham Patel",
  role: "Software Engineer",
  focus: "Full-Stack · Guidewire PolicyCenter · GenAI/RAG",
  location: "Raigarh, Chhattisgarh, India",
  email: "vtshubham01@gmail.com",
  links: {
    github: "https://github.com/Shubhampatel001",
    linkedin: "https://www.linkedin.com/in/shubhampatel001/",
  },
  summary:
    "Software Engineer at LTM specializing in full-stack and Guidewire PolicyCenter development within the P&C insurance domain, with hands-on expertise in Spring Boot, Angular, React, and REST APIs. Certified in Guidewire Jutro and Google Cloud; led a 5-member team and scored 90%+ across all assessed milestones.",
  currentFocus:
    "Full-stack engineering across Spring Boot, Angular and React, with a growing focus on GenAI/RAG systems — building retrieval pipelines, vector search, and applied ML on top of production-grade backends.",
  stats: [
    { label: "Full-stack apps shipped", value: "3+" },
    { label: "Team led (FarmAid Gladiator)", value: "5" },
    { label: "Enterprise training milestones", value: "90%+" },
  ],
};

export type ExperienceEntry = {
  company: string;
  role: string;
  duration: string;
  points: string[];
  tech: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "LTM, Pune",
    role: "Software Engineer",
    duration: "Jun 2025 – Present",
    points: [
      "Completed enterprise training in Guidewire PolicyCenter, Jutro Digital, Core Java, Spring Boot, and Angular, achieving 90%+ scores across all assessed milestones.",
      "Built 3+ full-stack applications using Spring Boot, Angular, React, Node.js, PostgreSQL, and REST APIs, implementing authentication, database integration, and end-to-end frontend-backend workflows.",
      "Applied Guidewire Jutro concepts to develop digital user experiences for an insurance module, collaborating with product and engineering teams on workflow customization, feature implementation, and UI development.",
      "Implemented authentication, authorization, API integrations, and centralized exception handling using Spring Security.",
      "Led and mentored a 5-member team in the FarmAid Gladiator project, coordinating sprint planning, task allocation, code reviews, testing activities, and project delivery.",
      "Integrated Swagger-based API documentation and structured logging to improve maintainability and debugging efficiency.",
    ],
    tech: ["Spring Boot", "Angular", "React", "Node.js", "PostgreSQL", "Guidewire", "Spring Security", "Swagger"],
  },
  {
    company: "Jindal Steel & Power Ltd., Raigarh",
    role: "Intern",
    duration: "Jun 2022 – Aug 2022",
    points: [
      "Coordinated documentation for 5+ active projects, enabling senior engineers to reduce milestone tracking time by 20% through improved record management and compliance reporting.",
    ],
    tech: ["Documentation", "Process Improvement"],
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  duration: string;
  problem: string;
  solution: string;
  learnings: string[];
  tech: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  hasPlayableDemo?: boolean;
};

export const projects: Project[] = [
  {
    slug: "perplexa-chat",
    name: "Perplexa Chat",
    tagline: "AI-powered RAG-based search assistant",
    duration: "Dec 2024 – Apr 2025",
    problem:
      "Searching across large, unstructured knowledge bases (10,000+ document entries) was slow and imprecise, with no way to ask natural-language questions over the corpus.",
    solution:
      "Designed and launched a Streamlit-based RAG application used by 50+ testers, integrating MongoDB vector embeddings with GenAI APIs and a real-time retrieval pipeline with an optimized chunking strategy — cutting query response time by 40% and improving search usability by 60%.",
    learnings: [
      "Chunking strategy has an outsized effect on retrieval quality and latency",
      "Vector search performance at 10k+ document scale requires deliberate indexing choices",
      "Fast user feedback loops (50+ testers) surfaced UX gaps a solo build would have missed",
    ],
    tech: ["Python", "Streamlit", "MongoDB", "Vector Embeddings", "RAG", "GenAI APIs"],
    github: "https://github.com/Shubhampatel001/Perplexa",
    featured: true,
  },
  {
    slug: "evodrive",
    name: "EvoDrive",
    tagline: "Genetic algorithm for autonomous driving",
    duration: "Jul 2024 – Nov 2024",
    problem:
      "Autonomous navigation in a simulated environment needed to learn obstacle avoidance and efficient pathfinding without hand-coded rules for every scenario.",
    solution:
      "Engineered a driving simulation that reached 90% obstacle-avoidance accuracy through iterative genetic algorithm optimization across 200+ training generations, then integrated Dijkstra's algorithm to cut pathfinding computation time by 30% and improve route efficiency and stability.",
    learnings: [
      "Genetic algorithms converge unevenly — generation count matters less than fitness function design",
      "Combining a classical algorithm (Dijkstra) with an evolutionary one can outperform either alone",
      "Simulation stability across variable test environments is its own engineering problem",
    ],
    tech: ["Python", "Genetic Algorithms", "Dijkstra's Algorithm", "Simulation"],
    github: "https://github.com/Shubhampatel001/EvoDrive-Genetic-Algorithm-for-Autonomous-Driving",
    featured: true,
  },
  {
    slug: "flappy-bird-neat",
    name: "Flappy Bird with NEAT",
    tagline: "Neuro-evolution agent that learns to play",
    duration: "Jan 2024 – May 2024",
    problem:
      "Teaching an agent to play Flappy Bird with zero human input after training, using an evolving neural network rather than fixed rules.",
    solution:
      "Developed an AI agent using the NEAT neuro-evolution algorithm, increasing fitness scores by 150% over 500 generations through systematic parameter tuning and network topology optimization — reaching fully autonomous gameplay after just 40 generations.",
    learnings: [
      "Topology evolution (not just weight tuning) accelerated convergence significantly",
      "Fitness scoring design directly shapes what behavior actually evolves",
      "40 generations was enough for competence; 500 kept refining margins",
    ],
    tech: ["Python", "NEAT Algorithm", "Neuro-evolution", "Pygame"],
    github: "https://github.com/Shubhampatel001/Flappy-Bird-With-NEAT-Algorithm",
    featured: true,
    hasPlayableDemo: true,
  },
];

export const skills = {
  Languages: ["Java", "Gosu", "Python", "C++", "JavaScript"],
  Frameworks: ["Spring Boot", "Angular", "React", "Node.js", "Guidewire PolicyCenter", "Guidewire Jutro", "Streamlit"],
  "Cloud & Tools": ["GCP", "Git", "SQL", "JWT", "Spring Security", "Swagger"],
  Databases: ["PostgreSQL", "MongoDB"],
  "AI/ML & Concepts": ["RAG", "Genetic Algorithms", "DSA", "OOP", "Microservices"],
};

export type Certification = {
  name: string;
  issuer: string;
};

export const certifications: Certification[] = [
  { name: "Guidewire Certified Associate Jutro Developer", issuer: "Guidewire" },
  { name: "GitHub Copilot Fundamentals", issuer: "GitHub" },
  { name: "Google Cloud Architect Specialization", issuer: "Google Cloud" },
  { name: "Cloud Engineer Specialization", issuer: "Google Cloud" },
  { name: "Cloud Security Specialization", issuer: "Google Cloud" },
];

export type Achievement = {
  title: string;
  description: string;
  url?: string;
};

export const achievements: Achievement[] = [
  {
    title: "Led a 5-member team",
    description:
      "Coordinated sprint planning, task allocation, code reviews, and delivery for the FarmAid Gladiator project at LTM.",
  },
  {
    title: "Published Research — IJSREM",
    description:
      "Authored \"Efficient Waste Collection and Filtration using IoT,\" demonstrating a 25% improvement in operational efficiency, published in an international peer-reviewed engineering journal (Jan 2023).",
    url: "https://ijsrem.com/download/efficient-waste-collection-and-filtration-using-iot/",
  },
  {
    title: "NGO Volunteer Leadership",
    description:
      "Led fundraising and awareness campaigns reaching 5,000+ people, raising funds and coordinating 150+ animal rescues across Tare Zameen Foundation and Pawzz Foundation (Aug–Oct 2023).",
  },
];

export const education = [
  { degree: "B.Tech, CSE", school: "Kalinga Institute of Industrial Technology", detail: "82.00% · 2021 – 2025" },
  { degree: "Class XII, CBSE", school: "O.P. Jindal School, Raigarh", detail: "90.16% · 2020" },
  { degree: "Class X, CBSE", school: "O.P. Jindal School, Raigarh", detail: "87.83% · 2018" },
];
