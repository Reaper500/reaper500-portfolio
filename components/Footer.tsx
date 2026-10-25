import Link from "next/link";
import { Github } from "lucide-react";
import { profile } from "@/data/profile";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/reviews", label: "Tech Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-line bg-base-soft">
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-40" />
      <div className="section-shell relative py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-sm tracking-[0.18em] text-content-primary">
              REAPER<span className="text-accent-lime">500</span>{" "}
              <span className="text-content-muted">// END OF TRANSMISSION</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-content-secondary">
              Built with curiosity. Powered by code.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-xs uppercase tracking-[0.14em] text-content-secondary transition-colors hover:text-accent-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-content-muted">
            © {year} {profile.fullName} — {profile.alias}
            <span aria-hidden="true" className="ml-2 inline-block h-3 w-1.5 animate-blink bg-accent-lime align-middle" />
          </p>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-content-secondary transition-colors hover:text-accent-cyan"
          >
            <Github size={13} aria-hidden="true" />
            github.com/{profile.githubUsername}
          </a>
        </div>
      </div>
    </footer>
  );
}
