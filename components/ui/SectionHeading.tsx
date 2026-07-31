import Link from "next/link";

/** The black 3px-underline heading used for section blocks and sidebars. */
export function SectionHeading({
  title,
  href,
  linkLabel = "View All",
  className = "",
  titleClassName = "",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={`rule-heading ${className}`}>
      <span className={`rule-label ${titleClassName}`}>{title}</span>
      {href && (
        <Link
          href={href}
          className="text-[12px] font-semibold text-[#0E489C] hover:text-[#FD7402]"
        >
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
