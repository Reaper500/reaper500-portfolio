import { GraduationCap, MapPin, Languages } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          code="01 // ABOUT_THE_DEVELOPER"
          title={profile.about.heading}
          headingId="about-heading"
          level={1}
        />

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Editorial body copy */}
          <Reveal className="space-y-5">
            {profile.about.body.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lg leading-relaxed text-content-secondary"
                    : "leading-relaxed text-content-secondary"
                }
              >
                {paragraph}
              </p>
            ))}

            <ul className="flex flex-wrap gap-2 pt-2">
              {profile.about.metadata.map((item) => (
                <li
                  key={item}
                  className="rounded-sm border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-content-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Sidebar: timeline, education, languages */}
          <Reveal delay={120} className="space-y-6">
            <div className="panel rounded-md p-6">
              <p className="tech-label mb-5">Experience Timeline</p>
              <ol className="relative space-y-6 border-l border-line pl-6">
                <li className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border border-accent-lime bg-base-deep"
                  />
                  <p className="font-mono text-xs tracking-[0.14em] text-accent-lime">
                    {profile.organizationPeriod}
                  </p>
                  <p className="mt-1 font-display text-lg text-content-primary">
                    {profile.organization}
                  </p>
                  <p className="mt-1 text-sm text-content-secondary">
                    Building and collaborating on software across web and mobile.
                  </p>
                </li>
              </ol>
            </div>

            <div className="panel rounded-md p-6">
              <p className="tech-label mb-4">Education</p>
              <p className="flex items-start gap-3 text-content-primary">
                <GraduationCap size={18} className="mt-0.5 shrink-0 text-accent-cyan" aria-hidden="true" />
                {profile.education}
              </p>
            </div>

            <div className="panel rounded-md p-6">
              <p className="tech-label mb-4">Details</p>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Focus</dt>
                  <MapPin size={16} className="mt-0.5 shrink-0 text-content-muted" aria-hidden="true" />
                  <dd className="text-content-secondary">
                    <span className="text-content-muted">Focus:</span> {profile.focus}
                  </dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Languages spoken</dt>
                  <Languages size={16} className="mt-0.5 shrink-0 text-content-muted" aria-hidden="true" />
                  <dd className="text-content-secondary">
                    <span className="text-content-muted">Speaks:</span>{" "}
                    {profile.spokenLanguages.join(" & ")}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
