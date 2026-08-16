"use client";

import { useId, useState } from "react";

/**
 * Compact dark newsletter box used in the sidebar ("The Morning Wire",
 * "Follow Sarah's beat"). Front-end only — wire the handler to your ESP where
 * noted.
 */
export function MiniSignup({
  title,
  description,
  cta = "Sign Up Free",
  className = "",
}: {
  title: string;
  description: string;
  cta?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  // The id was built from the title ("mini-Follow Sarah's beat"), which is not
  // a valid HTML id — ids may not contain whitespace — so the label never
  // bound to the input. useId also keeps it unique if two boxes share a title.
  const inputId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST { email } to your email service provider / WP subscribe route.
    setDone(true);
  }

  return (
    <div className={`bg-ink px-5 py-8 text-white ${className}`}>
      <div className="font-serif text-[20px] font-bold">{title}</div>
      {/* One of two running-text blurbs that sat at 13px; lifted a step on
          phones for legibility. Labels and secondary text elsewhere stay at
          13px by design. */}
      <p className="mb-3.5 mt-2 text-[14px] leading-[1.5] text-utility sm:text-[13px]">
        {description}
      </p>

      {done ? (
        <p className="border-t border-white/10 pt-3.5 text-[13px] text-gray-300">
          ✓ You&apos;re in. Check your inbox to confirm.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={inputId}>
            Email address
          </label>
          {/* 16px holds to md (where iOS Safari stops zooming on focus); the
              44px height holds to lg, since tablets are still touch.
              outline-none removed the only focus indicator this field had and
              nothing replaced it, so keyboard users had no idea where they
              were — it now takes the same orange ring as the full form. */}
          <input
            id={inputId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mb-2.5 h-11 w-full bg-white px-3 text-[16px] text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FD7402] md:text-[13px] lg:h-[38px]"
          />
          <button
            type="submit"
            className="flex min-h-[44px] w-full items-center justify-center bg-[#FD7402] py-2.5 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-[#FD7402] lg:min-h-0"
          >
            {cta}
          </button>
        </form>
      )}
    </div>
  );
}
