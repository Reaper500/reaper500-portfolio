"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { StatusDot } from "@/components/StatusDot";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/reviews", label: "Tech Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu; lock background scroll while it is open.
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
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Reaper500 — home"
        >
          <span className="font-mono text-sm font-semibold tracking-[0.18em] text-content-primary transition-colors group-hover:text-accent-lime">
            REAPER<span className="text-accent-lime">500</span>
          </span>
          <span className="hidden sm:inline-flex">
            <StatusDot label="Developer Portfolio" />
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "text-accent-lime"
                      : "text-content-secondary hover:text-content-primary"
                  }`}
                >
                  {link.label}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-lime"
                    />
                  ) : null}
                </Link>
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
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-line py-4 font-mono text-sm uppercase tracking-[0.16em] transition-colors ${
                    active ? "text-accent-lime" : "text-content-secondary hover:text-accent-lime"
                  }`}
                >
                  {link.label}
                  <span aria-hidden="true" className="text-content-muted">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
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
