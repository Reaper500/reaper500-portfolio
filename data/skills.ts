/**
 * Technology stack, grouped by category.
 *
 * Proficiency levels are intentionally NOT set. The brief requires that any
 * level shown ("Familiar", "Working knowledge", "Experienced") must be
 * verifiable by the developer, and no such data was provided. The `level`
 * field exists so it can be added later without touching the UI, and no
 * fabricated percentage scores are ever displayed.
 */

export type SkillLevel = "Familiar" | "Working knowledge" | "Experienced";

export interface Skill {
  name: string;
  /** Optional, and only when the developer can verify it. */
  level?: SkillLevel;
  note?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  code: string;
  blurb: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "web",
    label: "Web Development",
    code: "CAT_A",
    blurb: "Building for the browser — markup, styling, and the logic that connects it all.",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "Modern frontend development" },
      { name: "Backend web development" },
      { name: "Laravel" },
      { name: "API integration" },
      { name: "Responsive design" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile Development",
    code: "CAT_B",
    blurb: "Applications built for smaller screens, touch input, and real devices.",
    skills: [
      { name: "Mobile application development" },
      { name: "Responsive mobile experiences" },
      {
        name: "Cross-platform development",
        note: "Listed as an area of exploration, not a claim of production experience.",
      },
    ],
  },
  {
    id: "systems",
    label: "Systems & Development Tools",
    code: "CAT_C",
    blurb: "Lower-level languages and the version control habits that hold a project together.",
    skills: [
      { name: "Rust" },
      { name: "C++" },
      { name: "Git" },
      { name: "GitHub" },
    ],
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    code: "CAT_D",
    blurb: "Understanding AI concepts and putting them to work in a development workflow.",
    skills: [
      { name: "AI Essentials" },
      { name: "AI concepts and applications" },
      { name: "AI-assisted development" },
      { name: "Practical AI exploration" },
    ],
  },
];
