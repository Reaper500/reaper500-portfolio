"use client";

import { useEffect, useState } from "react";
import { Github, Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { StatusDot } from "@/components/StatusDot";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#reviews", label: "Tech Reviews" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is currently in view.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActive(`#${mostVisible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape, and lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-base-deep/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between gap-4" aria-label="Primary">
        {/* Logo */}
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3"
          aria-label="Reaper500 — back to top"
        >
          <span className="font-mono text-sm font-semibold tracking-[0.18em] text-content-primary transition-colors group-hover:text-accent-lime">
            REAPER<span className="text-accent-lime">500</span>
          </span>
          <span className="hidden sm:inline-flex">
            <StatusDot label="Developer Portfolio" />
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                    isActive
                      ? "text-accent-lime"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  {link.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-lime"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-sm border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-content-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan sm:inline-flex"
          >
            <Github size={14} aria-hidden="true" />
            GitHub
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line-strong text-content-primary transition-colors hover:border-accent-cyan hover:text-accent-cyan lg:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-base-deep/95 backdrop-blur-md lg:hidden"
      >
        <ul className="section-shell flex flex-col py-4">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line py-4 font-mono text-sm uppercase tracking-[0.16em] text-content-secondary transition-colors hover:text-accent-lime"
              >
                {link.label}
                <span aria-hidden="true" className="text-content-muted">
                  ↗
                </span>
              </a>
            </li>
          ))}
          <li className="pt-5">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-ghost w-full"
            >
              <Github size={15} aria-hidden="true" />
              View GitHub Profile
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
