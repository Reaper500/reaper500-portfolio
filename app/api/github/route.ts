import { NextResponse } from "next/server";
import { fetchGithubData } from "@/services/github";

/**
 * Server-side proxy for GitHub data.
 *
 * The browser never talks to api.github.com directly, which keeps any token on
 * the server. This handler runs per request rather than being baked at build
 * time, so a network hiccup during a deployment build can never freeze an empty
 * result into the site. Successful responses are cached at the CDN for an hour,
 * and the inner fetches are cached by Next for the same window, so GitHub is
 * still hit at most about once an hour.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await fetchGithubData();

  // Never cache a failure — let the next request try again.
  if (data.degraded) {
    return NextResponse.json(data, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
