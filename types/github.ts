/**
 * Shared GitHub types.
 *
 * `RawRepo` mirrors the subset of the GitHub REST API response we consume.
 * `Project` is the normalised shape the UI renders, so components never
 * depend on GitHub's field names directly.
 */

export interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  homepage: string | null;
  pushed_at: string;
  updated_at: string;
  created_at: string;
  size: number;
}

export interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export type ProjectCategory =
  | "Web"
  | "Mobile"
  | "Systems"
  | "AI"
  | "Experiment"
  | "Other";

export interface Project {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  /** Verified live demo URL, or null. Never fabricated. */
  demoUrl: string | null;
  isFork: boolean;
  isArchived: boolean;
  category: ProjectCategory;
  /** ISO date of last push. */
  updatedAt: string;
  /** Optional README-derived summary (only fetched for featured repos). */
  readmeSummary?: string | null;
}

export interface GithubPayload {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
    memberSince: string;
  } | null;
  projects: Project[];
  /** Aggregate stats computed from the public repos actually returned. */
  stats: {
    publicRepoCount: number;
    totalStars: number;
    totalForks: number;
    languageBreakdown: { language: string; count: number }[];
    lastUpdated: string | null;
  };
  fetchedAt: string;
  /** True when GitHub returned a rate-limit or error condition. */
  degraded: boolean;
  message?: string;
}
