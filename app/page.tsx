import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Code2, FolderGit2, Mail, User } from "lucide-react";
import { Hero } from "@/sections/Hero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Reaper500 | Kibang Virtue — Developer & Tech Enthusiast",
  description:
    "Explore the portfolio of Kibang Virtue, known as Reaper500. Discover web development, mobile development, systems programming, AI exploration, open-source projects, and technology reviews.",
};

const EXPLORE = [
  {
    href: "/about",
    code: "01",
    label: "About",
    desc: "Who I am, how I got here, and what I actually care about.",
    icon: User,
  },
  {
    href: "/skills",
    code: "02",
    label: "Skills",
    desc: "The languages, tools, and areas I work in — honestly labelled.",
    icon: Code2,
  },
  {
    href: "/projects",
    code: "03",
    label: "Projects",
    desc: "Repositories pulled live from GitHub. Nothing invented.",
    icon: FolderGit2,
  },
  {
    href: "/reviews",
    code: "04",
    label: "Tech Reviews",
    desc: "Tools, languages, and technology, written without the noise.",
    icon: BookOpen,
  },
  {
    href: "/contact",
    code: "06",
    label: "Contact",
    desc: "Have an idea, a question, or something worth building?",
    icon: Mail,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section aria-labelledby="explore-heading" className="relative pb-8">
        <div className="section-shell">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-6 border-t border-line pt-8">
              <div>
                <p className="tech-label mb-2">NAVIGATE // THE ARCHIVE</p>
                <h2 id="explore-heading" className="font-display text-2xl text-content-primary sm:text-3xl">
                  Where do you want to go?
                </h2>
              </div>
            </div>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORE.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal as="li" key={item.href} delay={Math.min(index, 5) * 60}>
                  <Link
                    href={item.href}
                    className="panel group flex h-full flex-col rounded-md p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-accent-lime">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-content-muted">
                        {item.code}
                      </span>
                    </div>
                    <h3 className="flex items-center gap-1.5 font-display text-lg text-content-primary">
                      {item.label}
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="text-content-muted transition-colors group-hover:text-accent-cyan"
                      />
                    </h3>
                    <p className="mt-2 text-sm text-content-secondary">{item.desc}</p>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
