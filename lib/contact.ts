/**
 * Contact-form validation, shared by the client form (instant feedback) and the
 * API route (authoritative check). Keep this pure — no server-only APIs — so it
 * can run in the browser too.
 */

export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

// Deliberately permissive — good enough to catch typos without rejecting valid
// but unusual addresses. The real check is whether the reply ever bounces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 100,
  email: 200,
  message: 5000,
  messageMin: 10,
} as const;

export function validateContact(data: Partial<ContactFields>): ContactErrors {
  const errors: ContactErrors = {};
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";
  else if (email.length > LIMITS.email) errors.email = "That email is too long.";

  if (!message) errors.message = "Please enter a message.";
  else if (message.length < LIMITS.messageMin)
    errors.message = "Please write a little more (at least 10 characters).";
  else if (message.length > LIMITS.message)
    errors.message = "That message is too long (5000 characters max).";

  return errors;
}
