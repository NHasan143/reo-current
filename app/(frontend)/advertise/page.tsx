import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = { title: "Advertise" };

export default function AdvertisePage() {
  return (
    <StaticPage
      title="Advertise with REO Current"
      intro="Reach 42,000 contractors, inspectors, and default-servicing professionals."
    >
      <p>
        REO Current reaches decision-makers across the property-preservation and
        field-services industry through our website and daily newsletters. If
        your product or service helps field companies, servicers, or vendors work
        better, our audience is listening.
      </p>
      <h2>Opportunities</h2>
      <p>
        Newsletter placements in The Morning Wire, sponsored content, and display
        advertising across the site. Custom packages are available.
      </p>
      <h2>Request a media kit</h2>
      <p>
        Email{" "}
        <a href="mailto:advertising@reocurrent.com">advertising@reocurrent.com</a>{" "}
        and we&apos;ll send rates, audience data, and availability.
      </p>
    </StaticPage>
  );
}
