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
      <div className="container-page flex items-center justify-between py-1.5 text-[12px]">
        <span className="tracking-[0.4px]">{formatToday()}</span>
        <nav className="flex items-center gap-5">
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
