import { BookOpen, Clock, Github } from "lucide-react";
import { reviews } from "@/data/reviews";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TechReviews() {
  const sorted = [...reviews].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  );

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          code="04 // TECH_INTELLIGENCE"
          title="TECH, WITHOUT THE NOISE."
          headingId="reviews-heading"
          blurb="Technology, developer tools, languages, AI experiments, and the occasional hardware take — written plainly and without hype."
        />

        {sorted.length === 0 ? (
          <Reveal>
            <div className="panel rounded-md px-6 py-16 text-center">
              <BookOpen size={30} aria-hidden="true" className="mx-auto text-content-muted" />
              <p className="mt-4 font-display text-xl text-content-primary">
                No reviews published yet.
              </p>
              <p className="mx-auto mt-2 max-w-lg text-sm text-content-secondary">
                This section is ready and waiting — reviews will appear here as they&apos;re
                written. Check back soon, or follow along on GitHub in the meantime.
              </p>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-6"
              >
                <Github size={14} aria-hidden="true" />
                Follow on GitHub
              </a>
            </div>
          </Reveal>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((review, index) => (
              <Reveal as="li" key={review.id} delay={Math.min(index, 6) * 50}>
                <article className="panel flex h-full flex-col rounded-md p-6 transition-colors hover:border-line-strong">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-cyan">
                    {review.category}
                  </p>
                  <h3 className="mt-3 font-display text-lg text-content-primary">{review.title}</h3>
                  <p className="mt-3 text-sm text-content-secondary">{review.excerpt}</p>
                  <div className="mt-auto flex items-center gap-4 pt-6 font-mono text-[11px] text-content-muted">
                    <span>{formatDate(review.date)}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} aria-hidden="true" />
                      {review.readingMinutes} min read
                    </span>
                  </div>
                  {review.url ? (
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-lime hover:underline"
                    >
                      Read the review ↗
                    </a>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
