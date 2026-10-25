import type { Metadata } from "next";
import { Skills } from "@/sections/Skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "The technology stack: HTML, CSS, JavaScript, Laravel, API integration, mobile development, Rust, C++, Git, and AI exploration — with no fabricated proficiency scores.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <div className="pt-6">
      <Skills />
    </div>
  );
}
