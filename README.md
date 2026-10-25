# REAPER500 // DIGITAL FRONTIER

A personal developer portfolio for **Kibang Virtue** (Reaper500) — built as a real,
working Next.js application, not a mockup.

- **Live project data:** the Projects and Activity sections pull straight from the
  public GitHub API (`github.com/Reaper500`). Nothing is hard-coded or invented.
- **Distinctive visual identity:** deep-black surfaces, electric-lime accents, a
  technical/terminal aesthetic, Space Grotesk + Inter + JetBrains Mono.
- **Honest by construction:** no fabricated projects, stats, awards, reviews, or
  live-demo links. Where data doesn't exist, the UI says so.

---

## Stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Framework      | Next.js 14 (App Router)                   |
| Language       | TypeScript                                |
| Styling        | Tailwind CSS 3                            |
| Icons          | lucide-react                              |
| Animation      | CSS keyframes + IntersectionObserver      |
| Data           | GitHub REST API (server-side route proxy) |
| Backend / DB   | none — not needed for this site           |
| Auth           | none — not needed for this site           |

No database, backend, or authentication system is included, because the brief
explicitly asks not to add one unless there's a clear need. There isn't one here.

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm start       # run the production build
```

---

## Environment variables (all optional)

Copy `.env.example` to `.env.local` and fill in only what you need. The site runs
perfectly with none of them set.

| Variable              | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `GITHUB_TOKEN`        | Server-only. Raises the GitHub rate limit from 60 to 5,000 requests/hr. |
| `RESEND_API_KEY`      | Server-only. Enables real email delivery for the contact form.          |
| `CONTACT_TO_EMAIL`    | Where contact-form messages are delivered.                              |
| `CONTACT_FROM_EMAIL`  | Verified "from" address in your Resend account.                         |
| `NEXT_PUBLIC_SITE_URL`| Your production domain, used for canonical + Open Graph URLs.           |

**The contact form behaves honestly.** With no email service configured, it
validates the message and then tells the visitor that delivery isn't set up,
pointing them to GitHub. It never pretends to send a message it discarded.

---

## Editing content (no component changes needed)

| What                          | File                             |
| ----------------------------- | -------------------------------- |
| Profile, bio, hero copy       | `data/profile.ts`                |
| Skills and categories         | `data/skills.ts`                 |
| Featured repositories         | `data/featuredProjects.ts`       |
| Tech reviews                  | `data/reviews.ts`                |

`data/reviews.ts` ships **empty** on purpose — the section renders a polished
empty state instead of fake articles. Add an object to the array to publish one.

---

## Project structure

```
app/
  layout.tsx            metadata, fonts, Navbar + Footer, skip-link, noscript fallback
  page.tsx              Home — hero + explore links
  about/page.tsx        About
  skills/page.tsx       Tech stack
  projects/page.tsx     Projects + Activity
  reviews/page.tsx      Tech reviews
  contact/page.tsx      Contact
  globals.css           design tokens, utilities, reduced-motion handling
  icon.svg              favicon
  api/github/route.ts   server proxy for GitHub (cached 1h)
  api/contact/route.ts  contact form handler
components/             Navbar, Footer, Terminal, Reveal, SectionHeading, StatusDot
sections/               Hero, About, Skills, Projects, TechReviews, Activity, Contact
services/github.ts      all GitHub fetching + normalisation
hooks/                  useGithubRepos, useInView
data/                   editable content
types/                  shared types
public/og.svg           social share image
```

The site is **multi-page**: each nav item is a real route with its own URL,
`<h1>`, page title and metadata — not a scroll anchor on a single page.

---

## How the GitHub integration works

1. The browser calls our own `/api/github` route — never GitHub directly.
2. That route fetches the user and repositories server-side, normalises them,
   and caches the response for an hour (`stale-while-revalidate` for a day).
3. If `GITHUB_TOKEN` is set, it is used server-side only and never shipped to
   the client.
4. The client hook (`useGithubRepos`) shares one in-flight request across
   sections and caches the last good payload in `localStorage`, so the page
   still works if GitHub is rate-limited.
5. Loading, error (with retry), empty-account, and no-match states are all handled.

Categorisation (`services/github.ts → categorize`) infers a project's category
from language, topics, and description, and falls back to **"Other"** rather than
guessing. A "Live demo" button appears only when a repository's own `homepage`
field is a valid `http(s)` URL.

---

## Accessibility & performance

- Semantic landmarks, correct heading order, a skip-to-content link.
- Keyboard-operable mobile menu (Escape closes it), visible focus rings.
- `prefers-reduced-motion` disables every animation; no-JS visitors still see
  all content (a `<noscript>` style un-hides revealed sections).
- Lightweight CSS animation only — no 3D libraries, no particle systems, no
  animation that delays access to content.

---

## Deploying

Deploys as a standard Next.js app (Vercel is the simplest path: import the repo,
set the optional env vars, deploy). Any Node host works with `npm run build`
followed by `npm start`.

---

## Honesty notes

Every fact about the developer comes from what was supplied. Skills carry no
proficiency percentages, reviews ship empty rather than fabricated, project data
is fetched live, and no live-demo link is shown unless the repository itself
declares one.
