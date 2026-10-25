/**
 * Tech review content.
 *
 * This ships EMPTY on purpose. The brief forbids presenting invented reviews
 * as articles Kibang actually wrote, so no placeholder "reviews" are included
 * — the section renders a polished empty state instead.
 *
 * To publish one, add an object to the array below. No rebuild of the UI is
 * needed; the section reads whatever is here.
 */

export interface Review {
  id: string;
  title: string;
  /** e.g. "Developer Tools", "AI", "Languages", "Hardware". */
  category: string;
  /** ISO date, e.g. "2026-01-20". */
  date: string;
  readingMinutes: number;
  /** Short summary shown on the card. */
  excerpt: string;
  /** Cover image path under /public, e.g. "/reviews/vscode.webp". Optional. */
  cover?: string;
  /** Link to the full review. Only add once the article actually exists. */
  url?: string;
}

export const reviews: Review[] = [
  // Example shape (kept commented so nothing fake is published):
  //
  // {
  //   id: "example-1",
  //   title: "Notes on using Rust for a small CLI tool",
  //   category: "Languages",
  //   date: "2026-03-02",
  //   readingMinutes: 6,
  //   excerpt: "What surprised me moving from a scripting language to Rust, and where it got in the way.",
  //   url: "https://example.com/the-real-article",
  // },
];
