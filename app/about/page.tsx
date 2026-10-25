import type { Metadata } from "next";
import { About } from "@/sections/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kibang Virtue (Reaper500) — a developer working across web, mobile, systems programming, and AI. Three years of experience, nHub Nigeria 2023–2025, BSCE in Computer Science.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-6">
      <About />
    </div>
  );
}
