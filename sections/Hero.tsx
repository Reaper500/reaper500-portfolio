import { ArrowUpRight, Github } from "lucide-react";
import { profile } from "@/data/profile";
import { Terminal } from "@/components/Terminal";
import { Reveal } from "@/components/Reveal";
import { StatusDot } from "@/components/StatusDot";

const LANGUAGE_TAGS = ["HTML", "CSS", "JavaScript", "Laravel", "Rust", "C++", "Git"];

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      {/* Backdrop: engineering grid + one soft glow. */}
      <div
        aria-hidden="true"
        className="grid-bg mask-fade-b pointer-events-none absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-12%] h-[440px] w-[440px] rounded-full bg-accent-lime/[0.07] blur-3xl"
      />

      <div className="section-shell relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* ---------------- Left: the message ---------------- */}
        <div>
          <Reveal>
            <p className="tech-label">{profile.hero.label}</p>
            <h1
              id="hero-heading"
              className="mt-4 text-balance text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl"
            >
              I BUILD FOR THE{" "}
              <span className="text-accent-lime text-glow-lime">DIGITAL FRONTIER.</span>
            </h1>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-content-secondary">
              I&apos;m <span className="text-content-primary">Kibang Virtue</span>, known online as{" "}
              <span className="text-content-primary">Reaper500</span> — a developer exploring the
              intersection of <span className="text-accent-lime">web</span>,{" "}
              <span className="text-accent-lime">mobile</span>,{" "}
              <span className="text-accent-lime">systems</span> programming, and{" "}
              <span className="text-accent-lime">artificial intelligence</span>.
            </p>
            <p className="mt-4 max-w-xl text-content-muted">{profile.hero.support}</p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn-primary">
                {profile.hero.primaryCta}
              </a>
              <a href="#contact" className="btn-ghost">
                {profile.hero.secondaryCta}
              </a>
            </div>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-content-secondary transition-colors hover:text-accent-cyan"
            >
              <Github size={14} aria-hidden="true" />
              View GitHub profile
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        {/* ---------------- Right: the workstation ---------------- */}
        <Reveal delay={120} className="relative">
          {/* Rotating geometric object behind the terminal. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-10 hidden h-28 w-28 animate-spinSlow lg:block"
          >
            <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
              <polygon
                points="50,4 92,27 92,73 50,96 8,73 8,27"
                stroke="#54D9FF"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
              <polygon
                points="50,20 78,35 78,65 50,80 22,65 22,35"
                stroke="#B7FF3C"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
            </svg>
          </div>

          <Terminal />

          {/* Language tags + a small git branch visualisation. */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {LANGUAGE_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-content-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
            <StatusDot label="Available for ideas" tone="green" />
            <svg
              aria-hidden="true"
              viewBox="0 0 160 40"
              className="h-8 w-40 text-content-muted"
              fill="none"
            >
              <path d="M6 8 V32" stroke="currentColor" strokeWidth="1" />
              <path d="M6 16 C 30 16, 40 12, 60 12 H 120" stroke="#B7FF3C" strokeWidth="1" strokeOpacity="0.7" />
              <path d="M6 26 C 30 26, 40 30, 60 30 H 100" stroke="#54D9FF" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx="6" cy="8" r="2.5" fill="#B7FF3C" />
              <circle cx="120" cy="12" r="2.5" fill="#B7FF3C" />
              <circle cx="100" cy="30" r="2.5" fill="#54D9FF" />
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
