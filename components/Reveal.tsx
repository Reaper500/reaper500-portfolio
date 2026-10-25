"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Wraps content in a scroll-triggered fade-up. Content is never permanently
 * hidden: reduced-motion users and no-JS visitors see it immediately.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as never}
      className={`${inView ? "reveal-in" : "reveal-hidden"} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
