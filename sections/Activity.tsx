"use client";

import { Github, Star, Users, FolderGit2 } from "lucide-react";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function Activity() {
  const { data, loading, error } = useGithubRepos();

  const stats = data?.stats;
  const user = data?.user;

  const maxCount = stats?.languageBreakdown[0]?.count ?? 1;

  return (
    <section id="activity" aria-labelledby="activity-heading" className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="grid-bg-fine pointer-events-none absolute inset-0 opacity-30" />
      <div className="section-shell relative">
        <SectionHeading
          code="05 // ACTIVITY_LOG"
          title="ALWAYS BUILDING. ALWAYS EXPLORING."
          headingId="activity-heading"
          blurb="A dashboard view of public activity on GitHub. Figures are calculated from the public repositories returned by GitHub's API, not from private work."
        />

        {loading && !stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="panel h-28 animate-pulse rounded-md" />
            ))}
          </div>
        ) : error ? (
          <div className="panel rounded-md px-6 py-12 text-center">
            <p className="font-display text-lg text-content-primary">
              Activity data isn&apos;t available right now.
            </p>
            <p className="mt-2 text-sm text-content-secondary">{error}</p>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-6"
            >
              <Github size={14} aria-hidden="true" />
              Open GitHub
            </a>
          </div>
        ) : stats ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<FolderGit2 size={16} aria-hidden="true" />}
                label="Public repositories"
                value={stats.publicRepoCount}
              />
              <StatCard
                icon={<Users size={16} aria-hidden="true" />}
                label="GitHub followers"
                value={user?.followers ?? 0}
              />
              <StatCard
                icon={<Star size={16} aria-hidden="true" />}
                label="Stars across public repos"
                value={stats.totalStars}
              />
              <StatCard
                icon={<Github size={16} aria-hidden="true" />}
                label="Last updated"
                value={formatDate(stats.lastUpdated)}
                isText
              />
            </div>

            {stats.languageBreakdown.length > 0 ? (
              <Reveal delay={100} className="mt-10">
                <div className="panel rounded-md p-6 sm:p-8">
                  <div className="mb-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg text-content-primary">
                      Most-used languages
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-content-muted">
                      by repository count
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {stats.languageBreakdown.slice(0, 6).map((row) => (
                      <li key={row.language}>
                        <div className="mb-1.5 flex items-center justify-between font-mono text-xs">
                          <span className="text-content-secondary">{row.language}</span>
                          <span className="text-content-muted">
                            {row.count} {row.count === 1 ? "repo" : "repos"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-elev">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent-lime to-accent-green"
                            style={{ width: `${Math.max(8, (row.count / maxCount) * 100)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 border-t border-line pt-4 font-mono text-[10px] leading-relaxed tracking-wide text-content-muted">
                    Note: repository count is not a measure of skill. Language figures come from the
                    primary language GitHub reports per public repository, which undercounts
                    languages used inside a project.
                  </p>
                </div>
              </Reveal>
            ) : null}

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-content-muted">
              Data fetched from GitHub · {formatDate(data?.fetchedAt ?? null)}
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  isText = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  isText?: boolean;
}) {
  return (
    <div className="panel rounded-md p-6">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line text-accent-cyan">
        {icon}
      </span>
      <p className={`mt-4 font-display text-content-primary ${isText ? "text-xl" : "text-3xl"}`}>
        {value}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-content-muted">
        {label}
      </p>
    </div>
  );
}
