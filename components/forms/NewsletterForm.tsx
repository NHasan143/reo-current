"use client";

import { useState } from "react";
import type { Newsletter } from "@/lib/types";

export function NewsletterForm({ newsletters }: { newsletters: Newsletter[] }) {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(
    newsletters.length ? [newsletters[0].slug] : []
  );
  const [done, setDone] = useState(false);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST { email, selected } to your ESP (or a Payload endpoint).
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-[28px] text-white">
          ✓
        </div>
        <h2 className="mb-2.5 font-serif text-[26px] font-bold text-ink">
          You&apos;re on the list.
        </h2>
        <p className="text-[15px] leading-[1.6] text-gray-600">
          Check your inbox to confirm your subscription. Your first briefing
          arrives tomorrow at 7 AM.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 text-ink">
      <h2 className="mb-1.5 font-serif text-[26px] font-bold">Get started free</h2>
      <p className="mb-5 text-[14px] text-gray-500">No spam. Unsubscribe anytime.</p>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="nl-email"
          className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.8px]"
        >
          Email address
        </label>
        {/* 16px below md stops iOS Safari zooming the viewport on focus. The
            h-12 height already clears the 44px touch minimum at every width. */}
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mb-[18px] h-12 w-full border border-stroke px-3.5 text-[16px] outline-none focus:outline-2 focus:outline-[#FD7402] md:text-[14px]"
        />

        <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.8px]">
          Choose your newsletters
        </div>
        <ul className="space-y-2.5">
          {newsletters.map((nl) => {
            const on = selected.includes(nl.slug);
            return (
              <li key={nl.slug}>
                <button
                  type="button"
                  onClick={() => toggle(nl.slug)}
                  className={`flex w-full items-start gap-3 border p-3 text-left transition-colors ${
                    on ? "border-[#FD7402] bg-[#fbf4f4]" : "border-[#e0e2e7] bg-white"
                  }`}
                >
                  <span
                    className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center border-2 text-[13px] text-white ${
                      on ? "border-[#FD7402] bg-[#FD7402]" : "border-stroke bg-white"
                    }`}
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span>
                    <span className="block text-[14px] font-bold text-ink">
                      {nl.name}
                    </span>
                    <span className="block text-[12px] leading-[1.4] text-gray-500">
                      {nl.description} · {nl.cadence}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="submit"
          className="mt-2 w-full bg-[#FD7402] py-[13px] text-[14px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-[#FD7402]"
        >
          Subscribe Free
        </button>
        <p className="mt-3 text-center text-[11px] leading-[1.5] text-gray-400">
          By subscribing you agree to our{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
