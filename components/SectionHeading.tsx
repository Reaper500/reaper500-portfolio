/**
 * Consistent section header: a monospaced index label, the heading, and an
 * optional supporting line.
 *
 * `level` controls the heading tag. On a dedicated page the section heading is
 * the page's <h1>; where a section sits beneath another (e.g. Activity on the
 * Projects page) it stays an <h2>.
 */
export function SectionHeading({
  code,
  title,
  headingId,
  blurb,
  level = 2,
}: {
  code: string;
  title: string;
  headingId: string;
  blurb?: string;
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <header className="mb-10 sm:mb-14">
      <p className="tech-label mb-3">{code}</p>
      <Heading
        id={headingId}
        className="text-balance text-3xl font-semibold leading-[1.05] sm:text-4xl md:text-5xl"
      >
        {title}
      </Heading>
      {blurb ? (
        <p className="mt-4 max-w-2xl text-content-secondary">{blurb}</p>
      ) : null}
    </header>
  );
}
