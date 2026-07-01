"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { validateContact, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-subtle transition-all focus:border-accent focus:ring-2 focus:ring-accent/15 aria-[invalid=true]:border-accent/70 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-accent/15";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""), // honeypot
    };

    // Client-side validation first — instant feedback, no round-trip.
    const fieldErrors = validateContact(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setFormError(null);
      setStatus("error");
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          fieldErrors?: ContactErrors;
        };
        if (body.fieldErrors) setErrors(body.fieldErrors);
        setFormError(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setFormError("Couldn’t reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-surface p-8 shadow-[0_10px_30px_rgba(43,42,40,0.06)]"
      >
        <p className="text-lg text-foreground">
          Thanks — your message is on its way.
        </p>
        <p className="mt-2 text-muted">I’ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Send another →
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot: off-screen, hidden from real users and assistive tech. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label="Name"
        name="name"
        autoComplete="name"
        placeholder="Your name"
        error={errors.name}
        disabled={submitting}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
        disabled={submitting}
      />
      <Field
        label="Message"
        name="message"
        textarea
        placeholder="What’s on your mind?"
        error={errors.message}
        disabled={submitting}
      />

      <div aria-live="polite">
        {formError && (
          <p role="alert" className="text-sm text-accent">
            {formError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  textarea?: boolean;
  error?: string;
  disabled?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  textarea = false,
  error,
  disabled,
}: FieldProps) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    placeholder,
    autoComplete,
    disabled,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `${inputBase} disabled:opacity-60`,
  } as const;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {textarea ? (
        <textarea {...shared} rows={5} className={`${inputBase} resize-y disabled:opacity-60`} />
      ) : (
        <input {...shared} type={type} />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
