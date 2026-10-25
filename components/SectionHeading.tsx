/**
 * Consistent section header: a monospaced index label, the heading, and an
 * optional supporting line.
 */
export function SectionHeading({
  code,
  title,
  headingId,
  blurb,
}: {
  code: string;
  title: string;
  headingId: string;
  blurb?: string;
}) {
  return (
    <header className="mb-10 sm:mb-14">
      <p className="tech-label mb-3">{code}</p>
      <h2
        id={headingId}
        className="text-balance text-3xl font-semibold leading-[1.05] sm:text-4xl md:text-5xl"
      >
        {title}
      </h2>
      {blurb ? (
        <p className="mt-4 max-w-2xl text-content-secondary">{blurb}</p>
      ) : null}
    </header>
  );
}
