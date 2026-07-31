import type { Metadata } from "next";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getNewsletters, getTestimonial } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Newsletters",
  description:
    "Join 42,000 contractors, inspectors, and servicing professionals who start their day with REO Current.",
};

const heroStats = [
  { value: "42K+", label: "Subscribers" },
  { value: "4", label: "Newsletters" },
  { value: "7 AM", label: "Daily Delivery" },
];

export default async function NewslettersPage() {
  const [newsletters, testimonial] = await Promise.all([
    getNewsletters(),
    getTestimonial(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[1.5px] text-[#e08a8a]">
              Free Newsletters
            </div>
            <h1 className="mb-4 font-serif text-[36px] font-bold leading-[1.12] md:text-[46px]">
              The intelligence the field-services industry runs on.
            </h1>
            <p className="mb-7 text-[17px] leading-[1.6] text-[#cfd3da]">
              Join 42,000 contractors, inspectors, and servicing professionals
              who start their day with REO Current. Concise, credible, and always
              free.
            </p>

            <dl className="flex flex-wrap gap-7">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-serif text-[30px] font-bold">{stat.value}</dd>
                  <p className="mt-0.5 text-[12px] uppercase tracking-[1px] text-[#9aa1ad]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* Signup card */}
          <div>
            <NewsletterForm newsletters={newsletters} />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-[900px] px-5 py-12 text-center sm:px-6">
          <p className="mb-4 font-serif text-[24px] italic leading-[1.45] text-ink md:text-[26px]">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p className="text-[14px] font-bold text-ink">{testimonial.name}</p>
          <p className="text-[13px] text-gray-500">{testimonial.title}</p>
        </div>
      </section>
    </>
  );
}
