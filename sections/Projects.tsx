"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  GitFork,
  Github,
  RotateCw,
  Search,
  Star,
} from "lucide-react";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { featuredRepositories } from "@/data/featuredProjects";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import type { Project, ProjectCategory } from "@/types/github";

type SortKey = "featured" | "updated" | "stars" | "name";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

const isFeatured = (p: Project) => featuredRepositories.includes(p.name);

export function Projects() {
  const { data, loading, error, usingCache, retry } = useGithubRepos();

  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const projects = useMemo(() => data?.projects ?? [], [data]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) if (p.language) set.add(p.language);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const categories = useMemo(() => {
    const set = new Set<ProjectCategory>();
    for (const p of projects) set.add(p.category);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (language !== "all" && p.language !== language) return false;
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.topics.some((t) => t.toLowerCase().includes(q))
      );
    });

    return [...list].sort((a, b) => {
      if (sort === "featured") {
        const fa = isFeatured(a) ? 1 : 0;
        const fb = isFeatured(b) ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      }
      if (sort === "updated") return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      if (sort === "stars") return b.stars - a.stars || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [projects, query, language, category, sort]);

  const showEmptyAccount = !loading && !error && projects.length === 0;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          code="03 // SELECTED_WORK"
          title="CODE THAT DOES SOMETHING."
          headingId="projects-heading"
          blurb="Projects, experiments, and ideas brought to life through code. Everything below is pulled live from public repositories on GitHub — nothing is invented."
        />

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="project-search" className="sr-only">
                Search repositories by name
              </label>
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-muted"
              />
              <input
                id="project-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repositories…"
                className="w-full rounded-sm border border-line bg-base-soft/70 py-3 pl-10 pr-4 font-mono text-sm text-content-primary placeholder:text-content-muted focus:border-accent-cyan focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="project-sort" className="tech-label whitespace-nowrap">
                Sort
              </label>
              <select
                id="project-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-sm border border-line bg-base-soft/70 px-3 py-3 font-mono text-xs uppercase tracking-[0.12em] text-content-secondary focus:border-accent-cyan focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="updated">Recently updated</option>
                <option value="stars">Most stars</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterChip active={language === "all"} onClick={() => setLanguage("all")}>
              All languages
            </FilterChip>
            {languages.map((lang) => (
              <FilterChip key={lang} active={language === lang} onClick={() => setLanguage(lang)}>
                {lang}
              </FilterChip>
            ))}
          </div>

          {categories.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                All categories
              </FilterChip>
              {categories.map((cat) => (
                <FilterChip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
                  {cat}
                </FilterChip>
              ))}
            </div>
          ) : null}
        </div>

        {/* Status notes */}
        {usingCache ? (
          <p className="mb-6 rounded-sm border border-line bg-base-soft/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-content-muted">
            Showing cached repository data — refreshing in the background.
          </p>
        ) : null}

        {/* Content */}
        {loading && projects.length === 0 ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : showEmptyAccount ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="panel rounded-md px-6 py-14 text-center">
            <p className="font-display text-xl text-content-primary">No repositories match those filters.</p>
            <p className="mt-2 text-sm text-content-secondary">
              Try clearing the search or choosing a different language.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setLanguage("all");
                setCategory("all");
              }}
              className="btn-ghost mt-6"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-content-muted">
              {filtered.length} {filtered.length === 1 ? "repository" : "repositories"}
            </p>
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, index) => (
                <Reveal
                  as="li"
                  key={project.id}
                  delay={Math.min(index, 6) * 50}
                  className={index === 0 && isFeatured(project) ? "md:col-span-2 lg:col-span-2" : ""}
                >
                  <ProjectCard project={project} large={index === 0 && isFeatured(project)} />
                </Reveal>
              ))}
            </ul>
          </>
        )}

        {/* Profile link */}
        <div className="mt-12 flex justify-center">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <Github size={15} aria-hidden="true" />
            See everything on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-accent-cyan text-accent-cyan"
          : "border-line text-content-muted hover:border-line-strong hover:text-content-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const featured = isFeatured(project);

  return (
    <article
      className={`panel group flex h-full flex-col rounded-md p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong ${
        large ? "md:p-8" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`truncate font-display font-semibold text-content-primary ${
                large ? "text-2xl" : "text-lg"
              }`}
            >
              {project.name}
            </h3>
            {featured ? (
              <span className="rounded-sm border border-accent-lime/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent-lime">
                Featured
              </span>
            ) : null}
            {project.isFork ? (
              <span className="rounded-sm border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-content-muted">
                Fork
              </span>
            ) : null}
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-content-muted">
            {project.category}
            {project.language ? ` · ${project.language}` : ""}
          </p>
        </div>
      </div>

      <p className={`text-content-secondary ${large ? "text-base" : "text-sm"}`}>
        {project.readmeSummary || project.description}
      </p>

      {project.topics.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.topics.slice(0, large ? 6 : 3).map((topic) => (
            <li
              key={topic}
              className="rounded-sm bg-base-elev/70 px-2 py-0.5 font-mono text-[10px] text-content-muted"
            >
              {topic}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-6">
        <div className="flex items-center gap-4 font-mono text-[11px] text-content-muted">
          <span className="inline-flex items-center gap-1.5">
            <Star size={13} aria-hidden="true" />
            {project.stars}
            <span className="sr-only"> stars</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GitFork size={13} aria-hidden="true" />
            {project.forks}
            <span className="sr-only"> forks</span>
          </span>
          <span className="ml-auto">Updated {formatDate(project.updatedAt)}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-line-strong px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-content-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          >
            <Github size={13} aria-hidden="true" />
            View source
          </a>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-accent-lime/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-lime transition-colors hover:bg-accent-lime hover:text-base-deep"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Live demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className={`panel animate-pulse rounded-md p-6 ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
        >
          <div className="h-5 w-1/2 rounded bg-base-elev" />
          <div className="mt-3 h-3 w-1/3 rounded bg-base-elev" />
          <div className="mt-5 h-3 w-full rounded bg-base-elev" />
          <div className="mt-2 h-3 w-4/5 rounded bg-base-elev" />
          <div className="mt-8 h-8 w-40 rounded bg-base-elev" />
        </li>
      ))}
    </ul>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="panel rounded-md px-6 py-14 text-center">
      <AlertTriangle size={28} aria-hidden="true" className="mx-auto text-accent-lime" />
      <p className="mt-4 font-display text-xl text-content-primary">
        Couldn&apos;t load repositories
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-content-secondary">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onRetry} className="btn-primary">
          <RotateCw size={14} aria-hidden="true" />
          Retry
        </button>
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          <Github size={14} aria-hidden="true" />
          Open GitHub
        </a>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="panel rounded-md px-6 py-16 text-center">
      <Github size={30} aria-hidden="true" className="mx-auto text-content-muted" />
      <p className="mt-4 font-display text-xl text-content-primary">
        No public repositories to show yet.
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-content-secondary">
        When work is pushed to GitHub it will appear here automatically. In the meantime, the
        profile is the best place to look.
      </p>
      <a
        href={profile.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost mt-6"
      >
        <Github size={14} aria-hidden="true" />
        Visit github.com/{profile.githubUsername}
      </a>
    </div>
  );
}
