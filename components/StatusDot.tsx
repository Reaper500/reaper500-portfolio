/**
 * Small live status indicator. The dot pulses; the label carries the meaning,
 * so the status is never communicated by colour alone.
 */
export function StatusDot({
  label,
  tone = "green",
  className = "",
}: {
  label: string;
  tone?: "green" | "lime" | "cyan";
  className?: string;
}) {
  const dot =
    tone === "lime" ? "bg-accent-lime" : tone === "cyan" ? "bg-accent-cyan" : "bg-accent-green";

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-content-secondary ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot} animate-pulseDot`}
      />
      {label}
    </span>
  );
}
