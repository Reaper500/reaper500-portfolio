"use client";

import { useEffect, useState } from "react";

interface TerminalLine {
  prompt?: string;
  text: string;
  accent?: "lime" | "cyan" | "green" | "muted";
}

const LINES: TerminalLine[] = [
  { prompt: "reaper@digital-frontier:~$", text: "whoami" },
  { text: "Reaper500", accent: "lime" },
  { prompt: "reaper@digital-frontier:~$", text: "focus --current" },
  { text: "Web Development", accent: "cyan" },
  { text: "Mobile Development", accent: "cyan" },
  { text: "Systems Programming", accent: "cyan" },
  { text: "Artificial Intelligence", accent: "cyan" },
  { prompt: "reaper@digital-frontier:~$", text: "status" },
  { text: "Building. Learning. Experimenting.", accent: "green" },
];

const ACCENT_CLASS: Record<NonNullable<TerminalLine["accent"]>, string> = {
  lime: "text-accent-lime",
  cyan: "text-accent-cyan",
  green: "text-accent-green",
  muted: "text-content-muted",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/**
 * Decorative terminal that reveals its lines one at a time. Purely visual: the
 * full text is always present in the DOM for screen readers and is shown
 * immediately when the visitor prefers reduced motion.
 */
export function Terminal() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduced ? LINES.length : 0);

  useEffect(() => {
    if (reduced) {
      setVisible(LINES.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= LINES.length) window.clearInterval(id);
    }, 420);
    return () => window.clearInterval(id);
  }, [reduced]);

  const done = visible >= LINES.length;

  return (
    <div className="panel relative overflow-hidden rounded-md">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#3a2a2a]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#3a352a]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#243a2e]" />
        <span className="ml-2 font-mono text-[11px] tracking-widest text-content-muted">
          bash — digital-frontier
        </span>
      </div>

      {/* subtle scanline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-lime/[0.06] to-transparent animate-scan" />
      </div>

      <pre className="relative overflow-x-auto p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        <code>
          {LINES.map((line, index) => {
            const shown = index < visible;
            return (
              <span
                key={index}
                className={`block transition-opacity duration-300 ${
                  shown ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={shown ? undefined : "true"}
              >
                {line.prompt ? (
                  <>
                    <span className="text-accent-green">{line.prompt}</span>{" "}
                    <span className="text-content-primary">{line.text}</span>
                  </>
                ) : (
                  <span className={ACCENT_CLASS[line.accent ?? "muted"]}>{line.text}</span>
                )}
              </span>
            );
          })}
          {!done ? (
            <span aria-hidden="true" className="inline-block h-4 w-2 animate-blink bg-accent-lime align-middle" />
          ) : (
            <span aria-hidden="true" className="inline-block h-4 w-2 animate-blink bg-accent-lime align-middle" />
          )}
        </code>
      </pre>
    </div>
  );
}
