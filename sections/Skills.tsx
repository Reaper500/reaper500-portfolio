"use client";

import { useState } from "react";
import { Brain, Code2, Cpu, Smartphone } from "lucide-react";
import { skillCategories } from "@/data/skills";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const ICONS: Record<string, typeof Code2> = {
  web: Code2,
  mobile: Smartphone,
  systems: Cpu,
  ai: Brain,
};

export function Skills() {
  const [filter, setFilter] = useState<string>("all");

  const visible =
    filter === "all" ? skillCategories : skillCategories.filter((c) => c.id === filter);

  return (
    <section id="skills" aria-labelledby="skills-heading" className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" />
      <div className="section-shell relative">
        <SectionHeading
          code="02 // TECHNOLOGY_STACK"
          title="TOOLS OF THE TRADE."
          headingId="skills-heading"
          blurb="Technologies I work with and areas I'm actively exploring. No percentage scores — proficiency labels are shown only where they can be backed up."
        />

        {/* Category filters */}
        <div role="group" aria-label="Filter skills by category" className="mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`rounded-sm border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              filter === "all"
                ? "border-accent-lime text-accent-lime"
                : "border-line text-content-secondary hover:border-line-strong hover:text-content-primary"
            }`}
          >
            All
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              aria-pressed={filter === cat.id}
              className={`rounded-sm border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                filter === cat.id
                  ? "border-accent-lime text-accent-lime"
                  : "border-line text-content-secondary hover:border-line-strong hover:text-content-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((cat, index) => {
            const Icon = ICONS[cat.id] ?? Code2;
            return (
              <Reveal key={cat.id} delay={index * 60}>
                <article className="panel group h-full rounded-md p-6 transition-colors hover:border-line-strong">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-accent-lime">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-content-primary">{cat.label}</h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-content-muted">
                          {cat.code}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-5 text-sm text-content-secondary">{cat.blurb}</p>

                  <ul className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <li key={skill.name}>
                        <span
                          title={skill.note}
                          className="inline-flex items-center gap-2 rounded-sm border border-line bg-base-elev/60 px-3 py-1.5 text-xs text-content-secondary transition-colors hover:border-accent-cyan/60 hover:text-content-primary"
                        >
                          {skill.name}
                          {skill.level ? (
                            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent-cyan">
                              {skill.level}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {cat.skills.some((s) => s.note) ? (
                    <details className="mt-5 border-t border-line pt-4">
                      <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-content-muted hover:text-accent-cyan">
                        Notes
                      </summary>
                      <ul className="mt-3 space-y-1.5 text-xs text-content-muted">
                        {cat.skills
                          .filter((s) => s.note)
                          .map((s) => (
                            <li key={s.name}>
                              <span className="text-content-secondary">{s.name}:</span> {s.note}
                            </li>
                          ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
