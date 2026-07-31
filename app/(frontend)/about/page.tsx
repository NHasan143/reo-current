import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <StaticPage
      title="About REO Current"
      intro="Independent reporting on property preservation, field services, inspections, and default servicing."
    >
      <p>
        REO Current is a trade news publication covering the people, companies,
        and policies that shape the default-servicing industry — from HUD
        allowable schedules and conveyance standards to the field crews securing
        and maintaining vacant properties nationwide.
      </p>
      <p>
        Our newsroom tracks regulatory change, pricing, inspections, foreclosure
        and REO trends, and the vendor economy, delivering concise, credible
        coverage that field-services professionals rely on to start their day.
      </p>
      <h2>Our coverage</h2>
      <p>
        We report across property preservation, field inspections, field service
        companies, contractors and vendors, foreclosure and REO, compliance and
        pricing, disaster response, and mortgage servicing.
      </p>
      <h2>Get in touch</h2>
      <p>
        Story tips and feedback are always welcome — reach the newsroom via our{" "}
        <a href="/contact">contact page</a>.
      </p>
    </StaticPage>
  );
}
