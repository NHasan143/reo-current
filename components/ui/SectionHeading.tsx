import Link from "next/link";

/** The black 3px-underline heading used for section blocks and sidebars. */
export function SectionHeading({
  title,
  href,
  linkLabel = "View All",
  className = "",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={`rule-heading ${className}`}>
      <span className="rule-label">{title}</span>
      {href && (
        <Link
          href={href}
          className="text-[12px] font-semibold text-brand hover:text-brand-dark"
        >
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
