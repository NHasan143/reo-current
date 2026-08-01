"use client";

const BTN =
  "touch-target inline-flex items-center justify-center border border-stroke bg-white px-3.5 py-[7px] text-[12px] font-semibold text-ink transition-colors hover:border-ink";

export function ShareButtons({ title }: { title: string }) {
  function share() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={share} className={BTN}>
        Share
      </button>
      <a href={`mailto:?subject=${encodeURIComponent(title)}`} className={BTN}>
        Email
      </a>
      <button type="button" onClick={() => window.print()} className={BTN}>
        Print
      </button>
    </div>
  );
}
