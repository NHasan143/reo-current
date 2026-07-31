"use client";

import { useState } from "react";

/**
 * "Load more" control. Hidden items are passed as children (already rendered on
 * the server) and mounted on demand.
 */
export function RevealMore({
  label = "Load More Articles",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);

  if (shown) return <>{children}</>;

  return (
    <div className="mt-9 flex justify-center">
      <button
        type="button"
        onClick={() => setShown(true)}
        className="border border-ink bg-white px-7 py-[11px] text-[13px] font-bold uppercase tracking-[1px] text-ink transition-colors hover:bg-ink hover:text-white"
      >
        {label}
      </button>
    </div>
  );
}
