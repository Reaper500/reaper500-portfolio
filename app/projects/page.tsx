import type { Metadata } from "next";
import { Projects } from "@/sections/Projects";
import { Activity } from "@/sections/Activity";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Public repositories from github.com/Reaper500, fetched live: web apps, mobile projects, experiments, and open-source work.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-6">
      <Projects />
      <Activity />
    </div>
  );
}
