import Link from "next/link";

export function Logo({
  withTagline = false,
  className = "",
}: {
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" className={`group inline-block leading-none ${className}`}>
      <span className="font-serif text-3xl font-bold tracking-tight text-ink">
        REO<span className="text-[#FD7402]"> Current</span>
      </span>
      {withTagline && (
        <span className="mt-1 block font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Property Preservation &amp; Field Services News
        </span>
      )}
    </Link>
  );
}
