import { featuredRepositories } from "@/data/featuredProjects";
import { profile } from "@/data/profile";
import type {
  GithubPayload,
  Project,
  ProjectCategory,
  RawRepo,
  RawUser,
} from "@/types/github";

/**
 * Server-side GitHub access.
 *
 * Everything here runs on the server (route handler), so the optional token in
 * `process.env.GITHUB_TOKEN` is never exposed to the browser. Public
 * repositories are readable without any token; the token only raises the rate
 * limit from 60 to 5,000 requests per hour.
 */

const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "reaper500-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Best-effort categorisation from repository metadata (language, topics,
 * description). Deliberately conservative: when nothing clearly matches it
 * returns "Other" rather than guessing a category.
 */
export function categorize(repo: RawRepo): ProjectCategory {
  const topics = (repo.topics ?? []).map((t) => t.toLowerCase());
  const desc = (repo.description ?? "").toLowerCase();
  const lang = (repo.language ?? "").toLowerCase();
  const haystack = `${topics.join(" ")} ${desc}`;

  if (/(mobile|android|ios|react-native|expo|flutter)/.test(haystack)) {
    return "Mobile";
  }
  if (/(\bai\b|artificial intelligence|machine learning|\bml\b|\bllm\b|gpt|neural)/.test(haystack)) {
    return "AI";
  }
  if (
    /(rust|c\+\+|systems|compiler|\bcli\b|kernel|embedded|low-level)/.test(haystack) ||
    ["rust", "c++", "c"].includes(lang)
  ) {
    return "Systems";
  }
  // A repository with no description and little content reads as an experiment.
  if (!repo.description && (repo.topics ?? []).length === 0 && repo.size < 120) {
    return "Experiment";
  }
  if (
    /(web|frontend|front-end|backend|back-end|website|portfolio|laravel|\bapi\b)/.test(haystack) ||
    ["html", "css", "javascript", "typescript", "php", "vue", "svelte"].includes(lang)
  ) {
    return "Web";
  }
  return "Other";
}

/**
 * Emoji, pictographs, and other decorative symbols from repository text render
 * as empty "tofu" boxes in the site's monospace/display fonts, so they are
 * stripped. Accented Latin characters are preserved.
 */
const SYMBOL_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{FFFD}]/gu;

function stripSymbols(text: string): string {
  return text.replace(SYMBOL_RE, " ").replace(/\s+/g, " ").trim();
}

/** Only returns a URL that is a syntactically valid http(s) link. */
function safeDemoUrl(homepage: string | null): string | null {
  if (!homepage) return null;
  const url = homepage.trim();
  if (!/^https?:\/\//i.test(url)) return null;
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

export function normalizeRepo(repo: RawRepo): Project {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    description: stripSymbols(repo.description ?? "") || "No description provided.",
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics ?? [],
    demoUrl: safeDemoUrl(repo.homepage),
    isFork: repo.fork,
    isArchived: repo.archived,
    category: categorize(repo),
    updatedAt: repo.pushed_at,
  };
}

function summarizeReadme(markdown: string): string | null {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|]+/g, " ");
  const cleaned = stripSymbols(plain).replace(/\s+/g, " ").trim();
  if (cleaned.length < 40) return null;
  return cleaned.length > 240 ? `${cleaned.slice(0, 240).trimEnd()}…` : cleaned;
}

async function fetchReadmeSummary(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
      headers: { ...githubHeaders(), Accept: "application/vnd.github.raw" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return summarizeReadme(await res.text());
  } catch {
    return null;
  }
}

function computeStats(projects: Project[]) {
  const langMap = new Map<string, number>();
  let totalStars = 0;
  let totalForks = 0;
  let lastUpdated: string | null = null;

  for (const p of projects) {
    totalStars += p.stars;
    totalForks += p.forks;
    if (p.language) langMap.set(p.language, (langMap.get(p.language) ?? 0) + 1);
    if (!lastUpdated || new Date(p.updatedAt) > new Date(lastUpdated)) {
      lastUpdated = p.updatedAt;
    }
  }

  const languageBreakdown = [...langMap.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);

  return { totalStars, totalForks, languageBreakdown, lastUpdated };
}

export async function fetchGithubData(): Promise<GithubPayload> {
  const username = profile.githubUsername;

  const fallback: GithubPayload = {
    user: null,
    projects: [],
    stats: {
      publicRepoCount: 0,
      totalStars: 0,
      totalForks: 0,
      languageBreakdown: [],
      lastUpdated: null,
    },
    fetchedAt: new Date().toISOString(),
    degraded: true,
  };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100`, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }),
    ]);

    if (!reposRes.ok) {
      const remaining = reposRes.headers.get("x-ratelimit-remaining");
      const message =
        reposRes.status === 403 && remaining === "0"
          ? "GitHub's public API rate limit has been reached. Please retry in a little while."
          : `GitHub's API responded with status ${reposRes.status}.`;
      return { ...fallback, message };
    }

    const rawRepos = (await reposRes.json()) as RawRepo[];
    const rawUser = userRes.ok ? ((await userRes.json()) as RawUser) : null;

    const projects = rawRepos.filter((r) => !r.archived).map(normalizeRepo);

    // Enrich only the featured repositories with a README-derived summary, to
    // stay well within rate limits.
    const featured = projects.filter((p) => featuredRepositories.includes(p.name));
    await Promise.all(
      featured.map(async (p) => {
        p.readmeSummary = await fetchReadmeSummary(username, p.name);
      }),
    );

    const stats = computeStats(projects);

    return {
      user: rawUser
        ? {
            login: rawUser.login,
            name: rawUser.name,
            avatarUrl: rawUser.avatar_url,
            url: rawUser.html_url,
            bio: rawUser.bio,
            publicRepos: rawUser.public_repos,
            followers: rawUser.followers,
            following: rawUser.following,
            memberSince: rawUser.created_at,
          }
        : null,
      projects,
      stats: { publicRepoCount: projects.length, ...stats },
      fetchedAt: new Date().toISOString(),
      degraded: false,
    };
  } catch (error) {
    return {
      ...fallback,
      message:
        error instanceof Error
          ? `Could not reach GitHub: ${error.message}`
          : "Could not reach GitHub.",
    };
  }
}
