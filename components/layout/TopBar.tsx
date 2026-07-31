import Link from "next/link";

function formatToday(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function TopBar() {
  return (
    <div className="bg-ink text-utility">
      <div className="container-page flex items-center py-1.5 text-[12px]">
        {/* The three utility links hold ~220px at their current gap, so at 320
            the date is left under 50px of a 280px line — short of even
            "8/1/26" (50px). Rather than cramp the links or wrap the bar onto
            three lines, the date drops out and returns as soon as it fits.
            460px is where the longest date the formatter can produce,
            "Wednesday, September 24, 2026", still holds one line; 480 leaves
            margin. `ml-auto` right-aligns the links in both states — with the
            date hidden, the nav is the only flex child and `justify-between`
            would strand it at the left. */}
        <span className="hidden tracking-[0.4px] min-[480px]:block">
          {formatToday()}
        </span>
        <nav className="ml-auto flex items-center gap-5">
          {/* Opens the latest-news feed (per request). Rename to "Latest" if
              you'd prefer the label to match the destination. */}
          <Link href="/latest" className="text-utility hover:text-white">
            Newsletters
          </Link>
          <Link href="/advertise" className="text-utility hover:text-white">
            Advertise
          </Link>
          <Link
            href="/newsletters"
            className="font-semibold text-white hover:text-white"
          >
            Subscribe
          </Link>
        </nav>
      </div>
    </div>
  );
}
