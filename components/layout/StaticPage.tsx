import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/** Simple centred content page (About, Contact, legal, etc.). */
export function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-page py-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          <h1 className="mt-3 font-serif text-[36px] font-bold text-ink md:text-[42px]">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 max-w-[680px] text-[17px] leading-8 text-gray-600">
              {intro}
            </p>
          )}
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mx-auto max-w-[760px] font-serif text-[17px] leading-8 text-[#1f2937] [&_a]:text-brand [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-[1px] [&_h2]:text-ink [&_p]:mb-5">
          {children}
        </div>
      </div>
    </>
  );
}
