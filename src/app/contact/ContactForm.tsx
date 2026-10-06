"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  initialEmail?: string;
  isEmailReadOnly?: boolean;
}

export default function ContactForm({ initialEmail, isEmailReadOnly }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: initialEmail ?? "",
    message: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialEmail) {
      setFormState((prev) => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    // Client-side validation matching API requirements
    if (formState.name.trim().length < 2) {
      setError("Please provide your name (at least 2 characters).");
      return;
    }

    if (formState.message.trim().length < 10) {
      setError("Please enter at least 10 characters in your message so we can better assist you.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        });

        if (!response.ok) {
          let errorMessage = "We couldn't submit your message just yet.";

          try {
            const data = await response.json();
            // Handle Zod validation errors from API
            if (data?.errors?.fieldErrors) {
              if (data.errors.fieldErrors.message?.[0]) {
                errorMessage = data.errors.fieldErrors.message[0];
              } else if (data.errors.fieldErrors.name?.[0]) {
                errorMessage = data.errors.fieldErrors.name[0];
              }
            }
            // Handle other API errors
            if (data?.error) {
              errorMessage = data.error;
            }
          } catch {
            // If JSON parsing fails, use default message
          }

          throw new Error(errorMessage);
        }

        setFeedback("Thanks for reaching out! We'll get back to you shortly.");
        setFormState({ name: "", email: initialEmail ?? "", message: "" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[12px] font-medium text-slate-500">
            Full name
          </label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={formState.name}
            onChange={handleChange("name")}
            required
            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-green-700 focus:ring-2 focus:ring-[rgba(21,128,61,0.15)]"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[12px] font-medium text-slate-500">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={formState.email}
            onChange={handleChange("email")}
            required
            readOnly={!!isEmailReadOnly}
            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-green-700 focus:ring-2 focus:ring-[rgba(21,128,61,0.15)] disabled:opacity-60"
            disabled={!!isEmailReadOnly}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-[12px] font-medium text-slate-500">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell us what you'd like to achieve with DebotifyText..."
          value={formState.message}
          onChange={handleChange("message")}
          required
          className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-green-700 focus:ring-2 focus:ring-[rgba(21,128,61,0.15)]"
        />
        <p className="text-[12px] text-[13px] text-gray-400">Minimum 10 characters.</p>
      </div>

      {feedback ? (
        <div className="rounded-2xl border border-var(--hl-mint) bg-#faf6f1 px-4 py-3 text-sm text-#5A4529">
          {feedback}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full justify-center rounded-full bg-green-700 px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_16px_30px_-18px_rgba(59,130,246,0.45)] transition hover:bg-var(--hl-mint)"
      >
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

