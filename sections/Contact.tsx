"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Github, Loader2, Send } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

type Status = "idle" | "sending" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const update = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate(): boolean {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (values.subject.trim().length < 3) next.subject = "Please add a short subject.";
    if (values.message.trim().length < 10) next.message = "Please write at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        errors?: FieldErrors;
        error?: string;
      };

      if (json.errors) {
        setErrors(json.errors);
        setStatus("error");
        return;
      }
      if (res.ok && json.ok) {
        setStatus("success");
        setValues({ name: "", email: "", subject: "", message: "" });
        return;
      }
      setServerMessage(json.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerMessage("Could not reach the server. Please try again, or use GitHub.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-20 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          code="06 // ESTABLISH_CONNECTION"
          title="HAVE SOMETHING INTERESTING?"
          headingId="contact-heading"
          blurb="I'm always interested in good ideas, useful technology, interesting collaborations, and conversations about software."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Direct links */}
          <Reveal className="space-y-4">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="panel group flex items-center gap-4 rounded-md p-5 transition-colors hover:border-line-strong"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-line text-content-primary">
                <Github size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-content-primary">GitHub</span>
                <span className="block font-mono text-[11px] text-content-muted">
                  github.com/{profile.githubUsername}
                </span>
              </span>
            </a>

            <p className="rounded-sm border border-line bg-base-soft/50 p-5 text-sm text-content-secondary">
              No public email or social profiles are listed yet. The contact form on the right is the
              fastest route — or reach out directly through GitHub.
            </p>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            <form onSubmit={onSubmit} noValidate className="panel rounded-md p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="name"
                  label="Name"
                  value={values.name}
                  onChange={update("name")}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={update("email")}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div className="mt-5">
                <Field
                  id="subject"
                  label="Subject"
                  value={values.subject}
                  onChange={update("subject")}
                  error={errors.subject}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="tech-label mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={values.message}
                  onChange={update("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="w-full resize-y rounded-sm border border-line bg-base-soft/70 px-4 py-3 text-sm text-content-primary placeholder:text-content-muted focus:border-accent-cyan focus:outline-none"
                  placeholder="What's on your mind?"
                />
                {errors.message ? (
                  <p id="message-error" className="mt-2 text-xs text-accent-lime">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} aria-hidden="true" />
                    Send message
                  </>
                )}
              </button>

              {/* Live region so screen readers hear the outcome. */}
              <div aria-live="polite" className="mt-4">
                {status === "success" ? (
                  <p className="flex items-start gap-2 rounded-sm border border-accent-green/40 bg-accent-green/5 px-4 py-3 text-sm text-accent-green">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Message sent. Thanks for reaching out — I&apos;ll get back to you.
                  </p>
                ) : null}
                {status === "error" && serverMessage ? (
                  <p className="flex items-start gap-2 rounded-sm border border-accent-lime/40 bg-accent-lime/5 px-4 py-3 text-sm text-accent-lime">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {serverMessage}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="tech-label mb-2 block">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-sm border border-line bg-base-soft/70 px-4 py-3 text-sm text-content-primary placeholder:text-content-muted focus:border-accent-cyan focus:outline-none"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-accent-lime">
          {error}
        </p>
      ) : null}
    </div>
  );
}
