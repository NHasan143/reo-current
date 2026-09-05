import Image from "next/image";
import Link from "next/link";

// All eight categories, in nav order. The band below lays them out four to a
// row, so the first four fill row one and the rest fill row two.
const sections = [
  { label: "Property Preservation", href: "/category/property-preservation" },
  { label: "Field Inspections", href: "/category/field-inspections" },
  {
    label: "Field Service Companies",
    href: "/category/field-service-companies",
  },
  { label: "Contractors & Vendors", href: "/category/contractors-vendors" },
  { label: "Foreclosure & REO", href: "/category/foreclosure-reo" },
  { label: "Compliance & Pricing", href: "/category/compliance-pricing" },
  { label: "Disaster & Field Alerts", href: "/category/disaster-field-alerts" },
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
  listClassName = "flex flex-col gap-1 lg:gap-2",
}: {
  title: string;
  items: { label: string; href: string }[];
  listClassName?: string;
}) {
  return (
    <div>
      <div className="mb-3 text-[12px] font-bold uppercase tracking-[1.5px] text-white">
        {title}
      </div>
      {/* Each link fills a 44px touch row below lg. A small gap stays so
          adjacent targets aren't flush — WCAG 2.5.8 wants separation between
          them — widening to the design's spacing on desktop. */}
      <div className={`text-[13px] ${listClassName}`}>
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
      {/* Sections sits between the logo and Company. Its track is the widest
          of the three link columns so the eight categories fit two abreast,
          four rows deep, at every width — no breakpoint reflow. */}
      <div className="container-page grid grid-cols-2 gap-10 py-10 md:grid-cols-4 lg:grid-cols-[1.6fr_2fr_0.7fr_0.7fr]">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Link
            href="/"
            aria-label="REO Current home"
            className="relative block h-[51px] w-[135px] overflow-hidden"
          >
            <Image
              src="/images/reo-current-footer-logo.png"
              alt="REO Current"
              width={1024}
              height={1024}
              className="absolute left-1/2 top-1/2 h-auto w-[190px] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </Link>
          {/* The other 13px running-text blurb — lifted on phones to match
              the Morning Wire description. */}
          <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed sm:text-[13px]">
            Independent reporting on property preservation, field services,
            inspections, and default servicing.
          </p>
        </div>
        <div className="col-span-2 md:col-span-2 lg:col-span-1">
          <FooterColumn
            title="Sections"
            items={sections}
            listClassName="grid grid-cols-2 gap-x-4 gap-y-1 lg:gap-y-2"
          />
        </div>
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
