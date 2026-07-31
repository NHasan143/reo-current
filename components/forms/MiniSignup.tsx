"use client";

import { useState } from "react";

/**
 * Compact dark newsletter box used in the sidebar ("The Morning Wire",
 * "Follow Sarah's beat"). Front-end only — wire the handler to your ESP where
 * noted.
 */
export function MiniSignup({
  title,
  description,
  cta = "Sign Up Free",
}: {
  title: string;
  description: string;
  cta?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST { email } to your email service provider / WP subscribe route.
    setDone(true);
  }

  return (
    <div className="bg-ink px-5 py-6 text-white">
      <div className="font-serif text-[20px] font-bold">{title}</div>
      <p className="mb-3.5 mt-2 text-[13px] leading-[1.5] text-utility">
        {description}
      </p>

      {done ? (
        <p className="border-t border-white/10 pt-3.5 text-[13px] text-gray-300">
          ✓ You&apos;re in. Check your inbox to confirm.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`mini-${title}`}>
            Email address
          </label>
          {/* 16px below md stops iOS Safari zooming the viewport on focus. */}
          <input
            id={`mini-${title}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mb-2.5 h-11 w-full bg-white px-3 text-[16px] text-ink outline-none md:h-[38px] md:text-[13px]"
          />
          <button
            type="submit"
            className="w-full bg-brand py-2.5 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark"
          >
            {cta}
          </button>
        </form>
      )}
    </div>
  );
}
