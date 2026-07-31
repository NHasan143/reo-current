"use client";

import { useState } from "react";

export function CommentForm() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    // TODO: POST the comment to Payload (/api/comments) or a moderation queue.
    setSubmitted(true);
    setText("");
  }

  return (
    <div className="mt-7 border border-line2 bg-paper p-[22px]">
      <div className="mb-3 text-[14px] font-bold text-ink">Join the discussion</div>
      {submitted && (
        <p className="mb-3 border border-line2 bg-white px-4 py-3 text-[13px] text-gray-600">
          Thanks — your comment has been submitted for moderation.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="comment" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          className="mb-3 min-h-[90px] w-full resize-y border border-stroke p-3 text-[14px] outline-none focus:border-gray-500"
        />
        <button type="submit" className="btn-dark">
          Post Comment
        </button>
      </form>
    </div>
  );
}
