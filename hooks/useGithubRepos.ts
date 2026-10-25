"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GithubPayload } from "@/types/github";

/**
 * Client hook for GitHub data.
 *
 * - Talks to our own /api/github route, never to GitHub directly.
 * - Shares a single in-flight request across every component that uses it, so
 *   the Projects and Activity sections don't each trigger a fetch.
 * - Caches the last good payload in localStorage and falls back to it if the
 *   live request fails, so the page keeps working when GitHub is rate-limited.
 */

const CACHE_KEY = "reaper500:github:v1";

let inflight: Promise<GithubPayload> | null = null;

async function loadPayload(): Promise<GithubPayload> {
  if (inflight) return inflight;
  inflight = (async () => {
    const res = await fetch("/api/github", { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`GitHub data request failed (status ${res.status}).`);
    const json = (await res.json()) as GithubPayload;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), json }));
    } catch {
      /* storage unavailable — non-fatal */
    }
    return json;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

function readCache(): GithubPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { json?: GithubPayload };
    return parsed?.json ?? null;
  } catch {
    return null;
  }
}

export function useGithubRepos() {
  const [data, setData] = useState<GithubPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);
  const mounted = useRef(true);

  const retry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await loadPayload();
      if (!mounted.current) return;
      setData(payload);
      setUsingCache(false);
    } catch (err) {
      if (!mounted.current) return;
      const cached = readCache();
      if (cached) {
        setData(cached);
        setUsingCache(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "Unable to load repositories.");
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    // Show cached data instantly, then refresh in the background.
    const cached = readCache();
    if (cached) {
      setData(cached);
      setUsingCache(true);
      setLoading(false);
    }

    void retry();
    return () => {
      mounted.current = false;
    };
  }, [retry]);

  return { data, loading, error, usingCache, retry };
}
