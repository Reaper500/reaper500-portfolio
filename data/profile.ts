/**
 * Single source of truth for the developer's public profile.
 *
 * Only facts provided by Kibang Virtue (Reaper500) are stored here. Nothing is
 * invented: no clients, awards, certifications, or metrics. Fields that were
 * not supplied (email, LinkedIn, location) are intentionally absent so the UI
 * never renders a placeholder as if it were real.
 */

export const profile = {
  fullName: "Kibang Virtue",
  alias: "Reaper500",
  githubUsername: "Reaper500",
  githubUrl: "https://github.com/Reaper500",

  experienceYears: 3,
  education: "BSCE in Computer Science",
  organization: "nHub Nigeria",
  organizationPeriod: "2023 – 2025",
  spokenLanguages: ["English", "French"],

  focus: "Software Development",
  interests: ["Web", "Mobile", "Systems", "AI"],

  /**
   * Not rendered publicly (professional identity is prioritised over personal
   * details). Retained only in case structured metadata is added later.
   */
  dateOfBirth: "2002-05-18",

  hero: {
    label: "HELLO_WORLD.exe",
    headline: "I BUILD FOR THE DIGITAL FRONTIER.",
    intro:
      "I'm Kibang Virtue, known online as Reaper500 — a developer exploring the intersection of web, mobile, systems programming, and artificial intelligence.",
    support:
      "Three years of building for the web, exploring new technologies, and turning ideas into functional digital experiences.",
    primaryCta: "EXPLORE MY PROJECTS",
    secondaryCta: "LET'S CONNECT",
  },

  about: {
    heading: "CURIOUS BY NATURE. BUILDER BY CHOICE.",
    body: [
      "Kibang is a technology enthusiast who likes building software, pulling different areas of programming apart to understand how they fit together, and reviewing the tools and technology that keep the field moving.",
      "Most of his hands-on work sits in web development — HTML, CSS and JavaScript through to backend work with Laravel and API integration. Alongside that he builds and explores mobile applications and responsive interfaces, and spends time in systems-level languages like Rust and C++, using Git and GitHub for version control and collaborative work.",
      "He is also drawn to artificial intelligence: the concepts behind it, how it is applied in practice, and how it can be folded into everyday development workflows. Reviewing technology — developer tools, languages, software, and hardware — is a genuine interest rather than a side note, and it shapes how he learns.",
      "From 2023 to 2025 he worked at nHub Nigeria, and he holds a BSCE in Computer Science. He communicates comfortably in both English and French.",
    ],
    metadata: [
      "IDENTITY: REAPER500",
      "FOCUS: SOFTWARE DEVELOPMENT",
      "INTERESTS: WEB / MOBILE / SYSTEMS / AI",
    ],
  },
} as const;

export type Profile = typeof profile;
