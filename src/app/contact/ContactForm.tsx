'use client';

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isLoading = status === "loading";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          (data as { error?: string })?.error || "Failed to send message."
        );
      }

      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="bg-[#f6f5f4] rounded-[30px] border border-gray-100 w-full max-w-[1346px] mx-auto min-h-[480px] md:min-h-[540px] lg:min-h-[600px] xl:min-h-[680px]">
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-10 lg:p-12 space-y-8 lg:space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl">
          <div className="space-y-2 max-w-[420px] w-full">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-800">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="w-full h-12 rounded-2xl bg-white px-4 text-gray-900 shadow-sm border border-transparent focus:border-[#00B7E3] focus:ring-2 focus:ring-[#00B7E3] focus:outline-none transition"
              placeholder="Your full name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 max-w-[420px] w-full">
            <label htmlFor="email" className="text-sm font-medium text-gray-800">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full h-12 rounded-2xl bg-white px-4 text-gray-900 shadow-sm border border-transparent focus:border-[#00B7E3] focus:ring-2 focus:ring-[#00B7E3] focus:outline-none transition"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2 max-w-[1140px]">
          <label htmlFor="message" className="text-sm font-medium text-gray-800">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={7}
            required
            className="w-full min-h-[220px] sm:min-h-[260px] lg:min-h-[320px] rounded-2xl bg-white px-4 py-3 text-gray-900 shadow-sm border border-transparent focus:border-[#00B7E3] focus:ring-2 focus:ring-[#00B7E3] focus:outline-none transition"
            placeholder="Tell us how we can help..."
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 sm:pt-4">
          <div className="text-sm text-gray-600 min-h-[20px]">
            {status === "success" && (
              <p className="text-green-700 font-semibold">
                Thanks! We received your message.
              </p>
            )}
            {status === "error" && error && (
              <p className="text-red-600 font-semibold">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-9 py-3 rounded-2xl bg-[#00B7E3] text-lg font-semibold text-black shadow-sm hover:bg-[#00A6D1] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
