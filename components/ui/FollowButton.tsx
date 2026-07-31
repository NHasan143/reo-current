"use client";

import { useState } from "react";

export function FollowButton({
  label = "Follow",
  followingLabel = "Following",
  className = "btn-dark",
}: {
  label?: string;
  followingLabel?: string;
  className?: string;
}) {
  const [following, setFollowing] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFollowing((v) => !v)}
      aria-pressed={following}
      className={
        following
          ? "inline-flex items-center justify-center border border-neutral-300 bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink"
          : className
      }
    >
      {following ? followingLabel : label}
    </button>
  );
}
