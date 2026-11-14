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
    "Software Engineer at LTIMindtree specializing in full-stack and Guidewire PolicyCenter development within the P&C insurance domain, with hands-on expertise in Java, Spring Boot, Angular, React, Next.js, and REST APIs. I build scalable applications, improve user experiences, and collaborate across teams to turn business requirements into reliable software.",
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
    company: "LTIMindtree, Bhubaneswar",
    role: "Graduate Engineering Trainee",
    duration: "Jun 2025 – Aug 2025",
    points: [
      "Completed Java full-stack training with hands-on work in Core Java, Spring Boot, and Angular.",
      "Led a project team while strengthening technical, communication, and collaboration skills.",
    ],
    tech: ["Core Java", "Spring Boot", "Angular", "Team Leadership"],
  },
  {
    company: "AnsrCoach",
    role: "Video Editor",
    duration: "Nov 2022 – Feb 2023",
    points: [
      "Edited 15+ professional videos using Adobe Premiere Pro and After Effects, delivering every project ahead of deadline.",
      "Introduced motion-graphics techniques that streamlined the editing process by 25% and increased client satisfaction by 20%.",
    ],
    tech: ["Adobe Premiere Pro", "After Effects", "Motion Graphics"],
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
  previewImage?: string;
  /** Base path (no extension) of /public media: <base>.mp4, <base>.webm, <base>.jpg poster. */
  media?: string;
  category: "AI/ML" | "Full Stack" | "Games" | "Web";
};

export const projects: Project[] = [
  {
    slug: "dice-game",
    name: "Dice Game",
    tagline: "Interactive two-dice JavaScript game",
    duration: "Mar 2024",
    problem:
      "Create a lightweight browser game that gives a clear outcome from a random two-dice roll.",
    solution:
      "Built an interactive single-player game that generates two random dice values and displays the winner based on the higher roll.",
    learnings: [
      "Randomized state needs immediate, easy-to-read visual feedback",
      "Simple interaction design can make a compact browser game feel responsive",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Shubhampatel001/Dice-Game",
    demo: "https://shubhampatel001.github.io/Dice-Game/",
    featured: false,
    previewImage: "/projects/dice-game.png",
    category: "Games",
    media: "/projects/media/dice-game",
  },
  {
    slug: "drum-kit",
    name: "Drum Kit",
    tagline: "Keyboard and touch-controlled web instrument",
    duration: "Mar 2024",
    problem:
      "Make drum sounds accessible through both physical keyboard input and touch interaction in the browser.",
    solution:
      "Developed a web-based drum kit that maps keyboard and touch interactions to simulated drum sounds.",
    learnings: [
      "Supporting multiple input methods makes interactive experiences more accessible",
      "Immediate audio and visual response is essential for musical interfaces",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Shubhampatel001/Drum-Kit",
    demo: "https://shubhampatel001.github.io/Drum-Kit/",
    featured: false,
    previewImage: "/projects/drum-kit.png",
    category: "Games",
    media: "/projects/media/drum-kit",
  },
  {
    slug: "simon-game-challenge",
    name: "Simon Game Challenge",
    tagline: "Progressive memory game with lights and sounds",
    duration: "Mar 2024",
    problem:
      "Build a game that tests memory and coordination by asking players to reproduce an increasingly complex sequence.",
    solution:
      "Created a Simon-style game that presents a sequence of lights and sounds for players to repeat, increasing the challenge with every round.",
    learnings: [
      "Game difficulty can scale naturally through progressive sequence length",
      "Clear state transitions help players understand interactive challenges",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Shubhampatel001/Simon-Game-Challenge",
    demo: "https://shubhampatel001.github.io/Simon-Game-Challenge/",
    featured: false,
    category: "Games",
    media: "/projects/media/simon-game-challenge",
  },
  {
    slug: "farmaid",
    name: "FarmAid",
    tagline: "Agricultural loan schemes: browse, apply, track",
    duration: "Oct 2026",
    problem:
      "Farmers need one place to find agricultural loan schemes, apply online and follow the status of their applications, while loan officers need to manage schemes and decide on applications.",
    solution:
      "Built a full-stack web application where farmers browse loan schemes, apply online and track applications, and loan officers (admins) manage the schemes and approve or reject applications. Java backend with a TypeScript frontend, containerised with Docker and checked by a CI workflow, and deployed with a live demo.",
    learnings: [
      "Separate farmer and officer workflows make an approval process easy to follow",
      "Containerising the app makes a full demo runnable with one command",
    ],
    tech: ["Java", "TypeScript", "Docker", "CI"],
    github: "https://github.com/Shubhampatel001/farmAid",
    demo: "https://farmaid-onhl.onrender.com/",
    featured: true,
    media: "/projects/media/farmaid",
    category: "Full Stack",
  },
  {
    slug: "wedding-invitation",
    name: "Digital Wedding Invitation",
    tagline: "Animated, mobile-friendly invitation card",
    duration: "Jan 2026 – Mar 2026",
    problem:
      "A wedding invitation that guests can open on any phone, without printing or sharing a PDF.",
    solution:
      "Built a digital invitation as a React (Vite) web app with a tap-to-begin intro, deployed on Vercel.",
    learnings: [
      "A short, tap-to-begin intro sets the tone and works well on mobile",
    ],
    tech: ["React", "Vite", "JavaScript", "CSS"],
    github: "https://github.com/Shubhampatel001/anisha-naman-wedding",
    demo: "https://anisha-naman-wedding.vercel.app",
    featured: false,
    media: "/projects/media/wedding",
    category: "Web",
  },
  {
    slug: "legal-docs",
    name: "Legal Docs",
    tagline: "Legal-document management web application",
    duration: "Jan 2023",
    problem:
      "Legal documents need to be easy to access and manage within a single, clear workflow.",
    solution:
      "Built a web application that lets users view, create, and manage legal documents from one platform.",
    learnings: [
      "Document workflows work best when creating, viewing, and managing records are easy to find",
      "Clear information architecture is essential for document-heavy applications",
    ],
    tech: ["Web Application", "Document Management"],
    featured: true,
    previewImage: "/projects/legal-docs.png",
    category: "Full Stack",
    media: "/projects/media/legal-docs",
  },
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
    demo: "https://perplexa.streamlit.app/",
    featured: true,
    previewImage: "/projects/perplexa-process.jpg",
    category: "AI/ML",
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
    demo: "https://shubhampatel001.github.io/EvoDrive-Genetic-Algorithm-for-Autonomous-Driving/",
    featured: true,
    previewImage: "/projects/evodrive-map.png",
    category: "AI/ML",
    media: "/projects/media/evodrive",
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
    previewImage: "/projects/flappy-neat.png",
    category: "AI/ML",
  },
];

export const skills = {
  Languages: ["Java", "Gosu", "Python", "C++", "JavaScript", "TypeScript"],
  Frameworks: ["Spring Boot", "Angular", "React", "Next.js", "Node.js", "Guidewire PolicyCenter", "Guidewire Jutro", "Streamlit"],
  "Cloud & Tools": ["GCP", "Docker", "Git", "GitHub", "SQL", "JWT", "Spring Security", "Swagger", "CI/CD"],
  Databases: ["PostgreSQL", "MongoDB"],
  "AI/ML & Concepts": ["RAG", "Genetic Algorithms", "DSA", "OOP", "Microservices"],
};

export type Certification = {
  name: string;
  issuer: string;
  url: string;
};

export const certifications: Certification[] = [
  { name: "Guidewire Certified Associate Jutro Developer", issuer: "Guidewire", url: "https://www.linkedin.com/in/shubhampatel001/details/certifications/" },
  { name: "GitHub Copilot Fundamentals", issuer: "GitHub", url: "https://www.linkedin.com/in/shubhampatel001/details/certifications/" },
  { name: "Google Cloud Architect Specialization", issuer: "Google Cloud", url: "https://www.coursera.org/verify/X3MQTD3RZTNA" },
  { name: "Cloud Engineer Specialization", issuer: "Google Cloud", url: "https://www.coursera.org/verify/DU7B5CD2RFJN" },
  { name: "Cloud Security Specialization", issuer: "Google Cloud", url: "https://www.coursera.org/verify/TACMFEB7JYGR" },
  { name: "Google Cloud Big Data and Machine Learning Fundamentals", issuer: "Google Cloud", url: "https://www.coursera.org/verify/BEX3JLJTZNSF" },
  { name: "Software Development Trainee", issuer: "Aspiring Minds", url: "https://www.linkedin.com/in/shubhampatel001/details/certifications/" },
  { name: "Basic Mountaineering Course", issuer: "Atal Bihari Vajpayee Institute of Mountaineering and Allied Sports", url: "https://www.linkedin.com/in/shubhampatel001/details/certifications/" },
  { name: "Pawzz Fundraising", issuer: "Pawzz Foundation", url: "https://www.linkedin.com/in/shubhampatel001/details/certifications/" },
];

export type VolunteerEntry = {
  organization: string;
  role: string;
  duration: string;
  focus: string;
};

export const volunteerExperience: VolunteerEntry[] = [
  {
    organization: "YOUTH RED CROSS, KIIT",
    role: "Video Editor",
    duration: "Oct 2022 – Present",
    focus: "Social services",
  },
  {
    organization: "Pawzz Foundation",
    role: "Fundraiser & Video Editor",
    duration: "Aug 2023 – Sep 2023",
    focus: "Animal welfare; raised close to ₹1,500 for the organization.",
  },
  {
    organization: "Hamari Pahchan",
    role: "Video Editor",
    duration: "Nov 2022 – Dec 2022",
    focus: "Social services",
  },
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
