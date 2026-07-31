import Link from "next/link";

const sections = [
  { label: "Property Preservation", href: "/category/property-preservation" },
  { label: "Field Inspections", href: "/category/field-inspections" },
  { label: "Foreclosure & REO", href: "/category/foreclosure-reo" },
  { label: "Mortgage", href: "/category/mortgage" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Advertise", href: "/advertise" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="mb-3 text-[12px] font-bold uppercase tracking-[1.5px] text-white">
        {title}
      </div>
      {/* Each link fills a 44px touch row below lg. A small gap stays so
          adjacent targets aren't flush — WCAG 2.5.8 wants separation between
          them — widening to the design's spacing on desktop. */}
      <div className="flex flex-col gap-1 text-[13px] lg:gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="touch-target flex items-center text-utility hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-utility">
      <div className="container-page grid grid-cols-2 gap-10 py-10 md:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <div className="font-serif text-[26px] font-bold text-white">
            REO <span className="text-brand-light">Current</span>
          </div>
          <p className="mt-2.5 max-w-xs text-[13px] leading-relaxed">
            Independent reporting on property preservation, field services,
            inspections, and default servicing.
          </p>
        </div>
        <FooterColumn title="Sections" items={sections} />
        <FooterColumn title="Company" items={company} />
        <FooterColumn title="Legal" items={legal} />
      </div>
      <div className="border-t border-[#2a2f38]">
        <div className="container-page py-4 text-center text-[12px]">
          © 2026 REO Current. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
